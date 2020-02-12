import { EVENTS } from 'Constants';
import { findAncestor, noop, renderer, screen, scrollTo, DisableBodyScroll } from 'utils';
import ModalTemplate from '../templates/modalTemplate';

const CLASSES = {
    MODAL_CONTAINER: 'modal__container',
    MODAL_TRANSITIONS: 'modal--transitions',
    MODAL_PLAYIN: 'modal--playin',
    OVERLAY_PLAYIN: 'modal__overlay--playin'
};

const ATTRIBUTES = {
    MODAL_CONTENT: 'data-modal-content'
};

const MODAL_JS_PARENT = 'js-modal-parent-node';
const WRAPPER_PAGE_JS = 'js-modal-page';
const MODAL_JS = 'js-modal';
const MODAL_CLOSE_BUTTON = 'js-modal-close';
const MODAL_OVERLAY = 'js-modal-overlay';
const FOCUSABLE_ELEMENTS_STRING = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

/**
 * @function
 * @name createModal
 * @description Adds the modal markup to DOM
 * @param {String} content - Content within modal
 * @param {Object} options - Configuration options from Modal
 * @return {Element} The modalElm
 */
const createModal = (content, options) => {
    const modalElm = ModalTemplate({
        overlayID: MODAL_OVERLAY,
        modalID: MODAL_JS,
        theme: options.theme,
        transitionInOut: options.transitionInOut,
        unclosable: options.unclosable,
        dataAnalyticContainer: options.dataAnalyticContainer,
        dataAnalyticTriggerClose: options.dataAnalyticTriggerClose,
        content
    })({ getNode: true });
    modalElm.setAttribute('id', MODAL_JS_PARENT);
    const modalContentElm = modalElm.querySelector(`[${ATTRIBUTES.MODAL_CONTENT}]`);

    document.body.appendChild(modalElm);

    // insert modal template into
    if (typeof content === 'object') {
        renderer.insert(content, modalContentElm);
    }

    return modalElm;
};

/**
 * @function
 * @name resumeAutoplayVideos
 * @description Adjusting the DOM of any element in the parent heirarchy of an autoplaying
 * video causes it to stop. This function finds all autoplaying videos and resumes
 */
const resumeAutoplayVideos = () => {
    [].slice.call(document.querySelectorAll('video[autoplay]')).forEach(video => video.play());
};

/**
 * Adapter singleton
 * This singleton is responsible for all the common functionality of the modal
 * These functionalities include open/close and event handlers
 */
class Adapter {
    constructor() {
        this.wrapperBody = null;
        this.beforeCloseCallback = noop;
        this.modalNode = null;

        // bound method aliases
        this.onCloseHandlerBind = this.onCloseHandler.bind(this);
        this.onKeydownHandlerBind = this.onKeydownHandler.bind(this);
        this.onTransitionEndHandlerBind = this.onTransitionEndHandler.bind(this);

        this.disableBodyScroll = null;

        this.init();
    }

    /**
     * Init method
     */
    init() {
        this.wrapBody();
        resumeAutoplayVideos();
    }

    /**
     * Attach events : Click and Keydown for modal
     */
    attachEvents() {
        document.body.addEventListener(EVENTS.CLICK, this.onCloseHandlerBind);
        document.body.addEventListener(EVENTS.KEYDOWN, this.onKeydownHandlerBind);
    }

    /**
     * Detach events : Click and Keydown for modal
     */
    detachEvents() {
        document.body.removeEventListener(EVENTS.CLICK, this.onCloseHandlerBind);
        document.body.removeEventListener(EVENTS.KEYDOWN, this.onKeydownHandlerBind);
    }

    /**
     * Close handler for modal
     * Closes modal if click happens on Close CTA or the Modal Overlay
     */
    onCloseHandler(e) {
        const parentButton = findAncestor(e.target, `#${MODAL_CLOSE_BUTTON}`);
        if ((e.target && e.target.matches(`#${MODAL_CLOSE_BUTTON}, #${MODAL_OVERLAY}`)) || parentButton) {
            this.closeModal();
        }
    }

    /**
     * Keydown handler
     * Closes modal on ESC key press
     * Traps focus within modal
     */
    onKeydownHandler(e) {
        if (this.modalNode) {
            // A list of focusable elements
            const listFocusables =
                [].slice.call(this.modalNode.querySelectorAll(FOCUSABLE_ELEMENTS_STRING));

            // Escape key
            if (e.keyCode === 27) {
                this.closeModal();
            }

            // Tab key, when tabbing within the modal
            if (e.keyCode === 9 && listFocusables.indexOf(e.target) >= 0) {
                // When shift+tab from the first element, send focus to the last focusable element
                // in modal
                if (e.shiftKey) {
                    if (e.target === listFocusables[0]) {
                        listFocusables[listFocusables.length - 1].focus();
                        e.preventDefault();
                    }
                } else if (e.target === listFocusables[listFocusables.length - 1]) {
                    // When focused on last element, send focus to first element
                    listFocusables[0].focus();
                    e.preventDefault();
                }
            }

            // When focused outside of modal, send focus to first element
            if (e.keyCode === 9 && listFocusables.indexOf(e.target) === -1) {
                e.preventDefault();
                listFocusables[0].focus();
            }
        }
    }

    /**
     * Loops through all the direct children of the body wraps them in a container to easily
     * add/remove aria-hidden attribute. The wrapped container element is attached to
     * the Adapter
     */
    wrapBody() {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('id', WRAPPER_PAGE_JS);

        document.body.appendChild(wrapper);
        while (document.body.firstChild !== wrapper) {
            wrapper.appendChild(document.body.firstChild);
        }

        this.wrapperBody = wrapper;
    }

