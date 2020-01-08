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
    }
}