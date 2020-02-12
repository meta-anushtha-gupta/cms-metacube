/**
 * This module will make an element sticky once it scrolls past the top of the document
 *
 * Expected markup:
 * <div class="sticky-nav" data-load-module="ScrollToSticky">
 *     <div class="sticky-nav__container">
 *.    </div>
 * </div>
 */

import { EVENTS } from 'Constants';
import { debounce, isScrolledToTop, isScrolledIntoView } from 'utils';

const CLASSES = {
    STICKY: 'sticky',
    DISABLE_BORDER: 'borderless',
    ABSOLUTE: 'absolute',
    UN_TRANSFORM: 'un-transform',
    NAV_CONTAINER: 'sticky-nav__container'
};

const ID = {
    CONTENT: 'content'
};

/**
 * @const defaultOptions
 * @description Collection of default options for ScrollToSticky
 */
const defaultOptions = {
    offsetElement: null,
    disableBorder: false,
    absoluteAtFooter: false,
    isWaypointNav: false
};

/**
 * @class ScrollToSticky
 * @description Renders an element as a sticky element when it reaches the top of the document
 */
export default class ScrollToSticky {
    /**
     * @constructor
     * @param element {Element} Element to create sticky element from
     * @param options {Object} Configurable options for view
     * @param options.offsetElement {Element} Element to offset te sticky element from
     * @param options.disableBorder {Boolean} Flag to disable the border of the sticky element
     * @param options.absoluteAtFooter {Boolean} Flag to set nav as absolute when it reaches footer
     * @param options.isWaypointNav {Boolean} Flag for special case Waypoint Nav
     */
    constructor(element, options = defaultOptions) {
        this.options = {
            ...defaultOptions,
            ...options
        };
        this.element = element;
        this.onScrollDebounce = debounce(this.onScroll.bind(this), 10);
        this.init();
    }

    /**
     * @method init
     * @description Initializes the view by caching the DOM element and attaching its events
     */
    init() {
        this.cacheDOMElements();
        this.setTheme();
        this.attachEvents();
    }

    /**
     * @method destroy
     * @description Destroys the view by detaching its events
     */
    destroy() {
        this.detachEvents();
    }

    /**
     * @method cacheDOMElements
     * @description Caches the DOM elements of the view
     */
    cacheDOMElements() {
        this.mainContent = document.querySelector(`#${ID.CONTENT}`);
        this.footer = document.querySelector('footer');
        this.stickyElement = this.element.querySelector(`.${CLASSES.NAV_CONTAINER}`);
        this.genericSections = document.querySelectorAll('.generic-section');
    }

    /**
     * @method setTheme
     * @description Sets all theme styling
     */
    setTheme() {
        if (this.options.disableBorder) {
            this.stickyElement.classList.add(CLASSES.DISABLE_BORDER);
        }

        if (this.options.isWaypointNav) {
            this.stickyElement.style.background = 'transparent';
        }
    }

    /**
     * @method attachEvents
     * @description Sets an event listener to the scroll event and applies
     * callback to onScrollDebounce when broadcast
     */
    attachEvents() {
        window.addEventListener(EVENTS.SCROLL, this.onScrollDebounce);
    }

    /**
     * @method detachEvents
     * @description Removes an event listener to the scroll event and callback
     */
    detachEvents() {
        window.removeEventListener(EVENTS.SCROLL, this.onScrollDebounce);
    }

    /**
     * @method getOffset
     * @description Retrieves the offset to set the sticky element based on the
     * `offsetElement` if available; otherwise returns `0`
     * @return {Number}
     */
    getOffset() {
        return this.options.offsetElement ?
            this.options.offsetElement.getBoundingClientRect().height : 0;
    }

    /**
     * Scroll handler
     * Toggles the un-transform on the body to allow for position:fixed on child elements
     * If the element is scrolled to top, add sticky class, and add paddingTop
     * If the element should be set as absolute when the footer is visible in the screen,
     * add the absolute class and remove the sticky one
     */
    onScroll() {
        this.mainContent.classList[isScrolledToTop(this.mainContent) ? 'add' : 'remove'](CLASSES.UN_TRANSFORM);
        this.element.style.paddingTop = '';

        if (isScrolledToTop(this.element, this.getOffset())) {
            this.element.style.marginBottom = `${this.element.style.marginBottom + this.stickyElement.style.marginBottom}px`;
            this.element.style.paddingTop = `${this.element.offsetHeight + this.stickyElement.style.marginBottom}px`;
            this.stickyElement.style.top = !this.options.isWaypointNav ? `${this.getOffset()}px` : '';
            this.stickyElement.classList.add(CLASSES.STICKY);

            if (this.options.absoluteAtFooter) {
                if (isScrolledIntoView(this.footer)) {
                    this.stickyElement.classList.remove(CLASSES.STICKY);
                    this.stickyElement.classList.add(CLASSES.ABSOLUTE);
                } else {
                    this.stickyElement.classList.remove(CLASSES.ABSOLUTE);
                }
            }

            const lastElemPos = document.body.scrollHeight - window.innerHeight;
            const position = document.body.scrollTop;
            const items = this.stickyElement.querySelectorAll('.sticky-nav__item');
            const lastElemHeight = this.genericSections[this.genericSections.length - 1]
                                    .offsetHeight;
            const footerHeight = document.querySelector('.custom-footer').offsetHeight;
            let backToTopHeight = 0;

            if (document.querySelector('.back-to-top--sticky') !== null) {
                backToTopHeight = document.querySelector('.back-to-top--sticky').offsetHeight;
            }
            const viewportHeight = window.innerHeight - this.stickyElement.offsetHeight
                                    - backToTopHeight - footerHeight;

            // if the last element height is less than viewport height
            if (lastElemHeight <= viewportHeight) {
                // if page at bottom
                if (position >= lastElemPos) {
                    [].forEach.call(items, (item) => {
                        item.classList.remove('sticky-nav__item--active');
                    });

                    items[items.length - 1].classList.add('sticky-nav__item--active');
                } else if (items[items.length - 1].classList[1] === 'sticky-nav__item--active') {
                    items[items.length - 1].classList.remove('sticky-nav__item--active');
                    items[items.length - 2].classList.add('sticky-nav__item--active');
                }
            }
        } else {
            this.stickyElement.style.top = '';
            this.stickyElement.classList.remove(CLASSES.STICKY);
        }
    }
}
