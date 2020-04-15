/**
 * populates the modulelist from local Storage
 */
async function populateCustomModuleList(selectModuleList, moduleList) {
    // reset ModuleList
    const selectParentNode = selectModuleList.parentNode;
    let newModuleList = selectModuleList.cloneNode(false); // Make a shallow copy
    selectParentNode.replaceChild(newModuleList, selectModuleList);

    if (!(Object.keys(moduleList).length === 0) && moduleList.constructor === Object) {
        for (let customModule in moduleList) {
            newModuleList.options[newModuleList.options.length] = new Option(moduleList[customModule].acronym);
        }
    }
    return newModuleList;
}

/**
 * Gets the information of the selected modul and
 * updates the forms with the right values.
 */
async function showCustomModuleInformation() {
    let moduleAcronym = "";
    const selectModuleList = document.getElementById("customModulesList");

    const selectedIndex = selectModuleList.selectedIndex
    if (selectedIndex > -1) {
        moduleAcronym = selectModuleList.options[selectedIndex].value;
    }

    const moduleList = (await Helpers.getItemFromLocalStorage("moduleList")).moduleList
    const customModule = moduleList[moduleAcronym];

    document.getElementById("moduleCredits").value = customModule.credits;
    document.getElementById("moduleGrade").value = customModule.grade != 'n/a' ? customModule.grade : '-';
    document.getElementById("moduleMark").value = customModule.mark != 'n/a' ? customModule.mark : '0';
    document.getElementById("moduleAcronym").value = customModule.acronym;
    document.getElementById("moduleYear").value = customModule.year;
    document.getElementById("moduleType").value = customModule.type;

    const moduleSemesterRadios = document.getElementsByName('moduleImplementation');
    for (let i = 0, length = moduleSemesterRadios.length; i < length; i++) {
        if (moduleSemesterRadios[i].value == customModule.semster) {
            moduleSemesterRadios[i].checked = true;
            break;
        }
    }
}

/**
 * populates the year select
 */
function populateYearList() {
    const startYear = (new Date()).getFullYear() - 8;
    const endYear = (new Date()).getFullYear();
    let options = "";

    for (var y = startYear; y <= endYear; y++) {
        options += "<option>" + y + "</option>";
    }
    document.getElementById("moduleYear").innerHTML = options;
}

/**
 * deletes the selected module from local storage
 */
async function removeCustomModule() {
    const moduleList = (await Helpers.getItemFromLocalStorage("moduleList")).moduleList

    const selectModuleList = document.getElementById("customModulesList");

    const selectedIndex = selectModuleList.selectedIndex;
    if (selectedIndex > -1) {
        const selectedModule = selectModuleList.options[selectedIndex].value;
        delete moduleList[selectedModule];
        await Helpers.saveObjectInLocalStorage({ moduleList: moduleList })
    }
    else {
        console.warn("select a module");
    }
    const customModuleList = (await Helpers.getItemFromLocalStorage("moduleList")).moduleList
    newModuleList = populateCustomModuleList(selectModuleList, customModuleList);
    newModuleList.onchange = showCustomModuleInformation;

}

/**
 * adds custom module to local storage
 */
async function addCustomModule() {
    const moduleAcronym = document.getElementById("moduleAcronym").value;
    const moduleType = document.getElementById("moduleType").value;
    const moduleCredits = document.getElementById("moduleCredits").value;
    let moduleGrade = document.getElementById("moduleGrade").value;
    if (moduleGrade == "-") {
        moduleGrade = 'n/a';
    }

    const modulYearList = document.getElementById("moduleYear");
    const moduleYear = modulYearList.options[modulYearList.selectedIndex].value;

    const moduleSemesterRadios = document.getElementsByName('moduleImplementation');
    for (let i = 0, length = moduleSemesterRadios.length; i < length; i++) {
        if (moduleSemesterRadios[i].checked) {
            moduleSemester = moduleSemesterRadios[i].value;
            break;
        }
    }

    let moduleMark = document.getElementById("moduleMark").value;
    if (moduleMark < 1) {
        moduleMark = 'n/a';
    }

    const moduleList = (await Helpers.getItemFromLocalStorage("moduleList")).moduleList

    moduleList[moduleAcronym] = {
        acronym: moduleAcronym,
        type: moduleType,
        credits: moduleCredits,
        mark: moduleMark,
        grade: moduleGrade,
        year: moduleYear,
        semster: moduleSemester
    }
    await Helpers.saveObjectInLocalStorage({ moduleList: moduleList })
    const customModuleList = (await Helpers.getItemFromLocalStorage("moduleList")).moduleList
    const selectModuleList = document.getElementById("customModulesList");
    newModuleList = populateCustomModuleList(selectModuleList, customModuleList);
    newModuleList.onchange = showCustomModuleInformation;
}

