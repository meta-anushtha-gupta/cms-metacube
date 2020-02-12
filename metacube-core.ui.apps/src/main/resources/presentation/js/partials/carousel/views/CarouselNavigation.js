// Constants
import { EVENTS } from 'Constants';

// Module dependencies
import { renderer } from 'utils';
import Indicators from './Indicators';

// Local dependencies
import navigationTemplate from '../templates/navigationTemplate';
import CarouselTypes from './../constants/carouselTypes';

/**
 * @const ATTRIBUTES
 * @description Collection of constant values for related data attributes of the module
 * @type {{BUTTONS: string}}
 */
const ATTRIBUTES = {
    BUTTONS: 'data-navigation-button',
    CURRENT_PAGE: 'data-carousel-page-current',
    TOTAL_PAGES: 'data-carousel-page-total'
};

/**
 * @const CLASSES
 * @description Collection of constant values for related class attributes of the module
 * @type {{SLIDE: string, ACTIVE: string}}
 */
const CLASSES = {
    NAV_INACTIVE: 'carousel-nav--inactive',
    NAV_SHOW_SMALL: 'carousel-nav--show-small',
    BUTTON: 'carousel-nav__button',
    BUTTON_INACTIVE: 'carousel-nav__button--inactive'
};

/**
 * @class CarouselNavigation
 * @description View component for displaying a Carousel navigation and managing its state
 */
export default class CarouselNavigation {
    /**
     * @constructor
     * @description On instantiation, sets properties, creates nav elements, and attached events
     * @param config {Object} configuration object
     */
    constructor(config) {
        // properties
        this.navigation = null;
        this.indicatorNav = null;
        this.type = config.type || CarouselTypes.OVERLAY;
        this.buttons = null;
        this.buttonNext = null;
        this.buttonPrev = null;
        this.onNext = config.onNext;
        this.onPrev = config.onPrev;
        this.currentIndex = config.currentIndex;
        this.totalCount = config.totalCount;
        this.infinite = config.infinite || false;
        this.indicators = config.indicators || false;
        this.navEnabledSmall = config.navEnabledSmall || false;
        this.labels = config.labels;
        this.theme = config.theme;
        this.toggleDots = null;
        this.carouselInterval = null;
        this.carouselTimer = 0;
        // method aliases
        this.onButtonClick = this.onButtonClick.bind(this);
        // initialize
        this.createNavigation();

        this.indicatorsConfig = {
            totalCount: this.totalCount,
            currentIndex: this.currentIndex,
            setActiveSlide: config.setActiveSlide
        };
        if (this.indicators) {
            const INDICATORS = new Indicators(this.indicatorsConfig);
            this.toggleDots = INDICATORS.toggleSelectedDot;
            this.indicatorNav = INDICATORS.indicatorNav;
            this.navigation.appendChild(this.indicatorNav);
        }
        this.attachEvents();
        this.setCurrentPage(this.currentIndex);
        this.renderPageTotal();

        if (document.querySelectorAll['data-interval'] !== undefined) {
            this.autoRotate();

            setTimeout(() => {
                if (document.querySelectorAll('.fixed-hero')[0]) {
                    this.carouselTimer = parseInt(document.querySelectorAll('.fixed-hero')[0].getAttribute('data-interval'), 10) * 1000;
                    this.autoRotate();
                }
            }, 100);
        }
    }

    /**
     * @method createNavigation
     * @description Creates a navigation element and sets reference to its buttons
     */
    createNavigation() {
        this.navigation = renderer.fromTemplate(navigationTemplate(this.labels));
        this.buttons = this.navigation.querySelectorAll(`[${ATTRIBUTES.BUTTONS}]`);
        this.buttonNext = this.navigation.querySelector(`[${ATTRIBUTES.BUTTONS}="next"]`);
        this.buttonPrev = this.navigation.querySelector(`[${ATTRIBUTES.BUTTONS}="prev"]`);
        this.setTheme();
        this.setVisibility();
    }

    /**
     * @method destroy
     * @description Removes all event listeners and empties out the navigation reference
     */
    destroy() {
        this.detachEvents();
        this.navigation = null;
    }

