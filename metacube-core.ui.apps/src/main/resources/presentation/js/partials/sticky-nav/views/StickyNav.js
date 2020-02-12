/**
 * StickyNav JS module
 * This module initializes the sticky nav and the animate scroll for the nav
 *
 * Expected Markup:
 * See `ui.apps/src/main/resources/presentation/js/templates/sticky-nav.js`
 */
import ScrollToButton from 'partials/ScrollToButton';
import Waypoint from 'partials/Waypoint';
import { CUSTOM_EVENTS } from 'Constants';
import { screen, dimensions, ClickOutside, isScrolledToTop, customEventDispatcher } from 'utils';
import ESAPI from 'node-esapi';

import ScrollToSticky from './ScrollToSticky';
import StickyNavTemplate from './../templates/sticky-nav';

/**
 * @const CLASSES
 * @description Stores a collection of class names for use in the DOM
 */
const CLASSES = {
    ACTIVE: 'sticky-nav__item--active',
    STICKY_NAV_ITEM: 'sticky-nav__item',
    STICKY_NAV_LINKS: 'sticky-nav__item-link',
    STICKY_NAV_CONTAINER: 'sticky-nav__container',
    STICKY_NAV_TOGGLE: 'sticky-nav__nav-toggle',
    NO_SCROLL: 'no-scroll'
};

/**
 * @const PROPS
 * @description Stores the max amount of items allowed in 'row' view on
 * large/x-large before sticky nav converts to drop down
 */
const PROPS = {
    MAX_ITEMS_DESKTOP: 8,
    MAX_ITEMS_TABLET: 8
};

/**
 * @const DEFAULT_OPTIONS
 * @description Default options used for configuration of StickyNav
 */
const DEFAULT_OPTIONS = {
    offset: 2,
    waypointSection: 'data-waypoint',
    stickyNavState: 'data-page-level-sticky-nav-state'
};

/**
 * @const DEFAULT_LOCALIZATION
 * @description Default localization labels
 * skipTo: The label for the "Skip to" cta
 * @type {{SKIP_TO: String}}
 */
const DEFAULT_LOCALIZATION = {
    SKIP_TO: 'Skip to'
};

/**
 * i18n texts taken from window object to be used in the view
 */
const {
    SKIP_TO
} = DEFAULT_LOCALIZATION;

/**
 * @description Stores whether the nav is expanded or not
 */
let isNavExpanded = false;

export default class StickyNav {
    constructor(element, options) {
        this.element = element;
        this.stickyNavLinks = null;
        this.stickyNavToggle = null;
        this.stickyNavContainer = null;
        this.clickOutsideEventHandler = null;
        this.options = (options) ? Object.assign({}, DEFAULT_OPTIONS, options) : DEFAULT_OPTIONS;
        this.currentScreenState = screen.getState();
        this.numVisibleSections = 0;
        this.firstActiveSectionIndex = 0;
        this.scrollToButtons = null;
        this.domObserver = null;

        // method aliases
        this.onScreenResize = this.onScreenResize.bind(this);
        this.stickyNavOutsideClickHandler = this.stickyNavOutsideClickHandler.bind(this);
        this.stickyNavToggleHandler = this.stickyNavToggleHandler.bind(this);
        this.stickyNavTriggerHandlerBound = this.stickyNavTriggerHandler.bind(this);

        this.init.bind(this)();
    }

    /**
     * @method init
     * @description calls initial functions
     * Caches DOM
     * Populates the stick nav markup
     * Attaches events
     * Init sticky scroll
     * Init smooth scroll to section
     * Init waypoint (highlights section in nav via page scroll)
     * Sets the number of visible sections on the page
     * Sets initial state of sticky nav
     * Checks for a loaded anchor
     */
    init() {
        this.cacheDOM();
        this.populateTemplate();
        if (this.waypointSections.length > 0) {
            this.attachEvents();
            this.initStickyScroll();
            this.initScrollToButtons();
            this.initWaypoints();
            this.setInitialState();
            this.checkforLoadedAnchor();
        }
    }

    /**
     * @method destroy
     * @description Destroys the StickNav by detaching its events
     */
    destroy() {
        this.detachEvents();
    }

