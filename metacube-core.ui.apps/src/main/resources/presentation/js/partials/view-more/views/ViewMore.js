// Constant dependencies
import { EVENTS } from 'Constants';

// Util dependencies
import {
    renderer,
    scrollTo
} from 'utils';

// Local dependencies
import viewMoreTemplate from './../templates/viewMoreTemplate';

/**
 * @const ATTRIBUTES
 * @description Attributes used for selecting elements from the module
 * @type {{SECTION_CONTAINER: string}}
 */
const ATTRIBUTES = {
    CTA_LABEL: 'data-view-more-label',
    SECTION_CONTAINER: 'data-view-more-sections'
};

/**
 * @const CLASSES
 * @description Stores a collection of class names for use in the DOM
 */
const CLASSES = {
    CTA: 'view-more-cta',
    CTA_VISIBLE: 'view-more-cta--visible',
    CTA_LESS: 'view-more-cta--less',
    HIDE: 'hide'
};

/**
 * i18n texts taken from window object
 */
// const localization = window.metacube.ns('pageData').localization;

/**
 * @const defaultConfig
 * @description Default configuration options for a ViewMore cta
 * initialSections: number of sections to show at the beginning
 * moreSections: number of sections to show each time the "View More" cta is clicked
 * @type {{initialSections: number, moreSections: number,
 * disableViewLess: boolean, labels: Object}}
 */
const defaultConfig = {
    initialSections: 3,
    moreSections: 2,
    disableViewLess: false,
    labels: {
        viewMore: 'View More',
        viewLess: 'View Less',
        viewAll: 'View All'
    }
};

/**
 * @class ViewMore
 * @description A view component for displaying a number of sections
 * at a time, when the "View More" cta is clicked. The cta only appears when
 * there are more than this.config.initialSections sections
 */
export default class ViewMore {
    /**
     * @constructor
     * @description On instantiation sets properties and creates View More cta
     * @param sections {Array} Array of section dom nodes
     * @param config {Object} configuration data
     */
    constructor(sections, config = defaultConfig) {
        this.sections = sections;
        this.sectionsElm = null; // Element the sections will append to
        this.viewCta = null;
        this.viewCtaLabel = null;
        this.config = {
            ...defaultConfig,
            ...config
        };
        this.visibleSections = this.config.initialSections;

        // method aliases
        this.onClick = this.onClick.bind(this);
        this.destroy = this.destroy.bind(this);

        // initialize
        this.createViewMoreCta();
    }

    /**
     * @method createViewMoreCta
     * @description Adds initial sections to container element, then checks if should display
     * the View More button according to number of sections and attaches click event
     */
    createViewMoreCta() {
        this.viewMore = renderer.fromTemplate(viewMoreTemplate());
        this.sectionsElm = this.viewMore.querySelector(`[${ATTRIBUTES.SECTION_CONTAINER}]`);
        this.viewCta = this.viewMore.querySelector(`.${CLASSES.CTA}`);
        this.addSections();

        if (this.sections.length > this.config.initialSections) {
            this.viewCtaLabel = this.viewCta.querySelector(`[${ATTRIBUTES.CTA_LABEL}]`);
            this.setMoreCtaLabel();
            this.attachEvents();
            this.viewCta.classList.add(CLASSES.CTA_VISIBLE);
        }
    }

    /**
     * @method setMoreCtaLabel
     * @description Checks if label should be "View More" or "View All", depending on
     * whether it is the last set of sections
     */
    setMoreCtaLabel() {
        if ((this.sections.length - this.visibleSections) > this.config.moreSections) {
            this.viewCtaLabel.innerText = this.config.labels.viewMore;
        } else {
            this.viewCtaLabel.innerText = this.config.labels.viewAll;
        }
    }

    /**
     * @method addLessCtaClass
     * @description Adds a CSS class for different styling of the "View Less" cta
     */
    addLessCtaClass() {
        this.viewCta.classList.add(CLASSES.CTA_LESS);
    }

    /**
     * @method removeLessCtaClass
     * @description Removes class from cta
     */
    removeLessCtaClass() {
        this.viewCta.classList.remove(CLASSES.CTA_LESS);
    }

    /**
     * @method addSections
     * @description go over the sections array and
     * hides/shows each section according to this.visibleSections
     * then appends each section
     */
    addSections() {
        [].slice.call(this.sections).forEach((section, index) => {
            if (index > this.visibleSections - 1) {
                section.classList.add(CLASSES.HIDE);
            } else {
                section.classList.remove(CLASSES.HIDE);
            }

            if (index >= this.sectionsElm.childNodes.length) {
                renderer.append(section, this.sectionsElm);
            }
        });
    }

    /**
     * @method removeSections
     * @description go over the sections to hides nodes according to this.visibleSections
     */
    removeSections() {
        [].slice.call(this.sections).forEach((section, index) => {
            if (index > this.visibleSections - 1) {
                section.classList.add(CLASSES.HIDE);
            }
        });
    }

    /**
     * @method onClick
     * @description Event handler for when the View More cta is clicked.
     * Depending on how many sections are visible it updates the cta label, CSS class
     * and appends/removes the appropriate sections:
     * - If all sections are visible it should go back to default view (3 sections) and
     * scroll up to the top of the section container
     * - If not all sections are visible and the ones hidden are only the last set
     * then if will show all sections and the cta label becomes "View Less"
     * - If not all sections are visible and there is more than one set to load,
     * then it adds to the number of visible sections and cta displays "View More"
     * @param event {Event}
     */
    onClick(event) {
        event.preventDefault();

        if (this.visibleSections === this.sections.length) {
            this.visibleSections = this.config.initialSections;
            this.setMoreCtaLabel();
            this.removeLessCtaClass();
            this.removeSections();
            this.scrollToSectionsTop();
        } else {
            if ((this.sections.length - this.visibleSections) <= this.config.moreSections) {
                this.visibleSections = this.sections.length;
                this.viewCtaLabel.innerText = this.config.labels.viewLess;

                if (this.config.disableViewLess) {
                    this.viewCta.classList.remove(CLASSES.CTA_VISIBLE);
                } else {
                    this.addLessCtaClass();
                }
            } else {
                this.visibleSections = this.visibleSections + this.config.moreSections;
                this.setMoreCtaLabel();
            }

            this.addSections();
        }
    }

    /**
     * @method scrollToSectionsTop
     * @description Scrolls up to the first section
     */
    scrollToSectionsTop() {
        scrollTo(this.sections[0].getBoundingClientRect().top + window.pageYOffset);
    }

    /**
     * @method attachEvents
     * @description Adds a click event listener and callback to the View More cta element
     */
    attachEvents() {
        this.viewCta.addEventListener(EVENTS.CLICK, this.onClick);
    }

    /**
     * @method detachEvents
     * @description Removes the click event listener and callback from the View More cta element
     */
    detachEvents() {
        this.viewCta.removeEventListener(EVENTS.CLICK, this.onClick);
    }

    /**
     * @method destroy
     * @description Detaches events
     */
    destroy() {
        this.detachEvents();
        this.viewMore.remove();
    }

    /**
     * @method render
     * @description Retrieves the viewCta element
     * @return {Node}
     */
    render() {
        return this.viewMore;
    }
}
