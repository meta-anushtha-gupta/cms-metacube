// Platform dependencies
import { EVENTS } from 'Constants';
import { screen } from 'utils';

/**
 * @const CLASSES
 * @description List of class name constants
 * @type {{NO_SCROLL: string}}
 */
const CLASSES = {
    NO_SCROLL: 'no-scroll'
};

/**
 * @class DisableBodyScroll
 * @description Utility class for disabling body scroll
 * Scroll within a selector is allowed if a selector is provided
 */
class DisableBodyScroll {
    /**
     * @constructor Create DisableBodyScroll
     * @param ignoreSelector {String} Optional selector to allow scroll functionality
     */
    constructor(ignoreSelector) {
        this.ignoreSelector = ignoreSelector || null;
        this.ignoreElem = this.ignoreSelector ? document.querySelector(this.ignoreSelector) : null;
        this.clientY = null;

        // method alias
        this.captureClientY = this.captureClientY.bind(this);
        this.preventOverscroll = this.preventOverscroll.bind(this);
        this.preventBodyScroll = this.preventBodyScroll.bind(this);

        this.init();
    }

    /**
     * @method captureClientY
     * @description Cache the clientY co-ordinate for comparison
     * @param event {Object} event
     */
    captureClientY(event) {
        if (event.targetTouches.length === 1) {
            this.clientY = event.targetTouches[0].clientY;
        }
    }

    /**
     * @method preventOverscroll
     * @description Detect whether the ignoreElem is at the top or
     * the bottom of its scroll and prevents user from scrolling beyond
     * @param event {Object} event
     */
    preventOverscroll(event) {
        // if not a single touch
        if (event.targetTouches.length !== 1) {
            return;
        }

        const currentClientY = event.targetTouches[0].clientY - this.clientY;

        // if the element is at the top of its scroll
        // and user scrolls down
        if (this.ignoreElem.scrollTop === 0 && currentClientY > 0) {
            event.stopPropagation();
            event.preventDefault();
        }

        // if the element is at the bottom of its scroll
        // and user scrolls up
        // ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
        const ignoreElemScrollPosition = this.ignoreElem.scrollHeight - this.ignoreElem.scrollTop;
        if ((ignoreElemScrollPosition <= this.ignoreElem.clientHeight) && currentClientY < 0) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    /**
     * @method preventBodyScroll
     * @description Prevent default unless within ignoreSelector
     * @param event {Object} event
     */
    preventBodyScroll(event) {
        if (!this.ignoreElem && !event.target.closest(this.ignoreSelector)) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    /**
     * @method attachEvents
     * @description Adds event listeners for body and ignoreElem
     */
    attachEvents() {
        if (!!this.ignoreElem && screen.getState().small) {
            this.ignoreElem.addEventListener(EVENTS.TOUCHSTART, this.captureClientY);
            this.ignoreElem.addEventListener(EVENTS.TOUCHMOVE, this.preventOverscroll);
        }
        document.body.addEventListener(EVENTS.TOUCHMOVE, this.preventBodyScroll);
    }

    /**
     * @method detachEvents
     * @description Removes event listeners for body and ignoreElem
     */
    detachEvents() {
        if (!!this.ignoreElem && screen.getState().small) {
            this.ignoreElem.removeEventListener(EVENTS.TOUCHSTART, this.captureClientY);
            this.ignoreElem.removeEventListener(EVENTS.TOUCHMOVE, this.preventOverscroll);
        }
        document.body.removeEventListener(EVENTS.TOUCHMOVE, this.preventBodyScroll);
    }

    /**
     * @method destroy
     * @description Removes class from body, calls method to remove event listeners
     */
    destroy() {
        document.body.classList.remove(`${CLASSES.NO_SCROLL}`);
        this.detachEvents();
    }

    /**
     * @method init
     * @description Adds class to body, calls method to add event listeners
     */
    init() {
        document.body.classList.add(`${CLASSES.NO_SCROLL}`);
        this.attachEvents();
    }
}

export default DisableBodyScroll;
