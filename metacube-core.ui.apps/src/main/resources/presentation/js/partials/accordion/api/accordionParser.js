/**
 * An api for creating Accordion component from specially tagged DOM element
 *
 * Example markup for creating an accordion from html tags:
 *
 * <div data-accordion
 *      data-disable-small="[boolean]"
 *      data-disable-large="[boolean]"
 *      data-expand-all="[boolean]"
 *      data-expand-multiple="[boolean]"
 *      data-theme="[string]"
 *      data-accordion-name="[string]"
 *      data-label-expand="[string]"
 *      data-label-collapse="[string]">
 *
 *     <div data-accordion-item>
 *         <div data-accordion-title>Title</div>
 *         <div data-accordion-pane>...</div>
 *     </div>
 *     <div data-accordion-item>
 *         <div data-accordion-title>Title</div>
 *         <div data-accordion-pane>...</div>
 *     </div>
 *     ...
 * </div>
 */
// Module dependencies
import {
    noop,
    renderer,
    findAncestor
} from 'utils';

// Local dependencies
import Accordion from './../views/Accordion';

/**
 * @const ATTRIBUTES
 * @description Collection of constant values for related data attributes of the module
 * @type {{ACCORDION: string, ITEMS: string}}
 */
const ATTRIBUTES = {
    ACCORDION: 'data-accordion',
    ITEM: 'data-accordion-item'
};

/**
 * @method getAccordionItems
 * @description
 * Retrieves a collection of the accordion items from a DOM element
 * @returns {NodeList}
 */
export function getAccordionItems(element) {
    const allAccordionItems = element.querySelectorAll(`[${ATTRIBUTES.ITEM}]`);

    const accordionItems = [...allAccordionItems].filter(
        accordionItem => findAncestor(accordionItem, `[${ATTRIBUTES.ACCORDION}]`) === element
    );

    return accordionItems;
}

/**
 * @method createAccordion
 * @description Parses a DOM element for accordion tags and renders a accordion for each instance
 */
export function createAccordion({ element, onBeforeOpen = noop, onAfterOpen = noop,
                                  onBeforeClose = noop, onAfterClose = noop } = {}) {
    if (!element) {
        throw new TypeError('createAccordion: "element" is null or not defined');
    }

    const accordionData = element.dataset;
    const accordionItems = getAccordionItems(element);
    const accordionClassList = Array.prototype.slice.call(element.classList);

    const config = {};
    config.disableSmall = accordionData.disableSmall === 'true';
    config.disableLarge = accordionData.disableLarge === 'true';
    config.expandAll = accordionData.expandAll === 'true';
    config.expandMultiple = !accordionData.expandMultiple || accordionData.expandMultiple === 'true';
    config.theme = accordionData.theme;
    config.accordionName = accordionData.accordionName || '';
    config.onBeforeOpen = onBeforeOpen;
    config.onAfterOpen = onAfterOpen;
    config.onBeforeClose = onBeforeClose;
    config.onAfterClose = onAfterClose;
    config.classList = accordionClassList;
    if (accordionData.labelCollapse && accordionData.labelExpand) {
        config.labels = {
            collapseAll: accordionData.labelCollapse,
            expandAll: accordionData.labelExpand
        };
    }

    const accordion = new Accordion(accordionItems, config);

    element.className = ''; // remove classes from original element
    renderer.insert(accordion.render(), element);

    return accordion;
}

/**
 * export public api
 */
export default {
    createAccordion,
    getAccordionItems
};
