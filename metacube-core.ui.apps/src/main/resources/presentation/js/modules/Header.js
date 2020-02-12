import { EVENTS, CLASSES, ATTRIBUTES } from 'Constants';

export default class Header {
    constructor(element) {
        this.element = element;
        this.menuLink = null;
        this.body = null;
        this.init();
    }

    init() {
        this.cacheDOMElement();
        this.attachEvents();
    }

    cacheDOMElement() {
        this.menuLinks = document.querySelectorAll(`.${CLASSES.TOPNAV__LINK_MENU}, .${CLASSES.TOPNAV__LINK_CATEGORY}`);
        this.parentLink = document.querySelectorAll(`.${CLASSES.CUSTOM_TOP_NAV__LINK_PARENT}`);
        this.navSearch = document.querySelector(`.${CLASSES.SUBNAV__SEARCH}`);
        this.navSearchSubmitButton = document.querySelector(`.${CLASSES.SUBNAV__FORM_BTN}`);
        this.searchField = document.querySelector('#search-box');
    }

    attachEvents() {
        [].forEach.call(this.menuLinks, (el) => {
            el.addEventListener(EVENTS.CLICK, () => {
                this.changeSubMenuState(el, this.menuLinks);
            });
        });
        [].forEach.call(this.parentLink, (el) => {
            el.addEventListener(EVENTS.CLICK, () => {
                this.changeSubMenuState(el, this.parentLink);
            });
        });

        if (this.searchField) {
            this.displayLogout();
        }

        document.addEventListener(EVENTS.CLICK, (e) => {
            if (this.navSearch !== null) {
                if ((e.target.matches(`.${CLASSES.SUBNAV__ICON_SEARCH}`) && !(e.target.parentNode.parentNode.matches(`.${CLASSES.SUBNAV__SEARCH_OPEN}`))) || e.target.matches(`.${CLASSES.SUBNAV__FORM_INPUT}`)) {
                    this.navSearch.classList.add(`${CLASSES.SUBNAV__SEARCH_OPEN}`);
                } else if (e.target.matches(`.${CLASSES.SUBNAV__ICON_SEARCH}`) && e.target.parentNode.parentNode.matches(`.${CLASSES.SUBNAV__SEARCH_OPEN}`)) {
                    if (e.target.previousElementSibling.previousElementSibling.value !== '') {
                        this.navSearchSubmitButton.click();
                    }
                    this.navSearch.classList.add(`${CLASSES.SUBNAV__SEARCH_OPEN}`);
                } else {
                    this.navSearch.classList.remove(`${CLASSES.SUBNAV__SEARCH_OPEN}`);
                }
            }
            const body = document.querySelector(`${CLASSES.BODY}`);
            const dropDown = document.querySelector(`.${CLASSES.TOPNAV__DROPDOWN}`);
            if (e.target.matches(`.${CLASSES.TOPNAV__HAMBURGER}`) || e.target.matches(`.${CLASSES.TOPNAV__HAMBURGER_LINE}`)) {
                const menuLink = dropDown.querySelector(`.${CLASSES.TOPNAV__LINK_PARENT}`);
                if (dropDown.matches(`.${CLASSES.TOPNAV__DROPDOWN_OPEN}`)) {
                    dropDown.classList.remove(`${CLASSES.TOPNAV__DROPDOWN_OPEN}`);
                    menuLink.setAttribute(`${ATTRIBUTES.DATA_OPEN}`, 'false');
                    body.removeAttribute(`${ATTRIBUTES.DATA_SUBMENU_STATE}`);
                } else {
                    dropDown.classList.add(`${CLASSES.TOPNAV__DROPDOWN_OPEN}`);
                    if (dropDown.matches(`.${CLASSES.TOPNAV__DROPDOWN_SINGLE}`)) {
                        menuLink.setAttribute(`${ATTRIBUTES.DATA_OPEN}`, 'true');
                        body.setAttribute(`${ATTRIBUTES.DATA_SUBMENU_STATE}`, 'open');
                    }
                }
            }

            if (e.target.matches(`.${CLASSES.MENU_TOGGLE__HANBURGER_LINE}`) || e.target.matches(`.${CLASSES.MENU_TOGGLE__HAMBURGER}`) || e.target.matches(`.${CLASSES.MENU_TOGGLE__CTA}`)) {
                const navState = body.getAttribute(`${ATTRIBUTES.DATA_MENU_STATE}`);
                if (navState === 'open') {
                    body.removeAttribute(`${ATTRIBUTES.DATA_MENU_STATE}`);
                } else {
                    body.setAttribute(`${ATTRIBUTES.DATA_MENU_STATE}`, 'open');
                }
            }

            if ((e.target.matches(`.${CLASSES.WRAPPER}`) || e.target.matches(`.${CLASSES.MENU_TOGGLE__LOGO_IMG}`) || e.target.matches(`.${CLASSES.MENU_TOGGLE}`) || e.target.matches(`.${CLASSES.HEADER_CLICK_BLOCKER}`))) {
                body.removeAttribute(`${ATTRIBUTES.DATA_MENU_STATE}`);
            }
            if (!((e.target.matches(`.${CLASSES.TOPNAV__HAMBURGER}`) || e.target.matches(`.${CLASSES.TOPNAV__HAMBURGER_LINE}`) || e.target.matches(`.${CLASSES.TOPNAV__LINK_CATEGORY}`) || e.target.matches(`.${CLASSES.TOPNAV__LINK_MENU}`) || e.target.matches(`.${CLASSES.TOPNAV__LABEL}`))) && !body.matches(`.${CLASSES.CUSTOM_WEBSITES}`)) {
                this.menuClose(this.menuLinks);
                dropDown.classList.remove(`${CLASSES.TOPNAV__DROPDOWN_OPEN}`);
            }

            if (!(e.target.matches(`.${CLASSES.CUSTOM_TOP_NAV__LINK}`)) && body.matches(`.${CLASSES.CUSTOM_WEBSITES}`)) {
                this.parentLink = document.querySelectorAll(`.${CLASSES.CUSTOM_TOP_NAV__LINK_PARENT}`);
                if (!(e.target.matches(`.${CLASSES.CUSTOM_TOP_NAV__CONTAINER}`)) && body.matches(`.${CLASSES.DOG}`)) {
                    this.menuClose(this.parentLink);
                } else {
                    this.menuClose(this.parentLink);
                }
            }
        });
    }

