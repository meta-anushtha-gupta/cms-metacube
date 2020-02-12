import { EVENTS } from 'Constants';

const CLASSES = {
    STAY_CONNECTED__SUBSCRIBE_CTA: 'stay-connected__subscribe-cta',
    STAY_CONNECTED__SUBSCRIBE_CTA_DISABLED: 'stay-connected__subscribe-cta--disabled',
    STAY_CONNECTED__FORM_INPUT: 'stay-connected__form-input',
    STAY_CONNECTED__FORM_INPUT_ERROR: 'stay-connected__form-input--error',
    DEALER_MODULE__FORM_BUTTON: 'dealer-module__form-button',
    ERROR_FIELD__HIDDEN: 'error-field--hidden',
    FORM_INPUT__ZIP_CODE: 'form-input--zip-code',
    CUSTOM_SUB_NAV__FORM_BTN: 'custom-sub-nav__form-btn',
    MEDIA_TEXT__FORM_BTN: 'media-text__form-button',
    ZIP_CODE__FORM: 'zip-code_form',
    STAY_CONNECTED__FORM: 'stay-connected__form',
    HIDDEN: 'hidden'
};

export default class Validation {
    constructor(element) {
        this.element = element;
        this.init();
    }

    init() {
        this.attachEvents();
    }

    attachEvents() {
        const inputValue = document.querySelector(`.${CLASSES.STAY_CONNECTED__FORM_INPUT}`);
        const zipCodeInputFields = document.querySelectorAll(`.${CLASSES.FORM_INPUT__ZIP_CODE}`);
        const forms = document.querySelectorAll('form');

        document.addEventListener(EVENTS.CLICK, (e) => {
            if (e.target.matches(`.${CLASSES.STAY_CONNECTED__SUBSCRIBE_CTA}`)) {
                event.preventDefault();
                this.validateForEmail(e.target, inputValue);
            } else if (e.target.matches(`.${CLASSES.DEALER_MODULE__FORM_BUTTON}`) || e.target.matches(`.${CLASSES.CUSTOM_SUB_NAV__FORM_BTN}`) || e.target.matches(`.${CLASSES.MEDIA_TEXT__FORM_BTN}`)) {
                event.preventDefault();
                this.validateForZipCode(e.target,
                    e.target.previousElementSibling.querySelector(`.${CLASSES.FORM_INPUT__ZIP_CODE}`), e.target);
            }
        });

        // on every key press zip code validation is applied.
        [].forEach.call(zipCodeInputFields, (element) => {
            if (element) {
                element.addEventListener(EVENTS.INPUT, (e) => {
                    this.validateForZipCode(e.target.parentElement.nextElementSibling,
                        e.target, e.target);
                });
            }
        });

        [].forEach.call(forms, (formElement) => {
            formElement.addEventListener(EVENTS.SUBMIT, (e) => {
                if (e.target.matches(`.${CLASSES.ZIP_CODE__FORM}`)) {
                    e.preventDefault();
                    const inputField = formElement.querySelector('input');
                    const submitButton = formElement.querySelector('a');
                    this.validateForZipCode(submitButton, inputField, submitButton);
                } else if (e.target.matches(`.${CLASSES.STAY_CONNECTED__FORM}`)) {
                    e.preventDefault();
                    const inputField = formElement.querySelector('input');
                    const submitButton = formElement.querySelector('a');
                    this.validateForEmail(submitButton, inputField);
                }
            });
        });
    }

    validateForEmail(subscribeButton, inputValue) {
        const errorField = document.querySelector(`.${CLASSES.STAY_CONNECTED__FORM_INPUT_ERROR}`);
        const redirectLink = subscribeButton.href;
        const url = this.format('{0}?email={1}', [redirectLink, inputValue.value]);

        if (errorField && inputValue && redirectLink) {
            if (inputValue.value === '') {
                errorField.classList.remove(`${CLASSES.HIDDEN}`);
                errorField.innerHTML = 'Please enter your email address';
            } else if (this.isValidEmail(inputValue.value)) {
                errorField.classList.add(`${CLASSES.HIDDEN}`);
                inputValue.value = '';
                window.open(url, '_blank');
            } else {
                errorField.classList.remove(`${CLASSES.HIDDEN}`);
                errorField.innerHTML = 'Please enter your valid email address';
            }
        }
    }

    format(source, params) {
        console.log(this);

        [].forEach.call(params, (i, n) => {
            source = source.replace(new RegExp(`\\{${n}\\}`, 'g'), i);
        });
        return source;
    }

    validateForZipCode(button, inputValue, targetElement) {
        const zipCodeMaxLength = 5;
        const zipCodeErrorField = inputValue.nextElementSibling;
        const redirectLink = button.href;
        const url = this.format('{0}/searchLocation-{1}', [redirectLink, inputValue.value]);

        if (redirectLink && targetElement && zipCodeErrorField) {
            if (inputValue.value !== ''
            && this.isNumber(inputValue.value)
            && this.checkLength(parseInt(inputValue.value.length, 10), zipCodeMaxLength)) {
                zipCodeErrorField.classList.add(`${CLASSES.ERROR_FIELD__HIDDEN}`);
                if (targetElement.matches(`.${CLASSES.DEALER_MODULE__FORM_BUTTON}`) || targetElement.matches(`.${CLASSES.CUSTOM_SUB_NAV__FORM_BTN}`) || targetElement.matches(`.${CLASSES.MEDIA_TEXT__FORM_BTN}`)) {
                    inputValue.value = '';
                    window.open(url, '_blank');
                }
            } else {
                zipCodeErrorField.classList.remove(`${CLASSES.ERROR_FIELD__HIDDEN}`);
                zipCodeErrorField.innerHTML = 'Enter Valid Zipcode';
            }
        }
    }

    /**
     * Email Validation
     */
    isValidEmail(email) {
        console.log(this);
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }

    /**
     * Check if parameters passed have equal length.
     */
    checkLength(currentValue, limitValue) {
        console.log(this);
        if (currentValue === limitValue) {
            return true;
        }
        return false;
    }

    /**
     * Number Validation
     */
    isNumber(testString) {
        console.log(this);
        const regex = /^[0-9]+$/;
        return regex.test(testString);
    }
}
