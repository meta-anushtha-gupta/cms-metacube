/**
 * API responsible for loading reCAPTCHA API's
 */

/**
 * @property
 * @description Stores the reCAPTCHA api loader promise that resolves once the api has loaded
 */
let reCAPTCHAPILoader;

/**
 * @method loadRecaptcha
 * @description Loads the ReCAPTCHA script tag and returns a Promise
 * that resolves onload and rejects onerror
 * @return {Promise.<*>}
 */
function loadRecaptcha(lang = 'en') {
    if (!reCAPTCHAPILoader) {
        reCAPTCHAPILoader = new Promise((resolve, reject) => {
            const language = window.metacube.ns('pageData').language || lang;
            const urlPath = `https://www.google.com/recaptcha/api.js?onload=mbNaftaReCAPTCHACallback&render=explicit&hl=${language}`;
            const headElm = document.querySelector('head');
            const script = document.createElement('script');

            script.src = urlPath;
            script.async = true;
            script.defer = true;
            script.onerror = () => reject();
            window.mbNaftaReCAPTCHACallback = () => {
                resolve();
                delete window.mbNaftaReCAPTCHACallback;
            };

            headElm.appendChild(script);
        });
    }

    return reCAPTCHAPILoader;
}

/**
 * Export public api methods
 */
export default {
    loadRecaptcha
};
