const Url = "https://mycampus.hslu.ch/de-ch/api/anlasslist/load/?page=1&per_page=250&total_entries=100&datasourceid=5158ceaf-061f-49aa-b270-fc309c1a5f69"
const KeyECTS = 'ECTS-Punkte';
const KeyGrad = 'Grad'

let totalCredits = 0
let keysOfDesire = ['Nummer', KeyECTS, 'Bewertung', KeyGrad]

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

    keysOfDesire.forEach(key => {
        let td = document.createElement('td');
        let val = getValForKey(item.details, key)
        if (key == KeyECTS) {
            credits = Number(val);
        }
        if (key == KeyGrad) {
            grad = val;
        }
        td.appendChild(document.createTextNode(val))
        tr.appendChild(td)
    });

    if (grad != 'F') {
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
        cell.setAttribute('style', 'font-weight: bold;')
    }

    var tbody = document.createElement('tbody');

    json.items.forEach(item => {
        let tr = createTableRow(item);
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    div.insertBefore(table, div.firstChild)
}

function createOverview(div) {
    let h2 = document.createElement('h2');
    h2.innerText = 'ECTS-Punkte: ' + totalCredits + '/180';
    div.insertBefore(h2, div.firstChild)
}

fetch(Url).then(function(response) {
    return response.json();
}).then(function(data) {
    //console.log(data);
    let div = document.getElementsByClassName('row teaser-section None')[0];
    createTable(div, data)
    createOverview(div)
}).catch(function(e) {
    console.log("Booo");
    console.log(e)
});