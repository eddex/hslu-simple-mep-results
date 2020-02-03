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

function populateYearList() {
    var year = (new Date()).getFullYear() - 8;
    var till = (new Date()).getFullYear();
    var options = "";
    for (var y = year; y <= till; y++) {
        options += "<option>" + y + "</option>";
    }
    document.getElementById("moduleYear").innerHTML = options;
}

async function clearModules() {
    await browser.storage.local.clear()
}

async function getLocalStorage() {
    return await browser.storage.local.get();
}

async function addItemToLocalStorage(item) {
    browser.storage.local.set(item).then(setItem, onError);
}

async function removeItemFromLocalStorage(item) {
    browser.storage.local.remove(item);
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

async function addCustomModul() {
    let modulAcronym = document.getElementById("modulAcronym").value;
    let moduleType = document.getElementById("moduleType").value;
    let modulCredits = document.getElementById("modulCredits").value;
    let moduleGrade = document.getElementById("moduleGrade").value;
    if (moduleGrade == "-") {
        moduleGrade = 'n/a';
    }

    let modulYearList = document.getElementById("moduleYear")
    let moduleYear = modulYearList.options[modulYearList.selectedIndex].value;

    var modulSemesterRadios = document.getElementsByName('moduleImplementation');
    for (var i = 0, length = modulSemesterRadios.length; i < length; i++) {
        if (modulSemesterRadios[i].checked) {
            modulSemester = modulSemesterRadios[i].value;
            break;
        }
    }

    let moduleMark = document.getElementById("moduleMark").value;
    if (moduleMark < 1) {
        moduleMark = 'n/a';
    }

    let modulList = await getLocalStorage();
    modulList[modulAcronym] = {
        acronym: modulAcronym,
        type: moduleType,
        credits: modulCredits,
        mark: moduleMark,
        grade: moduleGrade,
        year: moduleYear,
        semster: modulSemester
    }
    console.log("modulList[modulAcronym]", modulList[modulAcronym])
    addItemToLocalStorage(modulList);
}

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    submitButton = document.getElementById("submitModul");
    resetButton = document.getElementById("resetModuls");
    deleteButton = document.getElementById("removeModule");
    submitButton.addEventListener('click', addCustomModul);
    resetButton.addEventListener('click', clearModules);
    deleteButton.addEventListener('click', removeModule);

    //first time
    populateModulList();
    populateYearList();

    //every time the storage changes(set)
    browser.storage.onChanged.addListener(populateModulList).then();

});
