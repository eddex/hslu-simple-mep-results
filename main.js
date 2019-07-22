const API_URL = "https://mycampus.hslu.ch/de-ch/api/anlasslist/load/?page=1&per_page=250&total_entries=100&datasourceid=5158ceaf-061f-49aa-b270-fc309c1a5f69"
const KeyECTS = 'ECTS-Punkte';
const KeyGrade = 'Grad';
const KeyNumericMark = 'Bewertung';
const KeyModuleIdentifier = 'Nummer';

const CounterByGrades = {A: 0, B: 0, C: 0, D: 0, E: 0, F: 0};
const GoodGrades = ['A','B','C','D','E'];
const KeysOfDesire = [KeyModuleIdentifier, KeyECTS, KeyNumericMark, KeyGrade];
const ModuleTableHeaders = [KeyModuleIdentifier, 'Modul-Typ', KeyECTS, KeyNumericMark, KeyGrade]

let totalCredits = 0;
let totalGrades = 0;
let totalNumericMark = 0;
let numberOfNumericMarks = 0;
let totalNumericMarkWithF = 0;
let numberOfNumericMarksWithF = 0;

/*
 * Gets the value ("y") of a specified key ("x") in a 'detail' element of the API response.
 * detail: [
 *   key: "x",
 *   val: "y"
 * ]
 */
function getValForKey(details, key) {

    for (detail of details) {
        if (key == detail.key) {
            return detail.val;
        }
    }
    return '';
}

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
function getModuleIdFromModuleName(moduleName) {
    name = String(moduleName)

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
}

/*
 * Creates one row of the modules table by parsing one 'item' of the JSON data.
 * At the same time collects data about the total numbers of grades, credits and marks.
 */
function createModulesTableRow(item, moduleTypeList) {
    let tr = document.createElement('tr');

    let credits = 0;
    let grade = '';
    let numericMark = '';

    KeysOfDesire.forEach(key => {
        let td = document.createElement('td');
        let val = getValForKey(item.details, key)
        td.appendChild(document.createTextNode(val));
        tr.appendChild(td);

        if (key == KeyModuleIdentifier) {
            td = document.createElement('td');
            let moduleId = getModuleIdFromModuleName(val);
            if (moduleId != null) {

                if (moduleTypeList.hasOwnProperty(moduleId)) {
                    td.appendChild(document.createTextNode(moduleTypeList[moduleId]))
                }
                else {
                    console.log('no type found for: ' + moduleId)
                }
            }
            tr.appendChild(td);
        }
        if (key == KeyECTS) {
            credits = Number(val);
        }
        if (key == KeyGrade) {
            grade = val;
        }
        if (key == KeyNumericMark) {
            numericMark = val;
        }
    });

    if (grade != '') {
        CounterByGrades[grade]++;
        totalGrades++;
    }
    if (GoodGrades.includes(grade) || numericMark == 'bestanden') {
        totalCredits += credits;
    }
    // if cell is empty, Number() returns 0!
    numericMark = Number(numericMark)
    if (!isNaN(numericMark) && numericMark != 0) {
        totalNumericMarkWithF += numericMark;
        numberOfNumericMarksWithF++;
        if (GoodGrades.includes(grade)) {
            totalNumericMark += numericMark;
            numberOfNumericMarks++;
        }
    }
    return tr;
}

/*
 * Dynamically creates a table that contains all modules the student has visited.
 * Shows Module Identifier (Nummer), Credits (ECTS), Numeric Mark (1-6) and Grade (A-F).
 */
function createModulesTable(div, json) {

    return fetch(getExtensionInternalFileUrl('data/modules_i.json'))
        .then(response => response.json())
        .then(moduleTypeList => {
            let table = document.createElement('table');

            let header = table.createTHead();
            let row = header.insertRow(0);
            for (let i = 0; i < ModuleTableHeaders.length; i++) {
                let cell = row.insertCell(i);
                cell.innerHTML = ModuleTableHeaders[i];
                cell.setAttribute('style', 'font-weight: bold');
            }

            let tbody = document.createElement('tbody');

            json.items.forEach(item => {
                let tr = createModulesTableRow(item, moduleTypeList);
                tbody.appendChild(tr);
            });

            table.appendChild(tbody);
            div.insertBefore(table, div.firstChild);
        });
}

/*
 * Creates a table that puts each possible grade (A-F) in comparison.
 * Shown is, how many time a grade has been achieved and the percentage,
 * in comparison with the other grades.
 */
function createGradesOverviewTable(div) {

    return fetch(getExtensionInternalFileUrl('templates/grades_table.html'))
        .then(response => response.text())
        .then(gradesTableTemplate => {
            let gradeOverviewTable = document.createElement('div');

            for (let grade_id in CounterByGrades) {

                gradesTableTemplate = String(gradesTableTemplate).replace('count-' + grade_id, CounterByGrades[grade_id]);

                let gradePercentageRounded = Math.round(10000 * CounterByGrades[grade_id] / totalGrades) / 100;
                gradesTableTemplate = gradesTableTemplate.replace('percentage-' + grade_id, gradePercentageRounded + "%");
            }

            gradeOverviewTable.innerHTML = gradesTableTemplate;
            div.insertBefore(gradeOverviewTable, div.firstChild);
    });
}

/*
 * Create a header that displays the number of achieved credits.
 */
function createTotalCreditsTitle(div) {
    let totalCreditsTitle = document.createElement('h2');
    totalCreditsTitle.innerText = 'ECTS-Punkte: ' + totalCredits + '/180';
    div.insertBefore(totalCreditsTitle, div.firstChild);
}

/*
 * Create a header that displays the average mark over all modules.
 * Modules with grade F are not counted in the average.
 * A second average is displayed, where the modules with grade F are
 *  taken into account.
 */
function createAverageMarkTitle(div) {
    let averageMarkTitle = document.createElement('h2');
    let average = Math.round(totalNumericMark / numberOfNumericMarks * 100) / 100;
    let averageWithF = Math.round(totalNumericMarkWithF / numberOfNumericMarksWithF * 100) / 100;
    averageMarkTitle.innerText = 'Noten Ø: ' + average;
    averageMarkTitle.innerText += ' (Ø mit F: ' + averageWithF + ')';
    div.insertBefore(averageMarkTitle, div.firstChild);
}

/*
 * Helper method to read a file that is included in this browser extension.
 * The file needs to be registered in manifest.json!
 * Chome and Firefox have different APIs for this.
 */
function getExtensionInternalFileUrl(filePath) {
    let internal_file;
    if (typeof browser !== 'undefined') {
        // firefox
        internal_file = browser.runtime.getURL(filePath);
    }
    else {
        // chrome
        internal_file = chrome.runtime.getURL(filePath);
    }
    return internal_file;
}

function injectCustomCss(div) {

    return fetch(getExtensionInternalFileUrl('templates/custom_styles.css'))
        .then(response => response.text())
        .then(css => {
            let style = document.createElement('style');
            style.innerText = css;
            div.insertBefore(style, div.firstChild);
    });
}

fetch(API_URL)
.then(response => response.json())
.then(data => {
    let div = document.getElementsByClassName('row teaser-section None')[0];
    createModulesTable(div, data)
    .then(() => createTotalCreditsTitle(div))
    .then(() => createGradesOverviewTable(div))
    .then(() => createAverageMarkTitle(div))
    .then(() => injectCustomCss(div));
})
.catch(e => {
    console.log("Booo");
    console.log(e);
});