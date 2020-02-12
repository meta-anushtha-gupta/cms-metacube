// Module dependencies
import { EVENTS } from 'Constants';
import { noop } from 'utils';

/**
 * @const ATTRIBUTES
 * @description Collection of constant values for related data attributes of the module
 * @type {{TITLE: string, BUTTON: string, PANE: string}}
 */
const ATTRIBUTES = {
    TITLE: 'data-accordion-title',
    BUTTON: 'data-accordion-button',
    PANE: 'data-accordion-pane'
};

/**
 * @const ARIA_ATTRIBUTES
 * @description Collection of constant values for related aria attributes of the module
 * @type {{CONTROLS: string, EXPANDED: string, HIDDEN: string}}
 */
const ARIA_ATTRIBUTES = {
    CONTROLS: 'aria-controls',
    EXPANDED: 'aria-expanded',
    HIDDEN: 'aria-hidden'
};

/**
 * @const CLASSES
 * @description Collection of constant values for related class attributes of the module
 * @type {{ITEM: string, ACTIVE: string, TITLE: string, PANE: string}}
 */
const CLASSES = {
    ITEM: 'accordion__item',
    ACTIVE: 'accordion__item--active',
    TITLE: 'accordion__title',
    TITLE_DISABLED: 'accordion__title--disabled',
    PANE: 'accordion__pane',
    BUTTON: 'accordion__button',
    BUTTON_DISABLED: 'accordion__button--disabled'
};

/**
 * @class AccordionItem
 * @description View component for displaying an Accordion Item and managing its state
 */
export default class AccordionItem {
    /**
     * @constructor On instantiation, sets the properties and creates an accordion item element
     * @param element {Element} The element to create an accordion item from
     * @param index {Number} item index
     * @param accordionName {string} name used for assigning id to pane
     * @param onClick {function} Click callback
     */
    constructor(element, index, accordionName, onClick = noop) {
        // properties
        this.element = null;
        this.elementTitle = null;
        this.elementButton = null;
        this.elementPane = null;
        this.index = index;
        this.accordionName = accordionName;
        this.onClickHandler = this.onClickHandler.bind(this, onClick);
        this.onKeypressHandler = this.onKeypressHandler.bind(this, onClick);

        // initialize
        this.createAccordionItem(element);
    }

    /**
     * @method onClickHandler
     * @description Click handler which calls the click callback
     * @param callback {Function} Callback handler to apply
     * @param e {Event} DOM Event object from click
     */
    onClickHandler(callback, e) {
        e.preventDefault();
        callback(this);
    }

    /**
     * @method onKeypressHandler
     * @description Keypress handler which calls the click callback
     * if the "space" || "enter" key was pressed
     * @param callback {Function} Callback handler to apply
     * @param e {Event} DOM Event object from keypress
     */
    onKeypressHandler(callback, e) {
        const { key } = e;

        if (key === ' ' || key === 'Enter') {
            e.preventDefault();
            callback(this);
        }
    }

    /**
     * @method createAccordionItem
     * @description Takes the accordion item element and gets the title and content elements in it,
     * then applies the needed classes to each of the elements and makes a call to
     * attach click event
     * @param element
     */
    createAccordionItem(element) {
        this.element = element;
        this.elementTitle = element.querySelector(`[${ATTRIBUTES.TITLE}]`);
        this.elementButton = element.querySelector(`[${ATTRIBUTES.BUTTON}]`) || element.querySelector('button');
        this.elementPane = element.querySelector(`[${ATTRIBUTES.PANE}]`);
        this.isItemDisabled = this.element.dataset.disableItem === 'true';
        this.isPaneDisabled = this.element.dataset.disablePane === 'true';

        if (!this.isItemDisabled) {
            this.element.classList.add(CLASSES.ITEM);
            this.elementTitle.classList.add(CLASSES.TITLE);
            this.elementButton.classList.add(CLASSES.BUTTON);
            this.elementPane.classList.add(CLASSES.PANE);
            this.addAriaAttributes();
            this.attachEvent();

            this.isActive = this.element.dataset.expandAccordionPane === 'true';
            if (this.isActive) {
                this.open();
            }
        }

        if (this.isPaneDisabled) {
            this.elementTitle.classList.add(CLASSES.TITLE_DISABLED);
            // disables button from being focused
            this.elementButton.setAttribute('tabindex', '-1');
            this.elementButton.classList.add(CLASSES.BUTTON_DISABLED);
        }
    }

    /**
     * @method addAriaAttributes
     * @description Sets aria attributes to the button and pane
     */
    addAriaAttributes() {
        const paneId = `${this.accordionName}Item${this.index}`;
        this.elementPane.id = paneId;
        this.elementPane.setAttribute(ARIA_ATTRIBUTES.HIDDEN, 'true');
        this.elementButton.setAttribute(ARIA_ATTRIBUTES.EXPANDED, 'false');
        this.elementButton.setAttribute(ARIA_ATTRIBUTES.CONTROLS, paneId);
    }

    /**
     * @method attachEvent
     * @description Applies click event listener and callback for when button is clicked
     */
    attachEvent() {
        this.elementButton.addEventListener(EVENTS.CLICK, this.onClickHandler);

        if (this.elementButton.nodeName !== 'BUTTON') {
            this.elementButton.addEventListener(EVENTS.KEYPRESS, this.onKeypressHandler);
        }
    }

    /**
     * @method detachEvents
     * @description Removes click event listeners
     */
    detachEvents() {
        this.elementButton.removeEventListener(EVENTS.CLICK, this.onClickHandler);

        if (this.elementButton.nodeName !== 'BUTTON') {
            this.elementButton.removeEventListener(EVENTS.KEYPRESS, this.onKeypressHandler);
        }
    }

    /**
     * @method open
     * @description Sets the isActive state to true and applies
     * the active class to the element
     */
    open() {
        if (!this.isPaneDisabled) {
            this.isActive = true;
            this.element.classList.add(CLASSES.ACTIVE);
            this.elementButton.setAttribute(ARIA_ATTRIBUTES.EXPANDED, 'true');
            this.elementPane.setAttribute(ARIA_ATTRIBUTES.HIDDEN, 'false');
        }
    }

    /**
     * @method close
     * @description Sets the isActive state to false and removes
     * the active class from the element
     */
    close() {
        if (!this.isPaneDisabled) {
            this.isActive = false;
            this.element.classList.remove(CLASSES.ACTIVE);
            this.elementButton.setAttribute(ARIA_ATTRIBUTES.EXPANDED, 'false');
            this.elementPane.setAttribute(ARIA_ATTRIBUTES.HIDDEN, 'true');
        }
    }

    /**
     * @method render
     * @description Retrieves the item DOM element
     * @return {Element|null} The item DOM element
     */
    render() {
        return this.element;
    }

    /**
     * @method destroy
     * @description Detach events and remove element
     */
    destroy() {
        this.detachEvents();
        this.element.remove();
    }
}
