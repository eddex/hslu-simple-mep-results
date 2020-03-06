/**
 * Returns the language of MyCampus
 * @returns {string}
 */
const getLanguage = () => {

    languageLinks = document.getElementsByClassName("languagelink");
    for (let i = 0; i < languageLinks.length; i++) {
        const languageLink = languageLinks[i];
        if (languageLink.classList.contains("active")) {
            return languageLink.hreflang;
        }
    }

    // fallback to default locale
    if (Helpers.isFirefox()) {
        return (browser.runtime.getManifest()).default_locale
    }
    else {
        return (chrome.runtime.getManifest()).default_locale
    }

}

let messages;


/**
 * Component for localization functions.
 */
const i18n = {

    /**
     * Populates the MyCampus informations
     * @param {string} text to put into the cell.
     */
    init: async () => {

        const language = getLanguage();

        messages = await fetch(Helpers.getExtensionInternalFileUrl('_locales/' + language + '/messages.json'))
            .then(response => response.json())
    },

    /**
     * Returns the localized message
     * @param {string} message wo should be localized
     */
    getMessage: (message) => {
        if (message in messages) {
            return messages[message].message
        }
        return undefined
    },

}
