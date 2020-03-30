/**
 * Component for helper functions.
 */
const Helpers = {

    /**
    * Given a current value and a max value, calculate the percentage.
    * The result can be used for progress bars.
    *
    * @param current: The current value.
    * @param max: The maximum value.
    * @returns: A number between 0 and 100 representing the current progress.
    */
    calculateProgress: (current, max) => {
        let progress = Math.round(current / max * 100);
        if (progress > 100) {
            progress = 100;
        }
        return progress;
    },
    /**
     * Add an h2 title as the first child of the given DOM element.
     *
     * @param element: The HTML element that should contain the title.
     *  Usually a div element.
     * @param text: The text for the new title element.
     */
    addTitleToDocument: (element, text) => {
        const title = document.createElement('h2');
        title.appendChild(document.createTextNode(text));
        element.insertBefore(title, element.firstChild);
    },
    /**
     * Checks if browser is Firefox or Chromium based
     *
     * @returns: true if the used browser is firefox and false if not
     */
    isFirefox: () => {
        if (typeof browser !== 'undefined') {
            // firefox
            return true
        }
        else {
            // chrome
            return false
        }
    },
    /**
    * Helper method to read a file that is included in this browser extension.
    * The file needs to be registered in manifest.json!
    * Chome and Firefox have different APIs for this.
    *
    * @param filePath: The path to a file from the root of the extension (src/).
    *   e.g. data/file.json
    *
    * @returns: An URL that can be used to load the file with a web request.
    */
    getExtensionInternalFileUrl: (filePath) => {

        let internal_file;
        if (Helpers.isFirefox()) {
            // firefox
            internal_file = browser.runtime.getURL(filePath);
        }
        else {
            // chrome
            internal_file = chrome.runtime.getURL(filePath);
        }
        return internal_file;
    },
    /**
     * Wrapper function for the storage api
     */
    getItemFromLocalStorage: async (itemID) => {
        if (Helpers.isFirefox()) {
            const getItemFromLocalStorageFirefox = async () => {
                return new Promise(
                    (resolve, reject) => {
                        moduleList = browser.storage.local.get(itemID, function (response) {
                            resolve(response);
                        });
                    });
            }
            localStorageItem = await getItemFromLocalStorageFirefox();

        }
        else {
            getItemFromLocalStorageChrome = async () => {
                return new Promise(
                    (resolve, reject) => {
                        moduleList = chrome.storage.local.get(itemID, function (response) {
                            resolve(response);
                        });
                    });
            }
            localStorageItem = await getItemFromLocalStorageChrome();
        }
        return localStorageItem
    },
    getLocalStorage: () => {
        if (Helpers.isFirefox()) {
            return new Promise(
                (resolve, reject) => {
                    moduleList = browser.storage.local.get(null, function (response) {
                        resolve(response);
                    });
                });
        }
        else {
            return new Promise(
                (resolve, reject) => {
                    moduleList = chrome.storage.local.get(null, function (response) {
                        resolve(response);
                    });
                });
        }
    }
}