const NameKey = 'Nummer';
const CreditsKey = 'ECTS-Punkte';
const MarkKey = 'Bewertung';
const GradeKey = 'Grad';
const FromKey = 'From'
const TermKey = 'Term'
const ItemDetailKeys = [NameKey, CreditsKey];
const ModuleTypeKey = 'Modul-Typ';
const ModuleTableHeaders = [NameKey, ModuleTypeKey, CreditsKey, MarkKey, GradeKey]
const GradesCount = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };

//const CreditByTermCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
const CreditsBySemesterCount = [0,0,0,0,0,0,0,0];

const CreditsByModuleTypeCount = {
    Kernmodul: { current: 0, min: 66 },
    Projektmodul: { current: 0, min: 36 },
    Erweiterungsmodul: { current: 0, min: 42 },
    Majormodul: { current: 0, min: 24 },
    Zusatzmodul: { current: 0, min: 9 }
};

let studyTitle = "DEFAULT_TITLE"
let studyAcronym = "DEFAULT_ACRONYM"

// TODO: add more possible titles
var StudyTitles = {
    "bachelor of science in information & cyber security": "ICS",
    "bachelor of science in information": "I",
    "bachelor of science in computer science": "I",
    "bachelor of science in wirtschaftsinformatik": "WI",
    "bachelor of science in informatik": "I"
}

let totalCredits = 0;
let totalGrades = 0;
let totalNumericMark = 0;
let numberOfNumericMarks = 0;
let totalNumericMarkWithF = 0;
let numberOfNumericMarksWithF = 0;

/**
 * Gets the acronym of the students study.
 * @param {String} studyTitle
 * @returns {String} I, ICS or WI
 *
 */
function getStudyAcronym(studyTitle) {
    studyTitle = studyTitle.toLowerCase().replace(/[0-9]/g, '').trim();
    return StudyTitles[studyTitle];
}

/**
 * Gets the title of the students study
 * @returns {String}
 */
async function getStudyTitle() {
    let title = "If you see this message, something went wrong. Try to reload the page"

    const URL = "https://mycampus.hslu.ch/de-ch/stud-i/mein-studium/meine-daten/"

    let data = await fetch((URL))
        .then(response => response.text());

    const searchStringStart = '<h2 class="section-title large-20 columns nospace">';
    const searchStringEnd = "</h2>";

    data = data.split(searchStringStart);
    if (data[2]) {
        title = data[2].split(searchStringEnd)[0].trim();
    }
    return title;
}

/*
 * Creates one row of the modules table.
 */
function createModulesTableRow(parsedModule) {

    let tr = document.createElement('tr');

    ModuleTableHeaders.forEach(attributeKey => {
        let td = document.createElement('td');
        td.appendChild(document.createTextNode(parsedModule[attributeKey]));
        tr.appendChild(td);
    });

    return tr;
}

/*
 * Dynamically creates a table that contains all modules the student has visited.
 * Shows Module Identifier (Nummer), Credits (ECTS), Module-Type, Numeric Mark (1-6) and Grade (A-F).
 */
