/**
 * Component for localization functions.
 */
const i18n = {

    /**
     * Returns the language of MyCampus
     */
    getLanguage: () => {
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
    },
    /**
     * Returns the localized message
     */
    getMessage: async (message) => {
        const language = i18n.getLanguage();
        const messages = await fetch(Helpers.getExtensionInternalFileUrl('_locales/' + language + '/messages.json'))
            .then(response => response.json())
        if (message in messages) {
            return messages[message].message
        }
        return undefined
    },
}
