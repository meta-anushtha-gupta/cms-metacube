// Constant dependencies
import { EVENTS, DELAY } from 'Constants';

// Util dependencies
import { scrollTo, dimensions } from 'utils';

/**
 * Module for attaching click events to an anchor element and scrolling the window
 * to the id associated to its `href` attribute.
 *
 * Example markup:
 *
 * <a href="#scroll-to-element" class-"scroll-button">Go to element</a>
 *
 */
export default class ScrollToButton {
    /**
     * @constructor
     * @description Sets the scroll button elements, binds method aliases and subscribes to events
     * @param element {Element} DOM element to attach the ScrollToButton module to
     * @param [offsetOption] {Element|Number|Function} Optional element or number to offset
     *                                                 the window scroll
     *
     */
    constructor(element, offsetOption = null) {
        this.element = element;
        this.offsetOption = offsetOption;
        this.scrollId = this.element.getAttribute('href') || this.element.dataset('scroll-button');
        this.scrollElement = this.getScrollElement();

        // bind method aliases
        this.onClickHandler = this.onClickHandler.bind(this);

        this.attachEvents();
    }

    /**
     * @method attachEvents
     * @description Registers a click event listener and callback
     */
    attachEvents() {
        this.element.addEventListener(EVENTS.CLICK, this.onClickHandler);
    }

    /**
     * @method detachEvents
     * @description Unregisters the click event listener and callback
     */
    detachEvents() {
        this.element.removeEventListener(EVENTS.CLICK, this.onClickHandler);
    }

    /**
     * @method destroy
     * @description When the module is destroyed, detaches all events
     */
    destroy() {
        this.detachEvents();
    }

    /**
     * @method onClickHandler
     * @description Callback handler for when the scroll to element is clicked to determine
     * if there is a valid scrollElement and if so call the scrollToPosition method and then
     * sets focus once scroll animation is done
     * @param event {Event} Event object from DOM click event
     */
    onClickHandler(event) {
        event.preventDefault();
        this.initScroll();
    }

    /**
     * @method getScrollElement
     * @description Retrieves the element to scroll to based on a valid scrollId selector.
     * @return {Element|null} DOM element to scroll to if valid; otherwise null
     */
    getScrollElement() {
        try {
            return document.querySelector(this.scrollId);
        } catch (err) {
            console.warn(`ScrollToButton: The attribute ${this.scrollId} is not a valid ID selector`);
            return null;
        }
    }

    /**
     * @method getOffset
     * @description Fetches the offset scroll position based on the `offsetOption` value/type
     * @return {Number}
     */
    getOffset() {
        if (this.offsetOption && !isNaN(this.offsetOption)) {
            return this.offsetOption;
        } else if (this.offsetOption && this.offsetOption.tagName) {
            return dimensions.getHeight(this.offsetOption);
        } else if (typeof this.offsetOption === 'function') {
            return this.offsetOption();
        }

        return 0;
    }

    /**
     * @method scrollToPosition
     * @description Scrolls to the scrollElement and returns state.
     */
    initScroll() {
        if (this.scrollElement) {
            this.scrollToPosition(true).then(this.setFocus.bind(this));
            this.updateHistory();
        }
    }

    /**
     * @method scrollToPosition
     * @description Scrolls to the scrollElement and returns state.
     */
    scrollToPosition(animate) {
        const { offset } = dimensions.get(this.scrollElement);
        const position = Math.ceil(offset.top - this.getOffset());
        const speed = animate ? DELAY.DELAY_500MS : 0;

        return scrollTo(position, speed);
    }

    /**
     * @method setFocus
     * @description Sets the tab focus to data-focus-element if exists, otherwise uses scrollElement
     * and calls method scrollToPosition.
     */
    setFocus() {
        // Set the tabindex to -1 so it can be focused
        const focusElement = document.querySelector(`${this.scrollId} [data-focus-element='true']`) || this.scrollElement;
        focusElement.setAttribute('tabindex', '-1');
        focusElement.focus();
        this.scrollToPosition();
    }

    /**
     * @method updateHistory
     * @description Pushes a new state to the history collection
     * based on the selected button
     */
    updateHistory() {
        window.history.pushState({}, document.title, `${this.scrollId}`);
    }

    emulateClick() {
        this.initScroll();
    }
}
