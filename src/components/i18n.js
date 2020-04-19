
/**
 * returns the default locale from the manifest
 * @returns {string}
 */
function getDefaultLocale() {
    if (Helpers.isFirefox()) {
        return (browser.runtime.getManifest()).default_locale
    }
    else {
        return (chrome.runtime.getManifest()).default_locale
    }
}

/**
 * Returns the language of MyCampus
 * @returns {string}
 */
async function getLanguage() {
    languageLinks = document.getElementsByClassName("languagelink");
    if (languageLinks.length > 0) {
        for (let i = 0; i < languageLinks.length; i++) {
            const languageLink = languageLinks[i];
            if (languageLink.classList.contains("active")) {
                return languageLink.hreflang;
            }
        }
    }
    // needed the popup
    else {
        const i18nLanguage = (await Helpers.getItemFromLocalStorage("i18nLanguage")).i18nLanguage
        if (i18nLanguage === undefined) {
            return getDefaultLocale();
        }
        return i18nLanguage
    }
}

async function getMessages(language) {
    let messsages = await fetch(Helpers.getExtensionInternalFileUrl('_locales/' + language + '/messages.json'))
        .then(response => response.json())
    if (messsages === undefined) {
        messsages = await fetch(Helpers.getExtensionInternalFileUrl('_locales/' + getDefaultLocale() + '/messages.json'))
            .then(response => response.json())
    }
    return messsages;
}

/**
 * Component for localization functions.
 */
const i18n = {

    messages: "",
    /**
     * Gets the right language and the corresponding message file
     */
    init: async () => {

        const language = await getLanguage();
        i18n.messages = await getMessages(language);
        await Helpers.saveObjectInLocalStorage({ i18nLanguage: language })
    },

    /**
     * Returns the localized message
     * @param {string} message wo should be localized
     */
    getMessage: (message) => {
        if (message in i18n.messages) {
            return i18n.messages[message].message
        }
        return undefined
    },

}
