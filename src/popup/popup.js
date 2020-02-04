
/**
 * populates the Modulelist from local Storage
 */
async function populateModuleList() {
    const moduleList = await getModuleList();

    // reset ModuleList
    const selectModuleList = document.getElementById("moduleList");
    const selectParentNode = selectModuleList.parentNode;
    let newModuleList = selectModuleList.cloneNode(false); // Make a shallow copy
    selectParentNode.replaceChild(newModuleList, selectModuleList);
    newModuleList.addEventListener('change', showCustomModuleInformation);

    if (!(Object.keys(moduleList).length === 0) && moduleList.constructor === Object) {
        for (let customModule in moduleList) {
            newModuleList.options[newModuleList.options.length] = new Option(moduleList[customModule].acronym);
            newModuleList.hidden = false;
        }
    }
    else {
        newModuleList.hidden = true;
    }

}

async function showCustomModuleInformation() {
    let modulAcronym = "";
    const selectModuleList = document.getElementById("moduleList");

    const selectedIndex = selectModuleList.selectedIndex
    if (selectedIndex > -1) {
        modulAcronym = selectModuleList.options[selectedIndex].value;
    }

    const moduleList = await getModuleList();
    const module = moduleList[modulAcronym];

    document.getElementById("modulCredits").value = module.credits;
    document.getElementById("moduleGrade").value = module.grade;
    document.getElementById("moduleMark").value = module.mark;
    document.getElementById("modulAcronym").value = module.acronym;
    document.getElementById("moduleYear").value = module.year;

    const moduleSemesterRadios = document.getElementsByName('moduleImplementation');
    for (let i = 0, length = moduleSemesterRadios.length; i < length; i++) {
        if (moduleSemesterRadios[i].value == module.semster) {
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
 * @returns {Object} local storage 
 */
async function getLocalStorage() {
    if (Helpers.isFirefox()) {
        return await browser.storage.local.get();
    }
    return await chrome.storage.local.get();
}

/**
 * Returns the moduleList Object from local Storage
 * @returns {Object} moduleList 
 */
async function getModuleList() {
    let moduleList = {};

    // if you reset the storage
    const localStorage = await getLocalStorage();
    if (Object.keys(localStorage).length === 0) {
        const moduleList = {}
        await setModuleList(moduleList)
    }

    if (Helpers.isFirefox()) {
        moduleList = await browser.storage.local.get("moduleList");
    }
    else {
        moduleList = await chrome.storage.local.get("moduleList");
    }
    return moduleList.moduleList;
}

/**
 * 
 * @param {Object} moduleList 
 */
async function setModuleList(moduleList) {
    if (Helpers.isFirefox()) {
        await browser.storage.local.set({ moduleList: moduleList })
    }
    else {
        await chrome.storage.local.set({ moduleList: moduleList })
    }
}

/**
 * deletes the selected module from local storage
 */
async function removeCustomModule() {
    const moduleList = await getModuleList();
    const selectModuleList = document.getElementById("moduleList");

    const selectedIndex = selectModuleList.selectedIndex
    if (selectedIndex > -1) {
        const selectedModule = selectModuleList.options[selectedIndex].value;
        delete moduleList[selectedModule]
        await setModuleList(moduleList)
    }
    else {
        console.warn("select a module")
    }
}

/**
 * adds custom module to local storage
 */
async function addCustomModule() {
    const modulAcronym = document.getElementById("modulAcronym").value;
    const moduleType = document.getElementById("moduleType").value;
    const modulCredits = document.getElementById("modulCredits").value;
    const moduleGrade = document.getElementById("moduleGrade").value;
    if (moduleGrade == "-") {
        moduleGrade = 'n/a';
    }

    let modulYearList = document.getElementById("moduleYear")
    let moduleYear = modulYearList.options[modulYearList.selectedIndex].value;

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

    moduleList = await getModuleList();

    moduleList[modulAcronym] = {
        acronym: modulAcronym,
        type: moduleType,
        credits: modulCredits,
        mark: moduleMark,
        grade: moduleGrade,
        year: moduleYear,
        semster: moduleSemester
    }
    await setModuleList(moduleList)
}


window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("submitModul").addEventListener('click', addCustomModule);
    document.getElementById("removeModule").addEventListener('click', removeCustomModule);
    
    //first time
    populateModuleList();
    populateYearList();

    //every time the storage changes(set)
    browser.storage.onChanged.addListener(populateModuleList);

});
