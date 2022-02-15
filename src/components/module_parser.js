/**
* Update the base module type list for other studies than information science.
*
* Sometimes the same module can have a different module type depending on the study (I, WI, ICS, DI etc).
*/
const updateModuleTypeList = async (oldModuleTypeList, jsonFilePath) => {
    let patch = await fetch(Helpers.getExtensionInternalFileUrl(jsonFilePath))
        .then(response => response.json());
    return Object.assign(oldModuleTypeList, patch);
}

const ModuleParser = {

    /**
     * Check if a module was done in Autumn.
     * Modules are marked with 'H' for 'Herbstsemester' (autumn)
     * or 'F' for 'Frühlingssemester' (spring).
     */
    isAutumnSemester: (hsluModuleName) => {
        const includesH = hsluModuleName.split('.')[2].includes('H');
        const includesF = hsluModuleName.split('.')[2].includes('F');
        return includesH || includesF ? includesH : undefined;
    },

    /**
     * Calculate the semester.
     *
     * @param {string} hsluModuleName: is the 'anlassnumber',
     *  e.g. 'I.BA_BCHAIN.H1901'.
     */
    calculateSemester: (hsluModuleName, firstModule) => {
        let semester = undefined;

        const startYear = new Date(firstModule.from).getFullYear();
        const isStartInAutumn = ModuleParser.isAutumnSemester(firstModule.anlassnumber);

        const lastPart = hsluModuleName.split('.')[2];
        if (lastPart === undefined) {
            // we need this early abort because of entries like 'I.WEIHNACHT_19'
            // (which is not even a real module!)
            return semester;
        }

        const moduleYear = Number('20' + lastPart.substring(1, 3));
        const isModuleInAutumn = ModuleParser.isAutumnSemester(hsluModuleName);

        const yearDifference = (moduleYear - startYear)

        if (isModuleInAutumn === undefined) {
            // we need this early abort because of entries like 'I.BA_PTA_b.1618'
            // (which is not even a real module!)
            return semester;
        }

        if (isStartInAutumn) {
            if (isModuleInAutumn) {
                semester = yearDifference * 2 + 1;
            }
            else {
                semester = yearDifference * 2;
            }
        } else {
            if (isModuleInAutumn) {
                semester = yearDifference * 2 + 2;
            }
            else {
                semester = yearDifference * 2 + 1;
            }
        }
        return semester;
    },

    /**
    * The module name includes the module id.
    * But there are different formats for the module names.
    *
    * Modules that are parsed:
    *   Usually a module name looks like this: I.BA_IPCV.F1901
    *   There are modules that have a suffix after a second underscore: I.BA_AISO_E.F1901
    *
    * Modules that are not parsed:
    *   There are modules without underscores in the name: I.ANRECHINDIVID.F1901
    *   Only the ANRECHINDIVID module is known to have this format.
    *   Probably counted as 'Erweiterungsmodul'.
    */
    getModuleIdFromModuleName: (moduleName) => {

        let name = String(moduleName);

        if (name.includes('_')) {

            // for module names like I.BA_AISO_E.F1901
            name = name.split('_')[1];

            // module names like I.BA_IPCV.F1901 need an additional split
            if (name.includes('.')) {
                name = name.split('.')[0];
            }
            return name;
        }
        else if (name.includes('.')) {

            // for module names like I.ANRECHINDIVID.F1901
            return name.split('.')[1];
        }
        else {
            console.log('module id not parseable: ' + moduleName);
            return null;
        }
    },
    /**
     *  check if a module is valid
     *  the modulename should look like this: I.BA_ANLS.F1901
     */
    validateModuleName: (moduleName) => {
        /**
         * '^'      matches the beginning of the string, or the beginning of a line
         * '(\w+)'  matches every word characters
         * '\.'     matches 1x '.' character
         * '(.+)'   matches every character and following
         * '[FH]'   matches if 'F' or 'H'
         * '\d{4}'  matches 4 digit character
         *
         * Only if all of them are matching in the right order test() returns true
         * */
        const moduleNameRegex = /^(\w+)\.(.+)\.[FH]\d{4}/g;
        if (moduleNameRegex.test(moduleName)) {
            return true
        }
        return false
    },
    /**
     *  list of modules that should be ignored to calculate the first semester
     *  check if moduleName matches ignore pattern
     */
    shouldModuleBeIgnored: (hsluModuleName) => {
        const ignoreModulePatterns = ['INFO_ABEND'];
        let dontIgnore = true;
        ignoreModulePatterns.forEach(ignorePattern => {
            if(hsluModuleName.includes(ignorePattern)) {
                console.log(`ignoring module ${hsluModuleName} for first semester calculation`)
                dontIgnore = false;
            }
        })

        return dontIgnore;
    },
    /**
    * Generates an array of module objects using the API and the module type mapping json file.
    */
    generateModuleObjects: async (studyAcronym) => {

        const API_URL = "https://mycampus.hslu.ch/de-ch/api/anlasslist/load/?page=1&per_page=69&total_entries=69&datasourceid=5158ceaf-061f-49aa-b270-fc309c1a5f69";

        const modules = [];

        let moduleTypeList = await fetch(Helpers.getExtensionInternalFileUrl('data/modules_i.json'))
            .then(response => response.json());

        // module types differ for each study
        if (studyAcronym && studyAcronym !== "I") {
            moduleTypeList = await updateModuleTypeList(moduleTypeList, `data/modules_${String(studyAcronym).toLowerCase()}.json`);
        }

        let anlasslistApiResponse = await fetch(API_URL)
            .then(response => response.json());
        if (!anlasslistApiResponse.items) {
            // Sometimes our requests get blocked. We have to try again later.
            console.log(`API request failed: ${JSON.stringify(anlasslistApiResponse)}`);
            return;
        }

        firstModule = anlasslistApiResponse.items
            .slice()
            .reverse()
            //check if module is is in the ignore list
            .filter(modul => ModuleParser.shouldModuleBeIgnored(modul.anlassnumber))
            .find(modul => ModuleParser.isAutumnSemester(modul.anlassnumber) != undefined);

        const passedMessage = await i18n.getMessage("Bestanden");
        const ignoreInStatsModules = (await Helpers.getItemFromLocalStorage("ignoreInStatsModules")).ignoreInStatsModules;
        let myCampusModulesList = {}

        anlasslistApiResponse.items.forEach(item => {
            let parsedModule = {};
            if (ModuleParser.validateModuleName(item.anlassnumber)) {
                parsedModule.semester = ModuleParser.calculateSemester(item.anlassnumber, firstModule);
            }
            else {
                console.log("Not valid modulename: ", item.anlassnumber);
                parsedModule.semester = undefined
            }

            let passed = item.prop1[0].text == 'Erfolgreich teilgenommen';
            parsedModule.passed = passed;

            if (item.note != null) {
                parsedModule.mark = item.note;
            }
            else if (passed) {
                parsedModule.mark = passedMessage;
            }
            else {
                parsedModule.mark = 'n/a';
            }
            parsedModule.grade = item.grade === null ? 'n/a' : item.grade;
            parsedModule.name = item.anlassnumber;
            parsedModule.from = item.from;
            parsedModule.to = item.to;
            parsedModule.credits = item.ects;

            const moduleId = ModuleParser.getModuleIdFromModuleName(parsedModule.name);
            parsedModule.moduleType = moduleTypeList[moduleId];

            // all modules from SZ (Sprachzentrum) are 'Zusatzmodul'
            if (parsedModule.name.includes('_SZ') || parsedModule.name.includes('SZ_')) {
                parsedModule.moduleType = 'Zusatzmodul'
            }

            // sets the UseInStats to true by default
            parsedModule.UseInStats = true;
            if (ignoreInStatsModules != undefined && ignoreInStatsModules[parsedModule.name]) {
                parsedModule.UseInStats = false;
            }
            myCampusModulesList[parsedModule.name] = {
                acronym: parsedModule.name,
            }

            modules.push(parsedModule);
        });
        // Save modules from MyCampus to local storage for the popup
        await Helpers.saveObjectInLocalStorage({ hsluModules: myCampusModulesList })

        //add custom modules from local storage
        let moduleList = (await Helpers.getItemFromLocalStorage("moduleList")).moduleList
        for (const customModuleName in moduleList) {
            if (moduleList.hasOwnProperty(customModuleName)) {
                const customModule = moduleList[customModuleName];

                let parsedModule = {};
                parsedModule.passed = customModule.grade == 'F' ? false : true;
                parsedModule.mark = customModule.mark;
                parsedModule.grade = customModule.grade;
                parsedModule.type = customModule.type;
                parsedModule.credits = customModule.credits;
                parsedModule.moduleType = customModule.type;

                //create modul number
                let moduleName = "M." + customModule.acronym + "." + customModule.semster + customModule.year.slice(customModule.year.length - 2) + "01"
                parsedModule.name = moduleName;
                parsedModule.semester = ModuleParser.calculateSemester(moduleName, firstModule);
                parsedModule.UseInStats = true;
                modules.push(parsedModule);
            }
        }
        return modules;
    }
}
