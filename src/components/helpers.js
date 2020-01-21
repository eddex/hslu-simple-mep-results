/*
 * Component for helper functions.
 */
const Helpers = {

    /*
    * Given a current value and a max value, calculate the percentage.
    * The result can be used for progress bars.
    */
    calculateProgress: (current, max) => {
        let progress = Math.round(current / max * 100);
        if (progress > 100) {
            progress = 100;
        }
        return progress;
    },

    /*
     * Add an h2 title as the first child of the given DOM element.
     */
    addTitleToDocument: (element, text) => {
        const title = document.createElement('h2');
        title.appendChild(document.createTextNode(text));
        element.insertBefore(title, element.firstChild);
    },

    /*
    * Helper method to read a file that is included in this browser extension.
    * The file needs to be registered in manifest.json!
    * Chome and Firefox have different APIs for this.
    */
    getExtensionInternalFileUrl: (filePath) => {

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
}