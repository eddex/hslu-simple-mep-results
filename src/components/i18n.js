
/**
 *
 */
async function getLanguageFromLocalStorage() {
    if (Helpers.isFirefox()) {
        const getLanguageFirefox = async () => {
            return new Promise(
                (resolve, reject) => {
                    i18nLanguage = browser.storage.local.get("i18nLanguage", function (response) {
                        resolve(response);
                    });
                });
        }
        language = await getLanguageFirefox();
        return language.i18nLanguage
    }
    else {
        getLanguageChrome = async () => {
            return new Promise(
                (resolve, reject) => {
                    i18nLanguage = chrome.storage.local.get("i18nLanguage", function (response) {
                        resolve(response);
                    });
                });
        }
        i18nLanguage = await getLanguageChrome();
        return i18nLanguage.i18nLanguage
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
    else {
        return await getLanguageFromLocalStorage();
    }


    // fallback to default locale
    if (Helpers.isFirefox()) {
        return (browser.runtime.getManifest()).default_locale
    }
    else {
        return (chrome.runtime.getManifest()).default_locale
    }
}
async function setLanguageToLocalStorage(language) {
    if (Helpers.isFirefox()) {
        await browser.storage.local.set({ i18nLanguage: language });
    }
    else {
        await chrome.storage.local.set({ i18nLanguage: language });
    }
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
        i18n.messages = await fetch(Helpers.getExtensionInternalFileUrl('_locales/' + language + '/messages.json'))
            .then(response => response.json())

        await setLanguageToLocalStorage(language);
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