    /**
     * @method cacheDOM
     */
    cacheDOM() {
        this.waypointSections = document.querySelectorAll(`[${this.options.waypointSection}]`);
    }

    /**
     * @method populateTemplate
     * @description Populates the ES6 template literal and inserts it into the DOM
     */
    populateTemplate() {
        let waypointSections = Array.prototype.slice.call(this.waypointSections);
        // Variable to keep track of last visible item
        let lastVisibleIndex = -1;
        // create an array with objects containing the waypoint deep link, navigation label,
        // excludeSelection and isLastVisibleItem
        waypointSections = waypointSections.reduce((prev, waypointSection, index, array) => {
            const OBJ = {};
            OBJ.deepLink = waypointSection.dataset.waypoint;
            OBJ.navigationLabel = waypointSection.dataset.waypointLabel;
            OBJ.excludeSection = waypointSection.dataset.excludeSection;

            // If current item is not excluded,
            // make it last visible index and update number of visible sections on page
            if (!OBJ.excludeSection || OBJ.excludeSection === 'false') {
                lastVisibleIndex = index;
                this.numVisibleSections += 1;
            }

            // If current item is excluded, check to see if all previous sections were excluded too,
            // and update the initial active index to the next section
            if (!this.currentScreenState.small && OBJ.excludeSection === 'true' && this.firstActiveSectionIndex === index) {
                this.firstActiveSectionIndex += 1;
            }

            // If the last item is excluded, and last visible index is an item in list,
            // make the last visible item's isLastVisibleItem flag to true
            if (index === (array.length - 1) && OBJ.excludeSection === 'true' && lastVisibleIndex !== -1) {
                prev[lastVisibleIndex].isLastVisibleItem = true;
            }

            prev.push(OBJ);
            return prev;
        }, []);

        if (this.stickyNavStateIsDropdown()) {
            this.element.insertAdjacentHTML('beforeEnd', StickyNavTemplate(waypointSections, SKIP_TO, this.firstActiveSectionIndex));
        } else {
            this.element.insertAdjacentHTML('beforeEnd', StickyNavTemplate(waypointSections, SKIP_TO));
        }
    }

    /**
     * @method attachEvents
     * @description Attaches event handlers
     * Click handler for clicking outside sticky nav
     * Mobile Animation DOM Mutation Observer
     * Screen resize handler
     */
    attachEvents() {
        this.stickyNavLinks = this.element.querySelectorAll(`.${CLASSES.STICKY_NAV_LINKS}`);
        this.stickyNavToggle = this.element.querySelector(`.${CLASSES.STICKY_NAV_TOGGLE}`);
        this.stickyNavContainer = this.element.querySelector(`.${CLASSES.STICKY_NAV_CONTAINER}`);

        this.domObserver = new MutationObserver(this.observeDOMChanges.bind(this));
        this.domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        this.clickOutsideEventHandler = new ClickOutside(
            this.stickyNavContainer,
            this.stickyNavToggleHandler,
            this.stickyNavOutsideClickHandler
        );

        customEventDispatcher.addEventListener(
            CUSTOM_EVENTS.STICKY_NAV_TRIGGER,
            this.stickyNavTriggerHandlerBound
        );

        screen.addResizeListener(this.onScreenResize);
    }

    /**
     * @method detachEvents
     * @description Detaches event handlers
     */
    detachEvents() {
        this.domObserver.disconnect();
        this.clickOutsideEventHandler.destroy();
        customEventDispatcher.removeEventListener(
            CUSTOM_EVENTS.STICKY_NAV_TRIGGER,
            this.stickyNavTriggerHandlerBound
        );

        screen.removeResizeListener(this.onScreenResize);
    }

    /**
     * @method initStickyScroll
     * @description Initializes scroll to sticky with sticky nav
     */
    initStickyScroll() {
        return new ScrollToSticky(this.element);
    }

    /**
     * @method initScrollToButtons
     * @description Iterates a collection of elements and creates ScrollToButton instances
     */
    initScrollToButtons() {
        this.scrollToButtons = [].slice.call(this.stickyNavLinks).map(
            stickyNavLink => new ScrollToButton(stickyNavLink, this.getStickyNavOffset.bind(this))
        );
        return this.scrollToButtons;
    }

