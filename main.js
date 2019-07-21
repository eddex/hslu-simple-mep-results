const API_URL = "https://mycampus.hslu.ch/de-ch/api/anlasslist/load/?page=1&per_page=250&total_entries=100&datasourceid=5158ceaf-061f-49aa-b270-fc309c1a5f69"
const KeyECTS = 'ECTS-Punkte';
const KeyGrade = 'Grad';
const KeyNumericMark = 'Bewertung'

const CounterByGrades = {A: 0, B: 0, C: 0, D: 0, E: 0, F: 0};
const GoodGrades = ['A','B','C','D','E'];
const KeysOfDesire = ['Nummer', KeyECTS, KeyNumericMark, KeyGrade];

let totalCredits = 0;
let totalGrades = 0;

function getValForKey(details, key) {

    for (detail of details) {
        if (key == detail.key) {
            return detail.val;
        }
    }
    return '';
}

/*
 * Creates one row of the modules table by parsing one 'item' of the JSON data.
 * At the same time collects data about the total numbers of grades, credits and marks.
 */
function createModulesTableRow(item) {
    let tr = document.createElement('tr');

    let credits = 0;
    let grade = '';
    let numericMark = '';

    KeysOfDesire.forEach(key => {
        let td = document.createElement('td');
        let val = getValForKey(item.details, key)
        if (key == KeyECTS) {
            credits = Number(val);
        }
        if (key == KeyGrade) {
            grade = val;
        }
        if (key == KeyNumericMark) {
            numericMark = val;
        }
        td.appendChild(document.createTextNode(val));
        tr.appendChild(td)
    });

    if (grade != '') {
        CounterByGrades[grade]++;
        totalGrades++;
    }
    if (GoodGrades.includes(grade) || numericMark == 'bestanden') {
        totalCredits += credits;
    }
    return tr;
}

/*
 * Dynamically creates a table that contains all modules the student has visited.
 * Shows Module Identifier (Nummer), Credits (ECTS), Numeric Mark (1-6) and Grade (A-F).
 */
function createModulesTable(div, json) {
    let table = document.createElement('table');

    let header = table.createTHead();
    let row = header.insertRow(0);
    for (let i = 0; i < KeysOfDesire.length; i++) {
        let cell = row.insertCell(i);
        cell.innerHTML = KeysOfDesire[i];
        cell.setAttribute('style', 'font-weight: bold');
    }

    let tbody = document.createElement('tbody');

    json.items.forEach(item => {
        let tr = createModulesTableRow(item);
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    div.insertBefore(table, div.firstChild);
}

/*
 * Creates a table that puts each possible grade (A-F) in comparison.
 * Shown is, how many timea a grade has been achieved and the percentage,
 * in comparison with the other grades.
 */
function createGradesOverviewTable(div) {

    return fetch(getExtensionInternalFileUrl('templates/grades_table.html'))
        .then(response => response.text())
        .then(gradesTableTemplate => {
            let gradeOverviewTable = document.createElement('div');

            for (let grade_id in CounterByGrades) {

                gradesTableTemplate = String(gradesTableTemplate).replace('count-' + grade_id, CounterByGrades[grade_id]);

                let gradePercentageRounded = Math.round (10000 * CounterByGrades[grade_id] / totalGrades) / 100;
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
    let creditsOverview = document.createElement('h2');
    creditsOverview.innerText = 'ECTS-Punkte: ' + totalCredits + '/180';
    div.insertBefore(creditsOverview, div.firstChild);
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

fetch(API_URL)
.then(response => response.json())
.then(data => {
    let div = document.getElementsByClassName('row teaser-section None')[0];
    createModulesTable(div, data);
    createGradesOverviewTable(div)
    .then(() => createTotalCreditsTitle(div));
})
.catch(e => {
    console.log("Booo");
    console.log(e);
});