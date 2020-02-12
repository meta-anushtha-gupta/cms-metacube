import { noop, generateUniqueID as ID, scrollTo, screen } from 'utils';
import { EVENTS } from 'Constants';
import Adapter from '../api/Adapter';

const DEFAULT_CALLBACKS = {
    beforeOpen: noop,
    afterOpen: noop,
    beforeClose: noop
};

const MODAL_ID_PREFIX = 'modal-link';

const CLASSES = {
    MODAL_CONTENT: 'modal__content',
    MODAL_CONTAINER: 'modal__container',
    MODAL_CLOSE: 'modal__close'
};

/**
 * Modal component
 */
export default class Modal {
    /**
     * @static THEMES
     * @description Optional theme configuration types
     * @type {{DEFAULT: string, LIGHT: string}}
     */
    static THEMES = {
        DEFAULT: 'dark',
        LIGHT: 'light',
        DISABLE_OVERFLOW: 'disable-overflow'
    };

    /**
     * @static SIZES
     * @description Optional size configuration types
     * @type {{DEFAULT: string, INSET: string, FULLSCREEN: string,
                FULL_OVERLAY: string, DIALOG: string}}
     */
    static SIZES = {
        DEFAULT: 'full-width',
        INSET: 'inset',
        FULLSCREEN: 'full-screen',
        FULL_OVERLAY: 'full-overlay',
        DIALOG: 'dialog'
    };

    /**
     * @static EVENTS
     * @description Event types for Modal
     * @type {{SCROLL_TO: string}}
     */
    static EVENTS = {
        SCROLL_TO: 'modal-scroll-to'
    };

    /**
     * Creates a Modal instance
     * @param {Element} element - The element associated to the modal
     * @param {Object} [options = {}] - Options for the modal
     * @param {String} options.modalContent - Content to be populated in modal
     * @param {Object} [options.callbacks = DEFAULT_CALLBACKS] - Object with callbacks
     * @param {Function} options.callbacks.beforeOpen - A callback which is called before modal open
     * @param {Function} options.callbacks.afterOpen - A callback which is called after modal open
     * @param {Function} options.callbacks.beforeClose - A callback which
                            is called before modal close
     * @param {String} options.theme - Theme to apply to the modal styling
     * @param {String} options.size - Size to apply to the modal styling
     * @param {String} options.sizeSmall - Optional size to apply to small screen
     * (if set overrides the 'size' property)
     * @param {String} options.sizeLarge - Optional size to apply to large screen
     * (if set overrides the 'size' property)
     * @param {String} options.disableSmall - Flag to disable the modal on small screens
     * @param {String} options.transitionInOut - Optional apply opacity transition on
     * open/close (large & xlarge only)
     * @param {String} options.unclosable - Optional precludes inclusion of close button
     */
    constructor(element, {
        modalContent = '',
        callbacks = {},
        theme = Modal.THEMES.DEFAULT,
        size = Modal.SIZES.DEFAULT,
        sizeSmall = null,
        sizeLarge = null,
        disableSmall = false,
        transitionInOut = false,
        unclosable = false,
        dataAnalyticContainer = null,
        dataAnalyticTriggerClose = null,
        callingContainer = null
    } = {}) {
        // Attach all properties to current instance
        Object.assign(this, {
            element,
            modalContent,
            theme,
            size,
            sizeSmall,
            sizeLarge,
            disableSmall,
            transitionInOut,
            unclosable,
            dataAnalyticContainer,
            dataAnalyticTriggerClose,
            callingContainer,
            callbacks: {
                ...DEFAULT_CALLBACKS,
                ...callbacks
            }
        });
        this.isActive = false;

        // method aliases
        this.onClickHandler = this.onClick.bind(this);
        this.onScrollToEvent = this.onScrollToEvent.bind(this);

        this.init();
    }

    /**
     * Init method
     */
    init() {
        this.ID = ID();
        if (this.element) {
            this.element.setAttribute('data-id', `${MODAL_ID_PREFIX}${this.ID}`);
        }
        this.attachEvents();
    }

    /**
     * @method cacheDOM
     * @description Caches DOM elements
     */
    cacheDOM() {
        this.modalContent = document.querySelector(`.${CLASSES.MODAL_CONTENT}`);
        this.modalContainer = document.querySelector(`.${CLASSES.MODAL_CONTAINER}`);
    }