    /**
     * @method initWaypoints
     * @description Initializes waypoints with waypoint nav sections
     */
    initWaypoints() {
        return [].slice.call(this.waypointSections).map((waypointSection) => {
            const WAYPOINT = new Waypoint(waypointSection, {
                callback: this.waypointCallback.bind(this)
            }, true, this.getStickyNavOffset.bind(this));
            return Object.assign(waypointSection, { WAYPOINT });
        });
    }

    /**
     * @method observeDOMChanges
     * @description Watches for DOM changes that occur on document.body
     * Used for adding mobile animation
     */
    observeDOMChanges(mutations) {
        const FILTER_MUTATIONS = mutation => (
            mutation.target.tagName === 'BODY' && [].slice.call(mutation.addedNodes).filter(node => node.className ===
                CLASSES.STICKY_NAV_CONTAINER)
        );

        const EXPANDED_NAV_IN_MOBILE = [].slice.call(mutations).filter(FILTER_MUTATIONS);

        if (EXPANDED_NAV_IN_MOBILE) {
            setTimeout(() => {
                if (this.stickyNavStateIsDropdown()) {
                    document.querySelector(`.${CLASSES.STICKY_NAV_CONTAINER}`).setAttribute(this.options.stickyNavState,
                        !isNavExpanded ? 'collapsed' : 'expanded');
                }
            }, 5);
        }
    }

    /**
     * @method stickyNavStateIsDropdown
     * @description Returns whether the sticky nav is in drop-down/modal view
     */
    stickyNavStateIsDropdown() {
        return this.currentScreenState.small || this.numVisibleSections > this.getMaxItemCount();
    }

    /**
     * @method setInitialState
     * @description Sets the inital state of the sticky nav when loaded
     * Determines whether initial view should be collapsed modal/dropdown view
     * Sets min-height of nav based off container
     */
    setInitialState() {
        if (this.stickyNavStateIsDropdown()) {
            this.stickyNavContainer.setAttribute(this.options.stickyNavState, 'collapsed');
        }

        this.element.style.minHeight = `${dimensions.getHeight(this.stickyNavContainer)}px`;
    }

    /**
     * @method checkforLoadedAnchor
     * @description check is any anchor is in the loaded url, then check if it is
     * a valid element and click it in order to trigger the scrollToPosition in
     * the related NavItem/ScrollToButton
     */
    checkforLoadedAnchor() {
        const { hash } = `#${ESAPI.encoder().encodeForURL(window.location).split('%23')[1]}`;

        if (hash) {
            this.emulateHashNavigation(hash);
        }
    }

    /**
     * @method emulateHashNavigation
     * @description Emulate the hash Navigation based on a given hash
     */
    emulateHashNavigation(hash) {
        const relatedScrollButton = [].slice.call(this.scrollToButtons)
            .filter(s => s.scrollId === hash)
            .pop();

        if (relatedScrollButton) {
            relatedScrollButton.emulateClick();
        } else {
            window.location.hash = hash;
        }
    }

    /**
     * @method getStickyNavOffset
     * @description Returns offset for sticky nav
     * Height of sticky nav minus offset option value
     */
    getStickyNavOffset() {
        return dimensions.getHeight(this.element) - this.options.offset;
    }

    /**
     * @method getMaxItemCount
     * @description Returns the max items allowed in 'row' view
     * before changing to drop down in large/x-large
     */
    getMaxItemCount() {
        return (this.currentScreenState.xlarge)
            ? PROPS.MAX_ITEMS_DESKTOP : PROPS.MAX_ITEMS_TABLET;
    }

