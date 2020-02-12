// Module dependencies
import {
    noop,
    renderer,
    screen,
    customEventDispatcher
} from 'utils';
import { CUSTOM_EVENTS } from 'Constants';

// Local dependencies
import AccordionItem from './AccordionItem';
import AccordionExpandAll from './AccordionExpandAll';
import accordionTemplate from './../templates/accordionTemplate';

/**
 * @const CLASSES
 * @description Collection of constant values for related class attributes of the module
 * @type {{DISABLED_SMALL: string, DISABLED_LARGE: string}}
 */
const CLASSES = {
    DISABLED_SMALL: 'accordion--disabled-small',
    DISABLED_LARGE: 'accordion--disabled-large'
};

/**
 * @const ARIA_ATTRIBUTES
 * @description Collection of constant values for related aria attributes of the module
 * @type {{EXPANDED: string, HIDDEN: string}}
 */
const ARIA_ATTRIBUTES = {
    EXPANDED: 'aria-expanded',
    HIDDEN: 'aria-hidden'
};

/**
 * @const defaultConfig
 * @description Default configuration options for an Accordion
 * @type {{disableSmall: boolean, disableLarge: boolean, expandAll: boolean,
 * expandMultiple: boolean, theme: string|Array, accordionName: string, onBeforeOpen: function,
 * onAfterOpen: function, onBeforeClose: function, onAfterClose: function}}
 */
const defaultConfig = {
    disableSmall: false,
    disableLarge: false,
    expandAll: false,
    expandMultiple: true,
    theme: '',
    themeSmall: '',
    themeLarge: '',
    accordionName: '',
    labels: {
        collapseAll: 'Collapse All',
        expandAll: 'Expand All'
    },
    onBeforeOpen: noop,
    onAfterOpen: noop,
    onBeforeClose: noop,
    onAfterClose: noop,
    classList: [],
    autoCollapse: false
};

/**
 * @class Accordion
 * @description View component for displaying an Accordion
 */
export default class Accordion {
    constructor(items, config = defaultConfig) {
        // properties
        this.accordion = null; // ref to the accordion element
        this.accordionItems = null; // ref to the collection of accordion items objects
        this.activeItem = null; // ref to the accordion item that has been recently opened
        this.config = {
            ...defaultConfig,
            ...config
        };

        // alias methods
        this.onItemClick = this.onItemClick.bind(this);

        this.smallDevice = screen.getState().small;
        this.onResize = this.onResize.bind(this);
        this.attachEvents();

        // init accordion
        this.createAccordion();
        this.createAccordionItems(items);
        this.createExpandCollapseAllLinks();
        this.render();
    }

    /**
     * @method createAccordion
     * @description Creates an accordion element, adds appropriate classes
     */
    createAccordion() {
        this.accordion = renderer.fromTemplate(accordionTemplate());
        this.config.classList.forEach(c => this.accordion.classList.add(c));

        if (this.config.disableSmall) {
            this.accordion.classList.add(CLASSES.DISABLED_SMALL);
        } else if (this.config.disableLarge) {
            this.accordion.classList.add(CLASSES.DISABLED_LARGE);
        }

        this.setTheme();
    }

    /**
     * @method createAccordionItems
     * @description Iterates a collection of elements to create an AccordionItem for each
     * @param items {Array} Collection of elements to create AccordionItem from
     */
    createAccordionItems(items) {
        this.accordionItems = [].slice.call(items).map(
            (item, index) => new AccordionItem(
                item, index, this.config.accordionName, this.onItemClick
            )
        );

        this.setAccessibilityAttributes();
    }

    /**
     * @method createExpandCollapseAllLinks
     * @description Checks the config value to create an AccordionExpandAll view and append it
     * into the accordion element. Filter to pass only the enabled items
     */
    createExpandCollapseAllLinks() {
        if (this.config.expandAll) {
            const filteredItems = this.accordionItems.filter(
                item => item.element.dataset.disableItem !== 'true'
            );
            const expandCollapseAll = new AccordionExpandAll(filteredItems, this.config.labels);
            this.accordion.appendChild(expandCollapseAll.render());
        }
    }