function createModulesTable(div, modules) {

    let table = document.createElement('table');

    let header = table.createTHead();
    let row = header.insertRow(0);
    for (let i = 0; i < ModuleTableHeaders.length; i++) {
        let cell = row.insertCell(i);
        cell.appendChild(document.createTextNode(ModuleTableHeaders[i]));
        cell.setAttribute('style', 'font-weight: bold');
    }

    let tbody = document.createElement('tbody');

    modules.forEach(parsedModule => {
        let tr = createModulesTableRow(parsedModule);
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    div.insertBefore(table, div.firstChild);
}

/*
 * Create a table that shows how many ECTS for each type of module have been achieved.
 */
async function createCreditsByModuleTypeTable(div) {

    let template = await fetch(Helpers.getExtensionInternalFileUrl('templates/credits_by_module_type_table.html'))
        .then(response => response.text());
    let creditsByModuleTypeTable = document.createElement('div');
    creditsByModuleTypeTable.innerHTML = template;
    div.insertBefore(creditsByModuleTypeTable, div.firstChild);

    for (let moduleKey in CreditsByModuleTypeCount) {
        const creditProgressBar = document.getElementById('ECTS-' + moduleKey);
        const creditProgressText = document.getElementById('ECTS-Text-' + moduleKey);

        const progress = Helpers.calculateProgress(
            CreditsByModuleTypeCount[moduleKey].current,
            CreditsByModuleTypeCount[moduleKey].min)
        creditProgressText.innerText =
            CreditsByModuleTypeCount[moduleKey].current + ' (' + progress + '%)';
        creditProgressBar.style.width = progress + '%';
    }
}

/*
 * Creates a table that puts each possible grade (A-F) in comparison.
 * Shown is, how many time a grade has been achieved and the percentage,
 * in comparison with the other grades.
 */
async function createGradesOverviewTable(div) {

    let gradesTableTemplate = await fetch(Helpers.getExtensionInternalFileUrl('templates/grades_table.html'))
        .then(response => response.text());

    let gradeOverviewTable = document.createElement('div');
    for (let gradeId in GradesCount) {
        gradesTableTemplate = String(gradesTableTemplate).replace('count-' + gradeId, GradesCount[gradeId]);
        let gradePercentageRounded = Math.round(10000 * GradesCount[gradeId] / totalGrades) / 100;
        gradesTableTemplate = gradesTableTemplate.replace('percentage-' + gradeId, gradePercentageRounded + "%");
    }
    gradeOverviewTable.innerHTML = gradesTableTemplate;
    div.insertBefore(gradeOverviewTable, div.firstChild);
}

/*
 * Create a heading that displays the number of achieved credits.
 */
function createTotalCreditsTitle(div) {
    const progress = Helpers.calculateProgress(totalCredits, 180);
    Helpers.addTitleToDocument(div, 'ECTS-Punkte: ' + totalCredits + '/180 (' + progress + '%)');
}

/*
 * Create a progress bar that visualizes the number of achieved credits.
 */
function createTotalCreditsProgressBar(div) {

    const container = document.createElement('div');
    container.classList = 'total-progress-container';

    const progressBar = document.createElement('div');
    const progress = Helpers.calculateProgress(totalCredits, 180);
    progressBar.classList = 'total-progress progress';
    progressBar.style.width = progress + '%';

    container.appendChild(progressBar);

    div.insertBefore(container, div.firstChild);
}
function createStudyTitle(div) {

    let studyTitleTitle = document.createElement('h1');
    studyTitleTitle.appendChild(document.createTextNode('Studium: ' + studyTitle));
    div.insertBefore(studyTitleTitle, div.firstChild);
}

/*
 * Create a heading that displays the average mark over all modules.
 * Modules with grade F are not counted in the average.
 * A second average is displayed, where the modules with grade F are taken into account.
 */
function createAverageMarkTitle(div) {
    let average = Number(totalNumericMark / numberOfNumericMarks).toFixed(2);
    let averageWithF = Number(totalNumericMarkWithF / numberOfNumericMarksWithF).toFixed(2);
    Helpers.addTitleToDocument(div, 'Noten Ø: ' + average + ' (Ø mit F: ' + averageWithF + ')')
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


function calculateStats(modules) {

    modules.forEach(parsedModule => {
        if (parsedModule[GradeKey] != null && parsedModule[GradeKey] != '') {
            GradesCount[parsedModule[GradeKey]]++;
            totalGrades++;
        }
        if (parsedModule.passed) {
            let credits = Number(parsedModule[CreditsKey]);
            totalCredits += credits;
            let moduleType = parsedModule[ModuleTypeKey]
            if (moduleType in CreditsByModuleTypeCount) {
                CreditsByModuleTypeCount[moduleType].current += credits;
            }
        }
        // if cell is empty, Number('') returns 0!
        numericMark = Number(parsedModule[MarkKey])
        if (!isNaN(numericMark) && numericMark != 0) {
            totalNumericMarkWithF += numericMark;
            numberOfNumericMarksWithF++;
            if (parsedModule.passed) {
                totalNumericMark += numericMark;
                numberOfNumericMarks++;
            }
        }
    });
}

function createChart(div, modules) {
    canvas = document.createElement("canvas");
    canvas.setAttribute("id", "myChart");
    div.insertBefore(canvas, div.firstChild);


    const labels = []
    //CreditByTermCount(Number(modul[TermKey])) += Number(modul[CreditsKey]),
    modules.forEach(modul => {
        CreditsBySemesterCount[modul[TermKey]] += Number(modul[CreditsKey]);
    })

    for (let index = 0; index < CreditsBySemesterCount.length; index++) {
        console.log("CreditBySemesterCount[index]", CreditsBySemesterCount[index])
        if(CreditsBySemesterCount[index] != 0 ){
            labels.push(index)   
        }
    }
    console.log("CreditBySemesterCount", CreditsBySemesterCount);

    console.log("labels", labels);

    let type = 'line'
    let data = {
        labels: labels,
        datasets: [{
            label: 'Semester',
            data: [
                CreditsBySemesterCount[1],
                CreditsBySemesterCount[2],
                CreditsBySemesterCount[3],
                CreditsBySemesterCount[4],
                CreditsBySemesterCount[5],
                CreditsBySemesterCount[6],
                CreditsBySemesterCount[7],
                CreditsBySemesterCount[8]
            ],
            backgroundColor: [
                'rgba(135, 206, 235, 0.5)',
            ],
            borderColor: [
                'rgba(135, 206, 235, 1)',
                'rgba(135, 206, 235, 1)',
                'rgba(135, 206, 235, 1)',
                'rgba(135, 206, 235, 1)',
                'rgba(135, 206, 235, 1)',
                'rgba(135, 206, 235, 1)',
                'rgba(135, 206, 235, 1)',
                'rgba(135, 206, 235, 1)'
            ],
            borderWidth: 2
        }]
    }
    let options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }

    new Chart(canvas, {
        type: type,
        data: data,
        options: options
    });
}

async function generateHtml(modules) {

    // remove clutter
    try {
        document.getElementById('intro').remove();
        document.getElementsByClassName('sidebar medium-7 columns mobile-column')[0].remove();
    } catch (error) {
        console.log("NOTITLE, DONT CARE")
    }

    let div = document.getElementsByClassName('row teaser-section None')[0];
    if (!modules) {
        // API call was blocked.
        const p = document.createElement('p');
        p.innerHTML = 'HSLU Simple MEP Results Extension failed to load. The API \
            has blocked the request. Please try again later. \
            More infos on GitHub: <a href="https://github.com/eddex/hslu-simple-mep-results/issues/16" \
            >Issue #16</a>';
        div.insertBefore(p, div.firstChild);
        return;
    }

    calculateStats(modules);
    createModulesTable(div, modules);
    Helpers.addTitleToDocument(div, 'Modulübersicht');

    await createCreditsByModuleTypeTable(div);
    createTotalCreditsProgressBar(div);
    createTotalCreditsTitle(div);

    await createGradesOverviewTable(div);
    createAverageMarkTitle(div);
    createChart(div, modules);
    createStudyTitle(div);
}

getStudyTitle().then(studyTitleText => {
    studyTitle = studyTitleText;
    studyAcronym = getStudyAcronym(studyTitle);

    ModuleParser.generateModuleObjects(studyAcronym)
        .then(modules => generateHtml(modules))
        .catch(e => {
            console.log("Booo");
            console.log(e);
        });
});