    /**
     * @method attachEvents
     * @description Iterates each of the button elements and applies click event
     * listeners and a callback for when clicked
     */
    attachEvents() {
        [...this.buttons].forEach((button) => {
            button.addEventListener(EVENTS.CLICK, this.onButtonClick);
        });
    }

    /**
     * @method detachEvents
     * @description Iterates each of the button elements and removes all events
     * listeners and a callbacks
     */
    detachEvents() {
        [...this.buttons].forEach((button) => {
            button.removeEventListener(EVENTS.CLICK, this.onButtonClick);
        });
    }

    /**
     * @method setTheme
     * @description Sets the css theme of the navigation
     */
    setTheme() {
        this.navigation.classList.add(`carousel-nav--${this.type}`);
        if (this.theme) {
            this.navigation.classList.add(`carousel-nav--${this.theme}`);
        }
    }

    /**
     * @method setVisibility
     * @description Sets the css visibility based on the number of items
     * and navEnabledSmall configuration
     */
    setVisibility() {
        if (this.totalCount <= 1) {
            this.navigation.classList.add(CLASSES.NAV_INACTIVE);
        } else if (this.navEnabledSmall) {
            this.navigation.classList.add(CLASSES.NAV_SHOW_SMALL);
        }
    }

    /**
     * @method onButtonClick
     * @description Event handler for when a navigation button element is clicked
     * to determine the button direction and apply the corresponding callback
     * @param event
     */
    onButtonClick(event) {
        if (event.target.getAttribute(ATTRIBUTES.BUTTONS) === 'prev') {
            this.onPrev();
        } else {
            this.onNext();
        }
        clearInterval(this.carouselInterval);
        this.autoRotate();
    }

    /**
     * @method autoRotate
     * @description Auto rotate carousel
     */
    autoRotate() {
        if (this.carouselTimer !== 0) {
            this.carouselInterval = setInterval(() => {
                this.carouselTimer = parseInt(document.querySelectorAll('.fixed-hero')[0].getAttribute('data-interval'), 10) * 1000;
                this.onNext();
            }, this.carouselTimer);
        }
    }

    /**
     * @method setCurrentPage
     * @description Sets the current page index of the navigation and determines the
     * visual state of the buttons based on the current index and config options
     * @param index {Number} Current page index
     */
    setCurrentPage(index) {
        const isInfinite = this.infinite;
        const isFirst = index === 0;
        const isLast = (index + 1) === this.totalCount;

        if (!isInfinite && isFirst) this.disableButton('Prev');
        else this.enableButton('Prev');

        if (!isInfinite && isLast) this.disableButton('Next');
        else this.enableButton('Next');

        this.currentIndex = index;
        this.renderCurrentPage();
    }

    /**
     * @method enableButton
     * @description Removes the disabled class from a button
     * @param type {String} Enum namespace for a button (expect 'Prev' || 'Next')
     */
    enableButton(type) {
        this[`button${type}`].classList.remove(CLASSES.BUTTON_INACTIVE);
    }

    /**
     * @method disableButton
     * @description Adds the disabled class to a button
     * @param type {String} Enum namespace for a button (expect 'Prev' || 'Next')
     */
    disableButton(type) {
        this[`button${type}`].classList.add(CLASSES.BUTTON_INACTIVE);
    }

    /**
     * @method renderCurrentPage
     * @description Renders the current page number to the current page element
     */
    renderCurrentPage() {
        const currPageElm = this.navigation.querySelector(`[${ATTRIBUTES.CURRENT_PAGE}]`);

        if (currPageElm) {
            currPageElm.innerHTML = this.currentIndex + 1;
        }
    }

    /**
     * @method renderPageTotal
     * @description Renders the page total to the total pages element
     */
    renderPageTotal() {
        const pagesElm = this.navigation.querySelector(`[${ATTRIBUTES.TOTAL_PAGES}]`);

        if (pagesElm) {
            pagesElm.innerHTML = this.totalCount;
        }
    }

    /**
     * @method render
     * @description Retrieves the navigation DOM element
     * @return {Element|null} The navigation DOM element
     */
    render() {
        return this.navigation;
    }
}