async function addDoNotUseModuleInStats() {
    const moduleAcronym = document.getElementById("moduleAcronymModuleInStats").value;
    let ignoreInStatsModules = (await Helpers.getItemFromLocalStorage("ignoreInStatsModules")).ignoreInStatsModules


    let length = (Object.keys(ignoreInStatsModules)).length

    ignoreInStatsModules[moduleAcronym] = {
        acronym: moduleAcronym,
        UseInStats: false
    }
    await Helpers.saveObjectInLocalStorage({ ignoreInStatsModules: ignoreInStatsModules })

    const selectModuleList = document.getElementById("ignoreInStatsModulesList");
    ignoreInStatsModules = (await Helpers.getItemFromLocalStorage("ignoreInStatsModules")).ignoreInStatsModules
    await populateCustomModuleList(selectModuleList, ignoreInStatsModules)
}
async function removeDoNotUseModuleInStats() {
    const ignoreInStatsModules = (await Helpers.getItemFromLocalStorage("ignoreInStatsModules")).ignoreInStatsModules

    const selectModuleList = document.getElementById("ignoreInStatsModulesList");

    const selectedIndex = selectModuleList.selectedIndex;
    if (selectedIndex > -1) {
        const selectedModule = selectModuleList.options[selectedIndex].value;
        delete ignoreInStatsModules[selectedModule];
        await Helpers.saveObjectInLocalStorage({ ignoreInStatsModules: ignoreInStatsModules })
    }
    else {
        console.warn("select a module");
    }
    populateCustomModuleList(document.getElementById("ignoreInStatsModulesList"), (await Helpers.getItemFromLocalStorage("ignoreInStatsModules")).ignoreInStatsModules);
}
async function localizePopup() {
    await i18n.init();

    document.getElementById('textName').innerHTML = i18n.getMessage('Name') + ":"
    document.getElementById('textModuleType').innerHTML = i18n.getMessage('Modultyp') + ":"
    document.getElementById('textYear').innerHTML = i18n.getMessage('Jahr') + ":"
    document.getElementById('textSemester').innerHTML = i18n.getMessage('Semester') + ":"
    document.getElementById('textMark').innerHTML = i18n.getMessage('Noten')
    document.getElementById('textGrad').innerHTML = i18n.getMessage('Grad') + ":"

    // grade and mark comments
    document.getElementById('commentGrade').innerHTML = i18n.getMessage('KommentarGrad')
    document.getElementById('commentMark').innerHTML = i18n.getMessage('KommentarNote')

    // moduletype options
    document.getElementById('optionCoremodule').innerHTML = i18n.getMessage('Kernmodul')
    document.getElementById('optionProjectmodule').innerHTML = i18n.getMessage('Projektmodul')
    document.getElementById('optionExtensionmodule').innerHTML = i18n.getMessage('Erweiterungsmodul')
    document.getElementById('optionMajormodule').innerHTML = i18n.getMessage('Majormodul')
    document.getElementById('optionAdditionalmodule').innerHTML = i18n.getMessage('Zusatzmodul')
    document.getElementById('optionAdditionalmodule').innerHTML = i18n.getMessage('Zusatzmodul')

    // semester selection
    document.getElementById('labelAutumn').innerHTML = i18n.getMessage('Herbst')
    document.getElementById('labelSpring').innerHTML = i18n.getMessage('Fruehling')

    // TODO: Add new string from DoNotUseModuleInStatsOption

}

async function showDoNotUseModuleInStatsOption() {

    const showModuleInStatsOption = document.getElementById('showModuleInStatsOption')
    const customeModulesOption = document.getElementById('customeModulesOption')

    if (showModuleInStatsOption.classList.contains('hidden')) {

        customeModulesOption.classList.add('visuallyhidden');

        customeModulesOption.addEventListener('transitionend', function () {
            customeModulesOption.classList.add('hidden');
            showModuleInStatsOption.classList.remove('hidden')
            customeModulesOption.classList.remove('visuallyhidden');

        }, {
            capture: false,
            once: true,
            passive: false
        });
    }
}

async function showCustomeModulesOption() {
    const showModuleInStatsOption = document.getElementById('showModuleInStatsOption')
    const customeModulesOption = document.getElementById('customeModulesOption')

    if (customeModulesOption.classList.contains('hidden')) {
        showModuleInStatsOption.classList.add('visuallyhidden');

        showModuleInStatsOption.addEventListener('transitionend', function () {
            showModuleInStatsOption.classList.add('hidden');
            customeModulesOption.classList.remove('hidden')
            showModuleInStatsOption.classList.remove('visuallyhidden');

        }, {
            capture: false,
            once: true,
            passive: false
        });
    }

}
/**
 * init function
 */
async function start() {

    await localizePopup();
    populateYearList();

    populateCustomModuleList(document.getElementById("ignoreInStatsModulesList"), (await Helpers.getItemFromLocalStorage("ignoreInStatsModules")).ignoreInStatsModules);
    const newModuleList = populateCustomModuleList(document.getElementById("customModulesList"), (await Helpers.getItemFromLocalStorage("moduleList")).moduleList);
    newModuleList.onchange = showCustomModuleInformation;

    document.getElementById('buttonShowModuleInStatsOption').onclick = showDoNotUseModuleInStatsOption;
    document.getElementById('buttonCustomeModulesOption').onclick = showCustomeModulesOption;

    document.getElementById("submitCustomModule").onclick = addCustomModule;
    document.getElementById("removeCustomModule").onclick = removeCustomModule;

    document.getElementById('submitModuleInStats').onclick = addDoNotUseModuleInStats;
    document.getElementById('removeModuleInStats').onclick = removeDoNotUseModuleInStats;

    // set all options to an empty object once.
    let localStorage = await Helpers.getLocalStorage();
    if (!(localStorage.moduleList)) {
        const moduleList = {};
        await Helpers.saveObjectInLocalStorage({ moduleList: moduleList })
    }
    if (!(localStorage.ignoreInStatsModules)) {
        const ignoreInStatsModules = {};
        await Helpers.saveObjectInLocalStorage({ ignoreInStatsModules: ignoreInStatsModules })
    }



}

window.onload = () => {
    start();
};
