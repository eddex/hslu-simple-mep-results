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
    }
}