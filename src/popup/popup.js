function onError(error) {
  console.log(error)
}
function setItem() {
  console.log("succesfully writen");
}
function gotItem(item) {
  console.log("got modul", item);
  return item
}
async function populateModulList() {

  modules = await getCustomModuls();

  // reset ModulList
  let selectModulList = document.getElementById("ModulList");;
  let selectParentNode = selectModulList.parentNode;
  let modulList = selectModulList.cloneNode(false); // Make a shallow copy
  selectParentNode.replaceChild(modulList, selectModulList);

  if (modules.customModuls) {
    modules = modules.customModuls;

    modules.forEach(module => {
      modulName = module.modulAcronym
      modulList.options[modulList.options.length] = new Option(modulName);
    });
    modulList.hidden = false;
  }
  else {
    modulList.hidden = true;
  }
}
async function resetModuls() {
  await browser.storage.local.clear()
  populateModulList();
}
async function removeModule() {
  console.log("DeleteModul")
  modules = await getCustomModuls();
  modulList = document.getElementById("ModulList")

  var selectedIndex = modulList.selectedIndex
  let modulAcronym = modulList.options[selectedIndex].value;
  console.log("module", modulAcronym)
  
  if (modules.customModuls) {
    modules = modules.customModuls;

    const isModul = (moduleArray) => moduleArray.modulAcronym == modulAcronym;

    let moduleIndex = modules.findIndex(isModul)
    console.log("modulIndex", moduleIndex)
    console.log(modules)
    modules.splice(moduleIndex, 1)
    console.log(modules)

    storageObject = {
      customModuls: modules
    }
    browser.storage.local.set(storageObject).then(setItem, onError);
  }
  populateModulList();
}

async function saveCustomModul() {
  modulAcronym = document.getElementById("modulAcronym").value;
  moduleType = document.getElementById("moduleType").value;
  modulCredits = document.getElementById("modulCredits").value;
  let customModuls = []

  var modulSemesterRadios = document.getElementsByName('moduleImplementation');
  for (var i = 0, length = modulSemesterRadios.length; i < length; i++) {
    if (modulSemesterRadios[i].checked) {
      modulSemester = modulSemesterRadios[i].value;
      // only one radio can be logically checked, don't check the rest
      break;
    }
  }

  let newCustomModuls = {
    modulAcronym: modulAcronym,
    moduleType: moduleType,
    modulCredits: modulCredits
  }
  let existingCustomModuls = await getCustomModuls();

  if (!(Object.keys(existingCustomModuls).length === 0)) {
    existingCustomModuls = existingCustomModuls.customModuls
    console.log("add existing Custom Moduls")
    console.log("existingCustomModuls", existingCustomModuls)

    // customModuls.push(existingCustomModuls);
    for (let index = 0; index < existingCustomModuls.length; index++) {
      customModuls.push(existingCustomModuls[index]);
    }
  }
  customModuls.push(newCustomModuls)
  storageObject = {
    customModuls: customModuls
  }
  browser.storage.local.set(storageObject).then(setItem, onError);
  populateModulList();
}
async function getCustomModuls() {
  let modules = await browser.storage.local.get(["customModuls"])
  return modules

}
window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  submitButton = document.getElementById("submitModul");
  resetButton = document.getElementById("resetModuls");
  deleteButton = document.getElementById("removeModule");
  submitButton.addEventListener('click', saveCustomModul);
  resetButton.addEventListener('click', resetModuls);
  deleteButton.addEventListener('click', removeModule);
  populateModulList();
});