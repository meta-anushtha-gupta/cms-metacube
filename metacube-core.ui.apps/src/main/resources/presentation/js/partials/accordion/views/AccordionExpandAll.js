// Module dependencies
import { EVENTS } from 'Constants';
import { renderer } from 'utils';

// Local dependencies
import expandAllTemplate from './../templates/expandAllTemplate';

/**
 * @const ATTRIBUTES
 * @description Collection of constant values for related data attributes of the module
 * @type {{EXPAND_ALL: string, COLLAPSE_ALL: string}}
 */
const ATTRIBUTES = {
    EXPAND_ALL: 'data-expand-all',
    COLLAPSE_ALL: 'data-collapse-all'
};

/**
 * @class AccordionExpandAll
 * @description View component for displaying Expand All / Collapse All links
 */
export default class AccordionExpandAll {
    constructor(items, labels) {
        // properties
        this.expandCollapseElement = null;
        this.accordionItems = items; // ref to the collection of accordion items objects
        this.expandAllLink = null;
        this.collapseAllLink = null;
        this.labels = labels;

        // alias methods
        this.onExpandAll = this.onExpandAll.bind(this);
        this.onCollapseAll = this.onCollapseAll.bind(this);

        this.createExpandCollapseLinks();
    }

    /**
     * @method createExpandCollapseLinks
     * @description Creates from template an element to contain expand / collapse all links
     */
    createExpandCollapseLinks() {
        this.expandCollapseElement =
            renderer.fromTemplate(expandAllTemplate(this.labels));
        this.expandAllLink = this.expandCollapseElement.querySelector(`[${ATTRIBUTES.EXPAND_ALL}]`);
        this.collapseAllLink = this.expandCollapseElement.querySelector(`[${ATTRIBUTES.COLLAPSE_ALL}]`);
        this.attachEvents();
    }

    /**
     * @method attachEvents
     * @description Applies click event listeners and a callback for when clicked expand all and
     * collapse all links
     */
    attachEvents() {
        this.expandAllLink.addEventListener(EVENTS.CLICK, this.onExpandAll);
        this.collapseAllLink.addEventListener(EVENTS.CLICK, this.onCollapseAll);
    }

    /**
     * @method onExpandAll
     * @description Callback method for when Expand All is selected to set the
     * active state of each AccordionItem
     * @param e {Event}
     */
    onExpandAll(e) {
        e.preventDefault();

        [...this.accordionItems].forEach(
            item => item.open()
        );
    }

    /**
     * @method onCollapseAll
     * @description Callback method for when Collapse All is selected to set the
     * inactive state of each AccordionItem
     * @param e {Event}
     */
    onCollapseAll(e) {
        e.preventDefault();

        [...this.accordionItems].forEach(
            item => item.close()
        );
    }

    /**
     * @method render
     * @description Retrieves the expand / collapse all DOM element
     */
    render() {
        return this.expandCollapseElement;
    }
}