    changeSubMenuState(element, links) {
        const body = document.querySelector(`${CLASSES.BODY}`);
        const navState = body.getAttribute(`${ATTRIBUTES.DATA_SUBMENU_STATE}`);
        if (navState === 'open') {
            const elementState = element.getAttribute(`${ATTRIBUTES.DATA_OPEN}`);
            this.menuClose(links);
            body.removeAttribute(`${ATTRIBUTES.DATA_SUBMENU_STATE}`);
            element.setAttribute(`${ATTRIBUTES.DATA_OPEN}`, 'false');
            if (elementState === 'false') {
                this.changeSubMenuState(element, links);
            }
        } else {
            this.menuClose(links);
            body.setAttribute(`${ATTRIBUTES.DATA_SUBMENU_STATE}`, 'open');
            element.setAttribute(`${ATTRIBUTES.DATA_OPEN}`, 'true');
        }
    }

   // Function to show/hide logout button and update the styling of containing container
    displayLogout() {
        const logOutContainers = document.querySelectorAll(`.${CLASSES.CUSTOM_SUB_NAV__LOGOUT}`);
        const topNavLevel = document.querySelector(`.${CLASSES.CUSTOM_TOP_NAV__LEVEL}`);
        const rightLevelContainer = document.querySelector(`.${CLASSES.CUSTOM_SUB_NAV__LEVEL_RIGHT}`);

        // check user is logged in and the page accessed is of mb collision center website.
        if (document.cookie.indexOf('accessToken') >= 0) {
            [].forEach.call(logOutContainers, (logOutContainer) => {
                logOutContainer.classList.remove(`${CLASSES.HIDE_CONTAINER}`);
            });
            rightLevelContainer.classList.remove(`${CLASSES.HIDE_CONTAINER}`);
            if (!(this.searchField.value === 'true')) {
                topNavLevel.classList.add(`${CLASSES.CUSTOM_TOP_NAV__LEVEL_LOGOUT_ONLY}`);
            }
        } else {
            [].forEach.call(logOutContainers, (logOutContainer) => {
                logOutContainer.classList.add(`${CLASSES.HIDE_CONTAINER}`);
            });

            if (this.searchField.value === 'true') {
                rightLevelContainer.classList.remove(`${CLASSES.HIDE_CONTAINER}`);
                topNavLevel.classList.add(`${CLASSES.CUSTOM_TOP_NAV__LEVEL_SEARCH_ONLY}`);
            } else {
                rightLevelContainer.classList.add(`${CLASSES.HIDE_CONTAINER}`);
                topNavLevel.classList.add(`${CLASSES.CUSTOM_TOP_NAV__LEVEL_FULL_WIDTH}`);
            }
        }
    }

    menuClose(links) {
        [].forEach.call(links, (el) => {
            el.setAttribute(`${ATTRIBUTES.DATA_OPEN}`, 'false');
            this.body = document.querySelector(`${CLASSES.BODY}`);
            this.body.removeAttribute(`${ATTRIBUTES.DATA_SUBMENU_STATE}`);
        });
    }
}
