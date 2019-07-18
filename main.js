const Url = "https://mycampus.hslu.ch/de-ch/api/anlasslist/load/?page=1&per_page=250&total_entries=100&datasourceid=5158ceaf-061f-49aa-b270-fc309c1a5f69"
const KeyECTS = 'ECTS-Punkte';
const KeyGrad = 'Grad';

const counterByGrads = {A: 0, B: 0, C: 0, D: 0, E: 0, F: 0};
const goodGrades = ['A','B', 'C','D','E'];


let totalCredits = 0;
let keysOfDesire = ['Nummer', KeyECTS, 'Bewertung', KeyGrad];
let totalGrads = 0;

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
    let grad = '';
    let rating = '';

    keysOfDesire.forEach(key => {
        let td = document.createElement('td');
        let val = getValForKey(item.details, key)
        if (key == KeyECTS) {
            credits = Number(val);
        }
        if (key == KeyGrad) {
            grad = val;
            if (grad != "") {
                counterByGrads[grad]++;  
                totalGrads++;
            }
        }
        if (key == 'Bewertung') {
            rating = val;
        }

        td.appendChild(document.createTextNode(val));
        tr.appendChild(td);
    });

    if (goodGrades.includes(grad) || rating == 'bestanden') {
        totalCredits += credits;
    }
    return tr;
}

function createTable(div, json) {
    let table = document.createElement('table');

    table.setAttribute('border', '1');
    table.setAttribute('style', 'margin-bottom: 10px; width: 100%;');

    let header = table.createTHead();
    let row = header.insertRow(0);
    for (let i = 0; i < keysOfDesire.length; i++) {
        let cell = row.insertCell(i);
        cell.innerHTML = keysOfDesire[i];
        cell.setAttribute('style', 'font-weight: bold;');
    }

    let tbody = document.createElement('tbody');

    json.items.forEach(item => {
        let tr = createTableRow(item);
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    div.insertBefore(table, div.firstChild);
}

function createOverview(div) {
    // Adds the Creditoverview 
    let creditsOverview = document.createElement('h2');
    creditsOverview.innerText = 'ECTS-Punkte: ' + totalCredits + '/180';
    div.insertBefore(creditsOverview, div.firstChild);

    // Creates an Overviewtable for the single Grad and adds a procentual value for each
    let gradOverviewTable = document.createElement('table');
    let tbody = document.createElement('tbody');

    gradOverviewTable.setAttribute('border', '1');
    gradOverviewTable.setAttribute('style', 'margin-bottom: 10px; width: 100%;');

    let header = gradOverviewTable.createTHead();
    let row = header.insertRow(0);

    let trGrad = document.createElement('tr');
    let trTotalByGrad = document.createElement('tr');
    let trGradInProcent = document.createElement('tr');

    for (let Grad in counterByGrads) {

        let tdGrad = document.createElement('td');
        tdGrad.appendChild(document.createTextNode(Grad));

        let tdCounterByGrads = document.createElement('td');
        tdCounterByGrads.appendChild(document.createTextNode(counterByGrads[Grad]));

        let tdGradInProcent = document.createElement('td');
        tdGradInProcent.appendChild(document.createTextNode(100 * counterByGrads[Grad] / totalGrads + "%"));

        trGrad.appendChild(tdGrad);
        trTotalByGrad.appendChild(tdCounterByGrads);
        trGradInProcent.appendChild(tdGradInProcent);

        tbody.appendChild(trGrad);
        tbody.appendChild(trTotalByGrad);
        tbody.appendChild(trGradInProcent);
    }

    gradOverviewTable.appendChild(tbody);
    creditsOverview.appendChild(gradOverviewTable);
}

fetch(Url).then(function(response) {
    return response.json();
}).then(function(data) {
    let div = document.getElementsByClassName('row teaser-section None')[0];
    createTable(div, data);
    createOverview(div);
}).catch(function(e) {
    console.log("Booo");
    console.log(e);
});