    /**
     * @method onItemClick
     * @description Callback method for when an AccordionItem is selected to open
     * or close it and call other callbacks defined in the config object
     * @param item {Element}
     */
    onItemClick(item) {
        if (!item.isActive) {
            this.config.onBeforeOpen(item.index);

            // if expandMultiple is false close previously opened item
            if (!this.config.expandMultiple && this.activeItem) {
                this.activeItem.close();
            }

            item.open();
            this.activeItem = item;
            this.config.onAfterOpen(item.index);
            this.dispatchDisplayState();
        } else {
            this.config.onBeforeClose(item.index);
            item.close();
            this.config.onAfterClose(item.index);
        }
    }

    /**
     * @method dispatchDisplayState
     * @description dispatches custom event to set active state
     */
    dispatchDisplayState() {
        console.log(this);
        customEventDispatcher.dispatchEvent(
            customEventDispatcher.createCustomEvent(CUSTOM_EVENTS.CONTAINER_DISPLAY_STATE_CHANGED)
        );
    }

    /**
     * @method render
     * @description Renders the accordionItems to the accordion and returns the
     * accordion element
     */
    render() {
        [...this.accordionItems].forEach(
            item => this.accordion.appendChild(item.render())
        );

        return this.accordion;
    }

    /**
     * @method destroy
     * @description Destroy accordion items, and remove element
     */
    destroy() {
        [].slice.call(this.accordionItems).forEach(item => item.destroy());
        this.detachEvents();
        this.accordion.remove();
    }

    /**
     * @method attachEvents
     * @description  helper method to attach events for the component
     */
    attachEvents() {
        screen.addResizeListener(this.onResize);
    }

    /**
     * @method detachEvents
     * @description helper method to detach events for the component
     */
    detachEvents() {
        screen.removeResizeListener(this.onResize);
    }

    /**
     * @method onResize
     * @description  helper method to control the device
     * @return {[type]} [description]
     */
    onResize() {
        this.smallDevice = screen.getState().small;
        this.setTheme();
        this.setAccessibilityAttributes();
    }

    /**
     * @method setTheme
     * @description add the theme classes for the accordion
     */
    setTheme() {
        // if themeSmall or themeLarge are empty, don't print the class
        if (this.smallDevice && this.config.themeSmall !== '') { // small device
            this.config.themeSmall.split(',').forEach((theme) => {
                this.accordion.classList.add(`accordion--${theme.trim()}`);
            });
            this.config.themeLarge.split(',').forEach((theme) => {
                this.accordion.classList.remove(`accordion--${theme.trim()}`);
            });
        } else if (!this.smallDevice && this.config.themeLarge !== '') {
            this.config.themeLarge.split(',').forEach((theme) => {
                this.accordion.classList.add(`accordion--${theme.trim()}`);
            });
            this.config.themeSmall.split(',').forEach((theme) => {
                this.accordion.classList.remove(`accordion--${theme.trim()}`);
            });
        }

        // the theme prop will always print, no matter the deviceSize
        if (this.config.theme) {
            this.config.theme.split(',').forEach((theme) => {
                this.accordion.classList.add(`accordion--${theme.trim()}`);
            });
        }
    }

    /**
     * @method setAccessibilityAttributes
     * @description Check if accordion is disabled and set or remove 'aria-expanded', 'aria-hidden',
     * 'role' and 'tabindex' attributes accordingly for accessibility for every item
     */
    setAccessibilityAttributes() {
        const isAccordionDisabled = (this.smallDevice && this.config.disableSmall) ||
                                    (!this.smallDevice && this.config.disableLarge);

        this.accordionItems.forEach((item) => {
            if (item.isItemDisabled) {
                return;
            }

            if (isAccordionDisabled) {
                item.elementButton.setAttribute('role', 'heading');
                item.elementButton.setAttribute('tabindex', '-1');
                item.elementButton.removeAttribute(ARIA_ATTRIBUTES.EXPANDED);
                item.elementPane.removeAttribute(ARIA_ATTRIBUTES.HIDDEN);
            } else {
                if (!item.isPaneDisabled) {
                    item.elementButton.removeAttribute('role');
                    item.elementButton.removeAttribute('tabindex');
                }

                item.elementButton.setAttribute(ARIA_ATTRIBUTES.EXPANDED, `${item.isActive}`);
                item.elementPane.setAttribute(ARIA_ATTRIBUTES.HIDDEN, `${!item.isActive}`);
            }
        });
    }

    /**
     * @method collapseAllItems
     * @description  method helper to close all items from the accordion
     * this helps to add some blur functionality when users click outside
     * of accordion
     */
    collapseAllItems() {
        this.config.onBeforeClose();
        this.accordionItems.forEach(item => item.close());
        this.config.onAfterClose();
    }
}
