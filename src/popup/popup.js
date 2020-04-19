/**
 * Populates the modulelist from local Storage
 */
function populateCustomModuleList(selectModuleList, moduleList) {
    // reset ModuleList
    const selectParentNode = selectModuleList.parentNode;
    let newModuleList = selectModuleList.cloneNode(false); // Make a shallow copy
    selectParentNode.replaceChild(newModuleList, selectModuleList);
    if (moduleList != undefined) {
        if (!(Object.keys(moduleList).length === 0) && moduleList.constructor === Object) {
            for (let customModule in moduleList) {
                newModuleList.options[newModuleList.options.length] = new Option(customModule);
            }
        }
    }
    return newModuleList;
}

/**
 * Gets the information of the selected modul and
 * updates the forms with the right values.
 */
async function loadCustomModuleInformation() {
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
 * Populates the year select
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
 * Deletes the selected module from local storage
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
    newModuleList.onchange = loadCustomModuleInformation;

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
    newModuleList.onchange = loadCustomModuleInformation;
}

/**
 * Adds a module to the ignore list
 * The module won't show up in the Extension stats
 */
async function addModuleToIgnoreList() {
    const allHsluModulesList = document.getElementById('allHsluModulesList');
    let ignoreInStatsModules = (await Helpers.getItemFromLocalStorage("ignoreInStatsModules")).ignoreInStatsModules

    const selectedIndex = allHsluModulesList.selectedIndex
    if (selectedIndex > -1) {
        moduleAcronym = allHsluModulesList.options[selectedIndex].value;
    }
    console.log(moduleAcronym)
    ignoreInStatsModules[moduleAcronym] = {
        acronym: moduleAcronym,
        UseInStats: false
    }
    await Helpers.saveObjectInLocalStorage({ ignoreInStatsModules: ignoreInStatsModules })

    const selectModuleList = document.getElementById("ignoreInStatsModulesList");
    ignoreInStatsModules = (await Helpers.getItemFromLocalStorage("ignoreInStatsModules")).ignoreInStatsModules
    //populateCustomModuleList(selectModuleList, ignoreInStatsModules)
    updateRemoveModuleLists()
}

/**
 * Removes a module from the ignore list
 */
async function removeModuleFromIgnoreList() {
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
    updateRemoveModuleLists();
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

    // TODO: Add new string from "Remove Module" Option

}

/**
 * Shows the selected Option and hides the active one
 * @param {*} selectedOption 
 */
function showOption(clickedButton, selectedOption) {

    // marks the associated option button as "active"
    const buttons = document.getElementsByClassName('button');
    for (let index = 0; index < buttons.length; index++) {
        const button = buttons[index];
        if (button.classList.contains('button-selected')) {
            button.classList.remove('button-selected');
        }
    }
    clickedButton.classList.add('button-selected');

    if (selectedOption.classList.contains('hidden')) {
        const options = document.getElementsByClassName('option');
        for (let index = 0; index < options.length; index++) {
            const option = options[index];
            if (!(option.classList.contains('hidden'))) {

                option.classList.add('visuallyhidden');

                option.addEventListener('transitionend', function () {
                    option.classList.add('hidden');
                    selectedOption.classList.remove('hidden')

                    option.classList.remove('visuallyhidden');

                }, {
                    capture: false,
                    once: true,
                    passive: false
                });
            }
        }
    }

}

/**
 * Updates the two lists for the "Remove Module" option
 */
async function updateRemoveModuleLists() {
    const hsluModules = (await Helpers.getItemFromLocalStorage('hsluModules')).hsluModules;
    const ignoreInStatsModules = (await Helpers.getItemFromLocalStorage("ignoreInStatsModules")).ignoreInStatsModules;
    for (let ignoreInStatsModule in ignoreInStatsModules) {
        delete hsluModules[ignoreInStatsModule];
    }
    populateCustomModuleList(document.getElementById('allHsluModulesList'), hsluModules);
    populateCustomModuleList(document.getElementById("ignoreInStatsModulesList"), ignoreInStatsModules);
}

/**
 * init function
 */
async function start() {

    await localizePopup();
    populateYearList();

    updateRemoveModuleLists();

    const customModulesList = populateCustomModuleList(document.getElementById("customModulesList"), (await Helpers.getItemFromLocalStorage("moduleList")).moduleList);
    customModulesList.onchange = loadCustomModuleInformation;

    document.getElementById('showCustomeModulesOption').onclick = function (clickEvent) { showOption(clickEvent.target, document.getElementById('customeModuleOption')) };
    document.getElementById('showRemoveModuleOption').onclick = function (clickEvent) { showOption(clickEvent.target, document.getElementById('removeModuleOption')) };

    document.getElementById("addCustomModule").onclick = addCustomModule;
    document.getElementById("removeCustomModule").onclick = removeCustomModule;

    document.getElementById('addModuleToIgnoreList').onclick = addModuleToIgnoreList;
    document.getElementById('removeModuleFromIgnoreList').onclick = removeModuleFromIgnoreList;

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
