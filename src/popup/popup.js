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

  modules = await getLocalStorage();

  // reset ModulList
  let selectModulList = document.getElementById("ModulList");;
  let selectParentNode = selectModulList.parentNode;
  let modulList = selectModulList.cloneNode(false); // Make a shallow copy
  selectParentNode.replaceChild(modulList, selectModulList);

  if (!(Object.keys(modules).length === 0) && modules.constructor === Object) {
    for (let module in modules) {
      console.log("acronym", modules[module].acronym)
      modulList.options[modulList.options.length] = new Option(modules[module].acronym);
      modulList.hidden = false;
    }
  }
  else {
    modulList.hidden = true;
  }
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
async function removeModule() {
  modules = await getLocalStorage();
  modulList = document.getElementById("ModulList")

  var selectedIndex = modulList.selectedIndex
  let modulAcronym = modulList.options[selectedIndex].value;
  removeItemFromLocalStorage(modulAcronym)
}
async function addCustomModul() {
  modulAcronym = document.getElementById("modulAcronym").value;
  moduleType = document.getElementById("moduleType").value;
  modulCredits = document.getElementById("modulCredits").value;

  var modulSemesterRadios = document.getElementsByName('moduleImplementation');
  for (var i = 0, length = modulSemesterRadios.length; i < length; i++) {
    if (modulSemesterRadios[i].checked) {
      modulSemester = modulSemesterRadios[i].value;
      break;
    }
  }
  let modulList = await getLocalStorage();
  modulList[modulAcronym] = {
    acronym: modulAcronym,
    type: moduleType,
    credits: modulCredits,
    semster: modulSemester
  }

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

  //every time the storage changes(set)
  browser.storage.onChanged.addListener(populateModulList).then();

});

