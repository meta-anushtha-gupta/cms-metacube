// Constants
import { EVENTS } from 'Constants';

// Module dependencies
import { renderer } from 'utils';

// Local dependencies
import indicatorNavigationTemplate from '../templates/navigationIndicatorTemplate';
import indicatorNavigationItemTemplate from '../templates/navigationIndicatorItemTemplate';

/**
 * @const CLASSES
 * @description Collection of constant values for related class attributes of the module
 * @type {{SLIDE: string, ACTIVE: string}}
 */
const CLASSES = {
    INDICATOR_SELECTED: 'carousel-nav__indicator-dot--selected'
};

/**
 * @class indicators
 * @description View component for displaying carousel  'dots' or indicators
 */
export default class Indicators {
    /**
     * @constructor
     * @description On instantiation, sets properties, creates nav elements, and attached events
     * @param config {Object} configuration object with reference to parent nav element
     */
    constructor(config) {
        this.totalCount = config.totalCount;
        this.currentIndex = config.currentIndex;
        this.setActiveSlide = config.setActiveSlide;
        this.toggleSelectedDot = this.toggleSelectedDot.bind(this);

        this.indicatorNav = renderer.fromTemplate(indicatorNavigationTemplate());
        this.indicatorNavList = this.indicatorNav.childNodes[1];

        this.createNavigationIndicators();
        this.attachEvents();
        this.render();
    }

    /**
     * @method createNavigationIndicators
     * @description Create the navigation indicators element
     */
    createNavigationIndicators() {
        for (let i = 0; i < this.totalCount; i += 1) {
            const li = renderer.fromTemplate(indicatorNavigationItemTemplate(i));
            if (i === this.currentIndex) {
                li.children[0].classList.add(CLASSES.INDICATOR_SELECTED);
            }
            this.indicatorNavList.appendChild(li);
        }
    }


    /**
     * @method attachEvents
     * @description Iterates each of the button elements and applies click event
     * listeners and a callback for when clicked
     */
    attachEvents() {
        [...this.indicatorNavList.children].forEach((li) => {
            li.addEventListener(EVENTS.CLICK, this.onIndicatorClick.bind(this));
        });
    }

    /**
     * @method detachEvents
     * @description Iterates each of the button elements and removes all events
     * listeners and a callbacks
     */
    detachEvents() {
        [...this.indicatorNavList.children].forEach((li) => {
            li.removeEventListener(EVENTS.CLICK, this.onIndicatorClick);
        });
    }

    /**
     * @method onIndicatorClick
     * @description Event handler for the indicator dots
     * @param event
     */
    onIndicatorClick(event) {
        const liIndex = event.target.dataset.index !== '' ? Number(event.target.dataset.index) : 0;
        // console.log(`liIndex:${liIndex} currentIndex:${this.currentIndex}`);
        if (this.currentIndex !== liIndex && !Number.isNaN(liIndex)) {
            this.setActiveSlide(liIndex, this.currentIndex);
        }
    }

    /**
     * @method toggleSelectedDot
     * @description toggle selected class indicator dot
     * @param selectedIndex {Number} current index
     */
    toggleSelectedDot(selectedIndex) {
        const dots = this.indicatorNavList.children;
        // remove class from dots
        [...dots].forEach(dot => dot.children[0].classList.remove(CLASSES.INDICATOR_SELECTED));
        // add class to selected dot
        dots[selectedIndex].children[0].classList.add(CLASSES.INDICATOR_SELECTED);
        // update to correct this.currentIndex
        this.currentIndex = selectedIndex;
    }

    /**
     * @method render
     * @description Retrieves the indicatorNav DOM element
     * @return {Element|null} The indicatorNav DOM element
     */
    render() {
        return this.indicatorNav;
    }
}
