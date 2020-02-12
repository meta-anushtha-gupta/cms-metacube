// Constant dependencies
import { EVENTS } from 'Constants';

// Util dependencies
import { noop, screen } from 'utils';

// Local dependencies
import menuSelectorTemplate from './../templates/menuSelector';

const CLASSES = {
    MENU_ITEM: 'menu-selector__item',
    MENU_ITEM_LINK: 'menu-selector__item-link',
    MENU_ITEMS_LIST: 'menu-selector__item-list',
    MENU_OPEN: 'menu-selector--open',
    MENU_TOGGLE: 'menu-selector__selected-item',
    SELECTED: 'menu-selector__item--selected'
};

const ARIA_ATTRIBUTES = {
    HIDDEN: 'aria-hidden'
};

/**
 * Class represeting a MenuSelector.
 */
export default class MenuSelector {
    /**
     * Create a MenuSelector
     * @param {Array} items - An array of items objects. Each object is represented as follows:
     * {
     *   label: 'All',
     *.  value: 'all'
     * }
     * @param {Object} [element] - The DOM element for MenuSelector
     * @param {Number} [defaultSelection=0] - The index of the default selected item
     * @param {Function} [selectionCallback=noop] - Callback when an item is selected
     */
    constructor(items, { element, defaultSelection = 0, selectionCallback = noop }) {
        Object.assign(this, {
            element,
            items,
            defaultSelection,
            selectionCallback
        });
        this.isMenuOpen = false;
        this.onMenuToggleClickHandler = this.onMenuToggleClick.bind(this);
        this.onSelectItemHandler = this.onSelectItem.bind(this);

        this.init();
    }

    /**
     * @method createView
     * @description Create view
     */
    createView() {
        this.element = menuSelectorTemplate({
            items: this.items,
            defaultSelection: this.defaultSelection
        })({ getNode: true });
    }

    /**
     * @method init
     */
    init() {
        if (this.element === null || this.element === undefined) {
            this.createView();
        }
        this.cacheDOM();
        this.attachEvents();
        this.updateListAriaAttribute();
    }

    /**
     * @method destroy
     */
    destroy() {
        this.element = null;
        this.detachEvents();
    }

    /**
     * @method cacheDOM
     * @description Caches DOM elements
     */
    cacheDOM() {
        this.menuToggle = this.element.querySelector(`.${CLASSES.MENU_TOGGLE}`);
        this.menuItemContainer = this.element.querySelector(`.${CLASSES.MENU_ITEMS_LIST}`);
        this.menuItems = this.element.querySelectorAll(`.${CLASSES.MENU_ITEM}`);
    }

    /**
     * @method attachEvents
     * @description Attaches click event to menu toggle, attaches click event to each item
     */
    attachEvents() {
        this.menuToggle.addEventListener(EVENTS.CLICK, this.onMenuToggleClickHandler);
        [].slice.call(this.menuItems).forEach(item =>
            item.addEventListener(EVENTS.CLICK, this.onSelectItemHandler)
        );
        screen.addResizeListener(this.onResizeHandler.bind(this));
    }

    /**
     * @method detachEvents
     */
    detachEvents() {
        this.menuToggle.removeEventListener(EVENTS.CLICK, this.onMenuToggleClickHandler);
        [].slice.call(this.menuItems).forEach(item =>
            item.removeEventListener(EVENTS.CLICK, this.onSelectItemHandler)
        );
    }

    /**
     * @method onMenuToggleClick
     * @description Toggles the menu open/close
     */
    onMenuToggleClick() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    /**
     * @method onSelectItem
     * @description Click handler for each menu item. Does the following:
     * Removes selected class from previously selected item
     * Adds selected class to current item
     * Invokes the selectionCallback
     * Closes menu
     * Update selected item label
     */
    onSelectItem(event) {
        const selectedItem = this.items.find(item =>
            item.value === event.currentTarget.dataset.value);
        [].slice.call(this.menuItems).forEach(item => item.classList.remove(CLASSES.SELECTED));
        event.currentTarget.classList.add(CLASSES.SELECTED);
        this.selectionCallback(selectedItem.value);
        this.closeMenu();
        this.updateMenuToggleLabel(selectedItem.label.trim());
    }

    /**
     * @method render
     * @description will return the element containing list of gallery options
     * eg. Exterior, Interior
     */
    render() {
        return this.element;
    }

    /**
     * @method openMenu
     * @description add the class specific to open menu,
     * update the flag isMenuOpen and aria attribute added on element ul
     */
    openMenu() {
        this.element.classList.add(CLASSES.MENU_OPEN);
        this.isMenuOpen = true;
        this.updateListAriaAttribute();
    }

    /**
     * @method closeMenu
     * @description remove the class specific to open menu,
     * update the flag isMenuOpen and aria attribute added on element ul
     */
    closeMenu() {
        this.element.classList.remove(CLASSES.MENU_OPEN);
        this.isMenuOpen = false;
        this.updateListAriaAttribute();
    }

    /**
     * @method updateListAriaAttribute
     * @description update the aria attribute present on element ul based on screen size and,
     * visible state of element ul.
     */
    updateListAriaAttribute() {
        if (screen.getState().small) {
            this.menuItemContainer.setAttribute(ARIA_ATTRIBUTES.HIDDEN, `${!this.isMenuOpen}`);
        } else {
            this.menuItemContainer.setAttribute(ARIA_ATTRIBUTES.HIDDEN, 'false');
        }
    }

    /**
     * @method updateToggleAriaAttribute
     * @description will set the toggle button aria-hidden to
                    false for small screen and true for large screen
     */
    updateToggleAriaAttribute() {
        if (screen.getState().small) {
            this.menuToggle.setAttribute(ARIA_ATTRIBUTES.HIDDEN, 'false');
        } else {
            this.menuToggle.setAttribute(ARIA_ATTRIBUTES.HIDDEN, 'true');
        }
    }

    /**
     * @method onResizeHandler
     * @description on resize update aria attribute and resets open state based on screen size
     */
    onResizeHandler() {
        // if the menu is open and we transitioned to a large device, close the menu
        if (!screen.getState().small && this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.updateListAriaAttribute();
        }
    }

    updateMenuToggleLabel(label) {
        this.menuToggle.innerHTML = label;
    }
}