    /**
     * @method onScreenResize()
     * @description Handles screen resize events
     * Changes view/state of sticky nav if necessary
     */
    onScreenResize(newScreenState) {
        if (newScreenState !== this.currentScreenState) {
            const PREV_SCREEN_STATE = this.currentScreenState;
            this.currentScreenState = newScreenState;

            // if prevScreenState was mobile and the nav was expanded,
            // we need to move it back into the sticky nav markup flow
            // and remove no-scroll on the body
            if (PREV_SCREEN_STATE.small && isNavExpanded) {
                this.element.insertAdjacentElement('afterbegin', this.stickyNavContainer);
                document.body.classList.remove(CLASSES.NO_SCROLL);
            }

            // if the new state requires a modal/drop-down
            if (this.stickyNavStateIsDropdown()) {
                const REMOVE_ACTIVE_CLASS = (navItem) => {
                    navItem.parentNode.classList.remove(CLASSES.ACTIVE);
                    return navItem;
                };
                [].slice.call(this.stickyNavLinks).map(REMOVE_ACTIVE_CLASS);

                // reset active class to the first non-excluded section on the page
                if (this.currentScreenState.small) {
                    this.firstActiveSectionIndex = 0;
                } else {
                    [].slice.call(this.stickyNavLinks).map((link, linkIndex) => {
                        if (link.parentNode === document.querySelectorAll(`.${CLASSES.STICKY_NAV_ITEM}:not(.hide-large)`)[1]) {
                            this.firstActiveSectionIndex = linkIndex;
                        }
                        return link;
                    });
                }

                const ACTIVE_SECTION_LINK = this.stickyNavLinks[this.firstActiveSectionIndex];
                ACTIVE_SECTION_LINK.parentNode.classList.add(CLASSES.ACTIVE);

                this.stickyNavContainer.setAttribute(this.options.stickyNavState, 'collapsed');

                if (this.currentScreenState.small && isNavExpanded) {
                    document.body.classList.add(CLASSES.NO_SCROLL);
                    document.body.insertAdjacentElement('afterbegin', this.stickyNavContainer);
                }
                // if we are switching between tablet and desktop and the nav is expanded,
                // we don't need to update the min-height
                if (!(PREV_SCREEN_STATE.large && this.currentScreenState.xlarge && isNavExpanded ||
                    PREV_SCREEN_STATE.xlarge && this.currentScreenState.large && isNavExpanded)) {
                    this.element.style.minHeight = `${dimensions.getHeight(this.stickyNavContainer)}px`;
                }
                if (isNavExpanded) {
                    this.stickyNavContainer.setAttribute(this.options.stickyNavState, 'expanded');
                }
            } else {
                this.stickyNavContainer.removeAttribute(this.options.stickyNavState);
                this.element.style.minHeight = `${dimensions.getHeight(this.stickyNavContainer)}px`;
                isNavExpanded = false;
            }

            this.triggerWaypointRefresh();
        }
    }

    /**
     * @method stickyNavTriggerHandler
     * @description Handles the sticky nac Trigger, and
     * emulate the HashNavigation
     */
    stickyNavTriggerHandler(e) {
        console.log(e);
        this.emulateHashNavigation(e.detail.hash);
    }

    /**
     * @method stickyNavToggleHandler
     * @description Handles opening/closing the modal and drop down
     * Resets the active class
     * Toggles the expanded state of the sticky nav
     * Updates attribute for sticky nav state on sticky nav container
     * Adds/Removes no-scroll class on body to prevent scrolling
     */
    stickyNavToggleHandler(e) {
        if (this.stickyNavStateIsDropdown()) {
            e.preventDefault();

            if (e.target.classList.contains(CLASSES.STICKY_NAV_LINKS)
                && !e.target.parentNode.classList.contains(CLASSES.ACTIVE)) {
                Array.prototype.forEach.call(this.stickyNavLinks, (stickyNavLink) => {
                    stickyNavLink.parentNode.classList.remove(CLASSES.ACTIVE);
                });
                e.target.parentNode.classList.add(CLASSES.ACTIVE);
            }

            // adjustments to sticky nav to display as needed
            if (!this.currentScreenState.small) {
                this.stickyNavContainer.setAttribute(this.options.stickyNavState,
                    isNavExpanded ? 'collapsed' : 'expanded');
            } else {
                document.body.classList[isNavExpanded ? 'remove' : 'add'](CLASSES.NO_SCROLL);
                const TARGET_ELEMENT = isNavExpanded ? this.element : document.body;
                TARGET_ELEMENT.insertAdjacentElement('afterbegin', this.stickyNavContainer);
            }

            isNavExpanded = !isNavExpanded;
        }
        return this;
    }

