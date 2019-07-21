const API_URL = "https://mycampus.hslu.ch/de-ch/api/anlasslist/load/?page=1&per_page=250&total_entries=100&datasourceid=5158ceaf-061f-49aa-b270-fc309c1a5f69"
const KeyECTS = 'ECTS-Punkte';
const KeyGrade = 'Grad';
const KeyMumericMark = 'Bewertung'

const CounterByGrades = {A: 0, B: 0, C: 0, D: 0, E: 0, F: 0};
const GoodGrades = ['A','B','C','D','E'];

let keysOfDesire = ['Nummer', KeyECTS, KeyMumericMark, KeyGrade];
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

function createTableRow(item) {
    let tr = document.createElement('tr');

    let credits = 0;
    let grade = '';
    let numericMark = '';

    keysOfDesire.forEach(key => {
        let td = document.createElement('td');
        let val = getValForKey(item.details, key)
        if (key == KeyECTS) {
            credits = Number(val);
        }
        if (key == KeyGrade) {
            grade = val;
            if (grade != '') {
                CounterByGrades[grade]++;
                totalGrades++;
            }
        }
        if (key == KeyMumericMark) {
            numericMark = val;
        }

        td.appendChild(document.createTextNode(val));
        td.setAttribute('style', 'padding: 2px;');
        tr.appendChild(td)
    });

    if (GoodGrades.includes(grade) || numericMark == 'bestanden') {
        totalCredits += credits;
    }
    return tr;
}

function createModulesTable(div, json) {
    let table = document.createElement('table');

    table.setAttribute('border', '1');
    table.setAttribute('style', 'margin-bottom: 1.6rem; width: 100%; border: 1px solid #415e6c;');

    let header = table.createTHead();
    let row = header.insertRow(0);
    for (let i = 0; i < keysOfDesire.length; i++) {
        let cell = row.insertCell(i);
        cell.innerHTML = keysOfDesire[i];
        cell.setAttribute('style', 'font-weight: bold;padding: 2px;');
    }

    let tbody = document.createElement('tbody');

    json.items.forEach(item => {
        let tr = createTableRow(item);
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    div.insertBefore(table, div.firstChild);
}

function createGradesOverviewTable(div) {
    // Creates an overview table for the single grade and adds a procentual value for each

    return fetch(getExtensionInternalFileUrl('templates/grades_table.html'))
        .then(response => response.text())
        .then(gradesTableTemplate => {
            let gradeOverviewTable = document.createElement('div');

            for (let grade in CounterByGrades) {

                gradesTableTemplate = String(gradesTableTemplate).replace('count-' + grade, CounterByGrades[grade]);

                let gradePercentageRounded = Math.round (10000 * CounterByGrades[grade] / totalGrades) / 100;
                gradesTableTemplate = gradesTableTemplate.replace('percentage-' + grade, gradePercentageRounded + "%");
            }

            gradeOverviewTable.innerHTML = gradesTableTemplate;
            div.insertBefore(gradeOverviewTable, div.firstChild);
    });
}

function createTotalCreditsTitle(div) {
    let creditsOverview = document.createElement('h2');
    creditsOverview.innerText = 'ECTS-Punkte: ' + totalCredits + '/180';
    div.insertBefore(creditsOverview, div.firstChild);
}

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