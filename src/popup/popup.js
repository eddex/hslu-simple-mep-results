//only for development
async function clearLocalStorage() {
    await browser.storage.local.clear()
}


/**
 * populates the Modulelist from local Storage
 */
async function populateModuleList() {
    const moduleList = await getModulList();

    // reset ModulList
    const selectModulList = document.getElementById("modulList");
    const selectParentNode = selectModulList.parentNode;
    let newModulList = selectModulList.cloneNode(false); // Make a shallow copy
    selectParentNode.replaceChild(newModulList, selectModulList);

    if (!(Object.keys(moduleList).length === 0) && moduleList.constructor === Object) {
        for (let customModule in moduleList) {
            newModulList.options[newModulList.options.length] = new Option(moduleList[customModule].acronym);
            newModulList.hidden = false;
        }
    }
    else {
        newModulList.hidden = true;
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
    return await browser.storage.local.get();
}

/**
 * Returns the modulList Object from local Storage
 * @returns {Object} modulList 
 */
async function getModulList() {
    const modulList = await browser.storage.local.get("modulList");
    return modulList.modulList;
}

/**
 * 
 * @param {Object} modulList 
 */
async function setModulList(modulList) {
    await browser.storage.local.set({ modulList })
}

/**
 * deletes the selected module from local storage
 */
async function removeCustomModule() {
    const modulList = await getModulList();
    const selectModulList = document.getElementById("modulList");

    const selectedIndex = selectModulList.selectedIndex
    if (selectedIndex > -1) {
        const selectedModule = selectModulList.options[selectedIndex].value;
        delete modulList[selectedModule]
        await setModulList(modulList)
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

    const modulSemesterRadios = document.getElementsByName('moduleImplementation');
    for (let i = 0, length = modulSemesterRadios.length; i < length; i++) {
        if (modulSemesterRadios[i].checked) {
            modulSemester = modulSemesterRadios[i].value;
            break;
        }
    }

    let moduleMark = document.getElementById("moduleMark").value;
    if (moduleMark < 1) {
        moduleMark = 'n/a';
    }

    // if you reset the storage
    const localStorage = await getLocalStorage();
    if (Object.keys(localStorage).length === 0) {
        const moduleList = {}
        await setModulList(moduleList)
    }

    const modulList = await getModulList();

    modulList[modulAcronym] = {
        acronym: modulAcronym,
        type: moduleType,
        credits: modulCredits,
        mark: moduleMark,
        grade: moduleGrade,
        year: moduleYear,
        semster: modulSemester
    }
    await setModulList(modulList)
}


window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    document.getElementById("submitModul").addEventListener('click', addCustomModule);
    document.getElementById("resetModuls").addEventListener('click', clearLocalStorage);
    document.getElementById("removeModule").addEventListener('click', removeCustomModule);

    //first time
    populateModuleList();
    populateYearList();

    //every time the storage changes(set)
    browser.storage.onChanged.addListener(populateModuleList);

});