    /**
     * @method stickyNavOutsideClickHandler
     * @description Callback for handling clicks outside of sticky nav
     * Closes the sticky nav on mobile if expanded
     * Update attribute for sticky nav state on sticky nav container
     * Removes no-scroll class on body to enable scrolling
     */
    stickyNavOutsideClickHandler() {
        if (this.stickyNavStateIsDropdown() && isNavExpanded) {
            this.stickyNavContainer.setAttribute(this.options.stickyNavState, 'collapsed');

            if (this.currentScreenState.small) {
                document.body.classList.remove(CLASSES.NO_SCROLL);
                this.element.insertAdjacentElement('afterbegin', this.stickyNavContainer);
            }

            isNavExpanded = false;
        }
    }

    /**
     * @method triggerWaypointRefresh
     * @description Checks page to see what the current section at the top is
     * Triggers an update on the sticky nav so the proper section label in nav is set to active
     */
    triggerWaypointRefresh() {
        const ACTIVE_SECTION = [].slice.call(this.waypointSections)
            .filter(waypoint => (isScrolledToTop(waypoint, this.getStickyNavOffset())))
            .sort((a, b) => (
                a.getBoundingClientRect().top - b.getBoundingClientRect().top
            ))
            .pop();
        if (ACTIVE_SECTION) {
            this.waypointCallback(ACTIVE_SECTION);
        }
    }

    /**
     * @method waypointCallback
     * @description Callback for waypoint
     * Adds active class to current waypoint's associated nav item
     */
    waypointCallback(waypointSection) {
        const REMOVE_ACTIVE_CLASS = (navItem) => {
            navItem.parentNode.classList.remove(CLASSES.ACTIVE);
            return navItem;
        };
        const FILTER_DEEP_LINKED_ITEM = navItem => (
            decodeURIComponent(navItem.hash.replace('#', '')) === waypointSection.dataset.waypoint
        );
        const ADD_ACTIVE_CLASS = (navItem) => {
            const IS_EXCLUDED_SECTION = !this.currentScreenState.small && navItem.parentNode.classList.contains('hide-large');
            if (IS_EXCLUDED_SECTION) {
                // loop through all the sections and find the section that can be made active
                // and is prior to this section
                let section = navItem.parentNode.parentNode.firstChild;
                let sectionToMakeActive = null;
                for (; section !== navItem.parentNode; section = section.nextSibling) {
                    if (section.nodeType === 1 && !section.classList.contains('hide-large')) {
                        sectionToMakeActive = section;
                    }
                }

                let sectionToMakeActiveIndex = 0;
                // get index of section to make active
                [].slice.call(this.stickyNavLinks).map((link, linkIndex) => {
                    if (link.parentNode === sectionToMakeActive) {
                        sectionToMakeActiveIndex = linkIndex;
                    }
                    return link;
                });

                // if this section is before the first non-excluded section
                if (sectionToMakeActiveIndex < this.firstActiveSectionIndex) {
                    if (this.numVisibleSections > this.getMaxItemCount()) {
                        const FIRST_ACTIVE_SECTION = this.firstActiveSectionIndex;
                        const ACTIVE_SECTION_LINK = this.stickyNavLinks[FIRST_ACTIVE_SECTION];
                        ACTIVE_SECTION_LINK.parentNode.classList.add(CLASSES.ACTIVE);
                    } else {
                        navItem.parentNode.classList.add(CLASSES.ACTIVE);
                    }
                } else {
                    sectionToMakeActive.classList.add(CLASSES.ACTIVE);
                }
            } else {
                navItem.parentNode.classList.add(CLASSES.ACTIVE);
            }
            return navItem;
        };

        [].slice.call(this.stickyNavLinks)
            .map(REMOVE_ACTIVE_CLASS)
            .filter(FILTER_DEEP_LINKED_ITEM)
            .map(ADD_ACTIVE_CLASS);
    }
}
