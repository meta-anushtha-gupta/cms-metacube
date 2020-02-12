// Utils dependencies
import { noop, scrollTo } from 'utils';

// Local dependencies
import loadRecaptchaApi from '../api/recaptchaLoaderApi';
import recaptchaTemplate from './../templates/reCAPTCHATemplate';

/**
 * @constant ATTRIBUTES
 * @description Attribute references for the reCAPTCHA view
 * @type {{RECAPTCHA_CONTAINER: string, ERROR_MESSAGE: string}}
 */
const ATTRIBUTES = {
    RECAPTCHA_CONTAINER: 'data-recaptcha-container',
    ERROR_MESSAGE: 'data-error-message'
};

/**
 * @const CLASSES
 * @description Collection of constant values for related class attributes of the module
 */
const CLASSES = {
    ERROR: 'error'
};

/**
 * @property defaultReCAPTCHAconfig
 * @description set the sitekey setting
 */
const defaultReCAPTCHAconfig = {
    id: 'recaptcha',
    isDisabled: window.metacube.ns('applicationProperties').isRecaptchaDisabled,
    errorMessage: 'Please confirm you are not a robot.',
    language: window.metacube.ns('pageData').language,
    onSuccess: noop, // Optional on success callback from the module using the reCAPTCHA
    sitekey: window.metacube.ns('applicationProperties').recaptchaSiteKey,
    size: '', // The size of the widget, 'compact' or 'normal'. Default is 'normal',
    theme: '' // The color theme of the widget, 'dark' or 'light'. Default is 'light'
};

/**
 * @class ReCAPTCHA
 * @description create and render the google reCAPTCHA Element
 */
export default class ReCAPTCHA {
    /**
     * @constructor
     * @description On instantiation, sets properties, load reCAPTCHA script then render the element
     */
    constructor(config = {}) {
        this.element = null;
        this.config = {
            ...defaultReCAPTCHAconfig,
            ...config,
            callback: this.onSuccess.bind(this)
        };
        this.id = this.config.id;

        this.name = this.config.name;
        this.recaptchaContainer = null;
        this.errorMessage = null;
        this.widgetId = null;
        this.init();
    }

    /**
     * @method init
     */
    init() {
        this.createView();
        this.cacheDOM();

        if (!this.config.sitekey) {
            console.error('ReCAPTCHA Error: sitekey value is missing from configuration.');
        } else {
            loadRecaptchaApi.loadRecaptcha(this.config.language)
                .then(this.createRecaptcha.bind(this));
        }

        // if reCAPTCHA is disabled, automatically apply the onSuccess callback
        // after instantiation. Note: this needs to be asynchronous so that the instance
        // is defined before the callback is applied
        if (this.config.isDisabled) {
            window.setTimeout(this.config.onSuccess.bind(this));
        }
    }

    /**
     * @method createView
     * @description Create view
     */
    createView() {
        this.element = recaptchaTemplate({
            errorMessage: this.config.errorMessage
        })({ getNode: true });
    }

    /**
     * @method cacheDOM
     * @description Caches DOM elements
     */
    cacheDOM() {
        this.recaptchaContainer = this.element.querySelector(`[${ATTRIBUTES.RECAPTCHA_CONTAINER}]`);
        this.errorMessage = this.element.querySelector(`[${ATTRIBUTES.ERROR_MESSAGE}]`);
    }

    /**
    * @method render
    * @description disable the mbNaftaReCAPTCHACallback callback and
    * render the ReCAPTCHA control using the grecaptcha API
    */
    createRecaptcha() {
        this.widgetId = window.grecaptcha.render(this.recaptchaContainer, this.config);
    }

    /**
     * @method getName
     * @description Gets the name
     * @returns {String} name associated with this captcha
     */
    getName() {
        return this.name;
    }

    /**
     * @method getValue
     * @description Gets the value of reCAPTCHA
     * @return {String} reCAPTCHA value
     */
    getValue() {
        return window.grecaptcha.getResponse(this.widgetId);
    }

    /**
    * @method isValid
    * @description check the reCAPTCHA's response and evaluate if the reCAPTCHA
    * was correctly sended
    * @return {boolean} reCAPTCHA valid state
    */
    isValid() {
        return this.config.isDisabled ? true : !!this.getValue();
    }

    /**
     * @method validate
     * @description Sets error status if reCAPTCHA is not valid
     */
    validate() {
        if (!this.getValue()) {
            this.element.classList.add(CLASSES.ERROR);
        } else {
            this.element.classList.remove(CLASSES.ERROR);
        }
        return this.isValid();
    }


    /**
     * @method onSuccess
     * @description Callback method applied on a successful recaptcha submission to test
     * if the current device is an iOS device and if truthy, sets the scroll position
     * to the top of the recaptchaContainer to resolve an bug with RECAPTCHA.
     * Finally it calls custom onSuccess callback.
     * https://github.com/google/recaptcha/issues/130
     */
    onSuccess() {
        const isIOS = /iPhone|iPad|iPod/i.test(window.navigator.userAgent);

        if (isIOS) {
            scrollTo(this.recaptchaContainer.offsetTop);
        }
        console.log('Success : ', this.config);

        this.config.onSuccess();
    }

    /**
     * @method destroy
     * @description Destroys the element by deleting it from the DOM
     */
    destroy() {
        this.element.remove();
    }

    /**
     * @method render
     * @description Return the element containing the reCAPTCHA
     */
    render() {
        return this.element;
    }
}
