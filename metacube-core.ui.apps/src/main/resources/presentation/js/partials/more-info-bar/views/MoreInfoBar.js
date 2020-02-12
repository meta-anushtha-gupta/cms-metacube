import { EVENTS } from 'Constants';
import { findAncestor } from 'utils';
import moreInfoTemplate from './../templates/moreInfoTemplate';

/**
 * @cosnt CLASSES
 * @description Stores a collection of class names for use in the DOM
 */
const CLASSES = {
    MORE_INFO_BAR: 'more-info-bar',
    MORE_INFO_TOGGLE: 'more-info-bar__toggle'
};

/**
 * @class MoreInfoBar
 * @description View component for displaying a More Info component and managing its state
 */
export default class MoreInfoBar {
    constructor(element, details, CTAs = []) {
        Object.assign(this, { element, details, CTAs });

        this.init();
    }

    /**
     * @method init
     * @description Init method. Calls methods to create More Info and attachs event listeners
     */
    init() {
        this.createMoreInfoBar();
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.moreInfoBar.querySelector(`.${CLASSES.MORE_INFO_TOGGLE}`).addEventListener(EVENTS.CLICK, this.toggleClickHandler.bind(this));
    }

    toggleClickHandler(e) {
        const parentButton = findAncestor(e.target, `.${CLASSES.MORE_INFO_TOGGLE}`);
        if (e.target && e.target.matches(`.${CLASSES.MORE_INFO_TOGGLE}`) || parentButton) {
            this.moreInfoBar.classList.toggle('active');
        }
    }

    /**
     * @method createMoreInfoBar
     * @description Creates the more info element, and finds the toggle button
     */
    createMoreInfoBar() {
        this.moreInfoBar = moreInfoTemplate(this.details, this.CTAs)({ getNode: true });
    }

    /**
     * @method render
     * @description Returns the moreInfoBar element
     * @returns {Element} MoreInfoBar element
     */
    render() {
        return this.moreInfoBar;
    }
}
