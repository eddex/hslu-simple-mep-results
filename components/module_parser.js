const ModuleParser = {

    /*
     * Update the base module type list for other studies than information science.
     *
     * Sometimes the same module can have a different module type depending on the study (I, WI, ICS, DI etc).
     */
    updateModuleTypeList: async (oldModuleTypeList, jsonFilePath) => {
        let patch = await fetch(Helpers.getExtensionInternalFileUrl(jsonFilePath))
            .then(response => response.json());
        return Object.assign(oldModuleTypeList, patch);
    },

    /*
    * Gets the value ("y") of a specified key ("x") in a 'detail' element of the API response.
    * detail: [
    *   key: "x",
    *   val: "y"
    * ]
    */
    getItemDetailsValueByKey: (details, key) => {

        for (detail of details) {
            if (key == detail.key) {
                return detail.val;
            }
        }
        return '';
    },

    /*
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

    /*
    * Generates an array of module objects using the API and the module type mapping json file.
    */
    generateModuleObjects: async (studyAcronym) => {

        const API_URL = "https://mycampus.hslu.ch/de-ch/api/anlasslist/load/?page=1&per_page=69&total_entries=69&datasourceid=5158ceaf-061f-49aa-b270-fc309c1a5f69";

        const modules = [];

        let moduleTypeList = await fetch(Helpers.getExtensionInternalFileUrl('data/modules_i.json'))
            .then(response => response.json());

        // module types differ for each study
        if (studyAcronym !== "I") {
            moduleTypeList = updateModuleTypeList(moduleTypeList, `data/modules_${String(studyAcronym).toLowerCase()}.json`);
        }

        let anlasslistApiResponse = await fetch(API_URL)
            .then(response => response.json());
        if (!anlasslistApiResponse.items) {
            // Sometimes our requests get blocked. We have to try again later.
            return;
        }

        anlasslistApiResponse.items.forEach(item => {

            let parsedModule = {};

            let passed = item.prop1[0].text == 'Erfolgreich teilgenommen';
            parsedModule.passed = passed;

            parsedModule[MarkKey] = item.note === null ? 'n/a' : item.note;
            parsedModule[GradeKey] = item.grade === null ? 'n/a' : item.grade;

            let details = item.details;
            ItemDetailKeys.forEach(key => {
                let value = ModuleParser.getItemDetailsValueByKey(details, key);
                parsedModule[key] = value;
            });

            let moduleId = ModuleParser.getModuleIdFromModuleName(parsedModule[NameKey]);
            parsedModule[ModuleTypeKey] = moduleTypeList[moduleId];

            modules.push(parsedModule);
        });

        return modules;
    }
}