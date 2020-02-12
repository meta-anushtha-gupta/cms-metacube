/**
 * Footer Module
 * Has methods related to composition of the footer module
 */
import Validation from 'modules/Validation';
// import { accordionParser } from 'partials/accordion';
// import { Disclaimer } from 'partials/disclaimer';
import { EVENTS } from 'Constants';

const CLASSES = {
    POPUP_LINKS: 'legal__link--popup'
};

/**
 * @function
 * @name legalLinkClickHandler
 * @description Click handler for legal links in footer
 * @param {Object} event - Event object from event attach
 */
const legalLinkClickHandler = (event) => {
    event.preventDefault();
    window.open(event.target.href, event.target.innerText, 'left=20,top=20,toolbars=0,scrollbars=1,location=0,statusbars=0,menubars=1,resizable=0,width=440,height=550');
};

export default class Footer {
    constructor(element) {
        this.element = element;
        this.init();
    }

    /**
     * Transforms the footer DOM nodes into the one required by accordion
     */
    init() {
        this.loadModules();
        this.cacheDOM();
        this.attachEvents();
        this.stickFooterToBottom();
    }

    loadModules() {
        this.Validation = new Validation(this.element);
    }

    /**
     * Cache DOM
     */
    cacheDOM() {
        this.legalLinks = [].slice.call(this.element.querySelectorAll(`.${CLASSES.POPUP_LINKS}`));
    }

    /**
     * Attach event listeners
     */
    attachEvents() {
        this.legalLinks.map((legalLink) => {
            legalLink.addEventListener(EVENTS.CLICK, legalLinkClickHandler.bind(this));
            return legalLink;
        });

        window.addEventListener(EVENTS.RESIZE, () => {
            this.stickFooterToBottom();
        });
    }

    stickFooterToBottom() {
        console.log(this);
        const footerList = document.querySelectorAll('footer');
        if (footerList && footerList.length) {
            const paddingBottom = footerList[footerList.length - 1].offsetHeight;
            document.body.style.paddingBottom = `${paddingBottom}px`;
        }
    }
}