    /**
     * Destroy method
     */
    destroy() {
        if (this.element) {
            this.detachEvents();
        }
    }

    /**
     * Attach events
     */
    attachEvents() {
        if (this.element) {
            this.element.addEventListener(EVENTS.CLICK, this.onClickHandler, true);
        }
        window.addEventListener(Modal.EVENTS.SCROLL_TO, this.onScrollToEvent);
    }

    /**
     * Detach events
     */
    detachEvents() {
        if (this.element) {
            this.element.removeEventListener(EVENTS.CLICK, this.onClickHandler, true);
        }

        window.removeEventListener(Modal.EVENTS.SCROLL_TO, this.onScrollToEvent);
    }

    /**
     * Calls the Adapter api to open a modal with the modalContent,
     * and apply the lifecycle callbacks
     */
    open() {
        if (!this.isActive) {
            this.callbacks.beforeOpen.call(this);
            Adapter.openModal(this.modalContent, {
                callbacks: {
                    afterOpen: this.afterOpen.bind(this),
                    beforeClose: this.beforeClose.bind(this)
                },
                theme: this.theme,
                transitionInOut: this.transitionInOut,
                unclosable: this.unclosable,
                size: this.size,
                sizeDevice: this.getSizeDeviceObject(),
                disableSmall: this.disableSmall,
                dataAnalyticContainer: this.dataAnalyticContainer,
                dataAnalyticTriggerClose: this.dataAnalyticTriggerClose
            });
        }
    }

    /**
     * Calls the Adapter api to close a modal
     */
    close() {
        if (this.isActive) {
            Adapter.closeModal();
        }
    }

    /**
     * Click handler for the modal instance
     * Opens the modal and passes in content and necessary callbacks to Adapter
     * NOTE: The callbacks are bound to the current instance of the Modal so that it's attributes
     * can be accessed in callback
     */
    onClick(e) {
        this.open();
        e.preventDefault();
        return this;
    }

    /**
     * @method onScrollToEvent
     * @description Callback handler for Modal.EVENTS.SCROLL_TO that
                    validates the event when dispatched
     * and applies the scrollToElement method
     * @param event {Event} Custom Event object containing the element to scroll to
     */
    onScrollToEvent(event) {
        if (this.isActive && event.detail.element
            && this.modalContainer.contains(event.detail.element)) {
            this.scrollToElement(event.detail.element);
        }
    }

    /**
     * Callback to apply before a modal opens
     */
    beforeOpen() {
        this.callbacks.beforeOpen();
    }

    /**
     * @method afterOpen
     * Sets the isActive state and applies callback after the modal opens
     */
    afterOpen() {
        this.isActive = true;
        this.callbacks.afterOpen();
        this.cacheDOM();
    }

    /**
     * @method beforeClose
     * Sets the isActive state and applies callback before the modal closes
     */
    beforeClose() {
        this.isActive = false;
        if (!screen.getState().small && this.callingContainer !== null) {
            this.callingContainer.focus();
        }
        this.callbacks.beforeClose();
    }

    /**
     * @method getActiveState
     * @method Getter for the active state of the modal
     * @return {boolean}
     */
    getActiveState() {
        return this.isActive;
    }

    /**
     * @method getSizeDeviceObject
     * @description Returns an object with the required format for the sizeDevice option,
     * in case the sizeSmall or sizeLarge props are defined
     * @return {Object} sizeDevice object or null
     */
    getSizeDeviceObject() {
        let sizeByDevice = null;

        if (this.sizeSmall || this.sizeLarge) {
            sizeByDevice = {
                small: this.sizeSmall || Modal.SIZES.DEFAULT,
                large: this.sizeLarge || Modal.SIZES.DEFAULT
            };
        }

        return sizeByDevice;
    }

    /**
     * @method scrollToElement
     * @description Scrolls the element to top of modal. Since scrolling container could either be
     * modalContent or modalContainer based on the type of modal, use both as reference to scrollTo
     * @param {HTMLElement} Element to scroll
     */
    scrollToElement(element) {
        const offset = element.offsetTop;

        if (element && offset && !isNaN(offset)) {
            scrollTo(offset, 250, 'vertical', this.modalContainer);
            scrollTo(offset, 250, 'vertical', this.modalContent);
        }
    }
}
