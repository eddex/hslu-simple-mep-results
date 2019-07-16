let url = "https://mycampus.hslu.ch/de-ch/api/anlasslist/load/?page=1&per_page=250&total_entries=100&datasourceid=5158ceaf-061f-49aa-b270-fc309c1a5f69"

function getValForKey(details, key) {
    
    for (detail of details) {
        if (key == detail.key) {
            return detail.val;
        }
    }
    return "";
}

function tableCreate(json) {
    var div = document.getElementsByClassName("row teaser-section None")[0]; 
    var table = document.createElement('table');

    table.setAttribute('border', '1');
    table.setAttribute('style', 'margin-bottom: 10px; width: 100%;');

    let keysOfDesire = ["Nummer", 'ECTS-Punkte', 'Bewertung', 'Grad']

    var header = table.createTHead();
    var row = header.insertRow(0);
    for (let i = 0; i < keysOfDesire.length; i++) {
        var cell = row.insertCell(i);
        cell.innerHTML = keysOfDesire[i];
        cell.setAttribute("style", "font-weight: bold;")
    }

    var tbody = document.createElement('tbody');
    
    json.items.forEach(item => {
        var tr = document.createElement('tr');
        
        keysOfDesire.forEach(key => {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(getValForKey(item.details, key)))
            tr.appendChild(td)
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    div.insertBefore(table, div.firstChild)
  }

fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        //console.log(data);
        tableCreate(data)
    }).catch(function(e) {
        console.log("Booo");
        console.log(e)
    });