    /**
     * Modal open method
     * Calls method to build and attach the dialog element, sets aria-hidden attribute to wrapper,
     * disable body scrolls, sets focus on close CTA
     * @param {String} content - The content of modal
     * @param {Object} options - Configuration options including: { callbacks, theme }
     */
    openModal(content, options) {
        const screenSize = screen.getCurrentState();

        // set an alias to `onResize` to allow adding/removing the bound listener
        this.onResizeCallback = this.onResize.bind(this, options);

        // bail if the modal shouldn't be displayed on small screens
        // and the current device is considered "small"
        if (options.disableSmall && screenSize === 'small') {
            return;
        }

        // Attach the modal element to Adapter, will be null when closed
        this.modalParentNode = createModal(content, options);
        this.modalOverlayNode = document.querySelector(`#${MODAL_OVERLAY}`);
        this.modalNode = document.querySelector(`#${MODAL_JS}`);

        this.setClassBySize(options, screenSize === 'small');

        // Hide page
        this.wrapperBody.setAttribute('aria-hidden', 'true');
        this.pageYOffset = window.pageYOffset;

        // Disable body scroll but allow scrolls on modal
        this.disableBodyScroll = new DisableBodyScroll(`.${CLASSES.MODAL_CONTAINER}`);

        // Give focus to close button
        const modalCloseButton = document.getElementById(MODAL_CLOSE_BUTTON);
        if (modalCloseButton) {
            modalCloseButton.focus();
        }

        if (typeof options.callbacks.afterOpen === 'function') {
            options.callbacks.afterOpen(this.modalNode);
        }

        if (typeof options.callbacks.beforeClose === 'function') {
            this.beforeCloseCallback = options.callbacks.beforeClose;
        }

        if (options.disableSmall || options.sizeDevice) {
            screen.addResizeListener(this.onResizeCallback);
        }

        if (this.modalNode.classList.contains(CLASSES.MODAL_TRANSITIONS)) {
            this.transitionIn();
        }

        this.attachEvents();
    }

    /**
     * @method transitionIn
     * @description Transitions modal in, after openModal()
     */
    transitionIn() {
        if (this.modalNode && this.modalOverlayNode) {
            this.modalNode.classList.add(CLASSES.MODAL_PLAYIN);
            this.modalOverlayNode.classList.add(CLASSES.OVERLAY_PLAYIN);
        }
    }

    /**
     * @method closeModal
     * @description Triggers transitionOut() or destroy()
     */
    closeModal() {
        if (this.modalNode.classList.contains(CLASSES.MODAL_TRANSITIONS)) {
            this.transitionOut();
        } else {
            this.destroy();
        }
    }

    /**
     * @method transitionOut
     * @description Transitions modal out, before calling destroy()
     */
    transitionOut() {
        const screenSize = screen.getCurrentState();
        if (screenSize === 'small') {
            this.destroy();
        } else if (this.modalNode && this.modalOverlayNode) {
            this.modalNode.addEventListener(EVENTS.TRANSITION_END, this.onTransitionEndHandlerBind);
            this.modalNode.classList.remove(CLASSES.MODAL_PLAYIN);
            this.modalOverlayNode.classList.remove(CLASSES.OVERLAY_PLAYIN);
        }
    }

    /**
     * @method onTransitionEndHandler
     * @description Callback handler for transitionOut() transition
     */
    onTransitionEndHandler() {
        this.modalNode.removeEventListener(EVENTS.TRANSITION_END, this.onTransitionEndHandlerBind);
        this.destroy();
    }

    /**
     * @method destroy
     * Calls the before close callback, removes modal and overlay from DOM, removes aria-hidden
     * from wrapper, enable body scrolls
     */
    destroy() {
        this.beforeCloseCallback();

        // Remove the modal wrapper element from DOM
        if (this.modalParentNode) {
            this.modalParentNode.remove();
        }
        this.modalNode = null;

        // Show back page
        this.wrapperBody.removeAttribute('aria-hidden');

        // Enable body scroll
        this.disableBodyScroll.destroy();

        scrollTo(this.pageYOffset, 0);

        if (this.onResizeCallback) {
            screen.removeResizeListener(this.onResizeCallback);
        }

        this.detachEvents();
    }

    /**
     * @method onResize
     * @description Callback handler to close the modal when the screen resizes
     * if the screen size is small and be disabled on small screens
     * @param options {Object} Modal configuration options object
     * @param size {Object} Collection of screen sizes and their state
     */
    onResize(options, size) {
        const { small } = size;

        if (options.disableSmall && small && this.onResizeCallback) {
            this.closeModal();
        }

        this.setClassBySize(options, small);
    }

    /**
     * @method setClassBySize
     * @description Checks if the options include different sizes per "device" (small or large)
     * and toggles the modifier classes for the modal dialog. Otherwise it sets the fallback
     * class of the "size" option
     * @param options {Object} Modal configuration options object
     * @param isSmall {Boolean} Is current screen small
     */
    setClassBySize(options, isSmall) {
        if (!this.modalNode) {
            return;
        }
        if (options.sizeDevice) {
            if (isSmall && options.sizeDevice.small) {
                this.modalNode.classList.remove(`modal--${options.sizeDevice.large}`);
                this.modalNode.classList.add(`modal--${options.sizeDevice.small}`);
            } else if (!isSmall && options.sizeDevice.large) {
                this.modalNode.classList.remove(`modal--${options.sizeDevice.small}`);
                this.modalNode.classList.add(`modal--${options.sizeDevice.large}`);
            }
        } else {
            this.modalNode.classList.add(`modal--${options.size}`);
        }
    }
}

export default new Adapter();
