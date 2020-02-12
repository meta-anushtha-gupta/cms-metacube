import { EVENTS } from 'Constants';

/**
 * @class ClickOutside
 * @description Utility class for creating an event listener on a dom element
 * for click outside events and applying callbacks
 * @constructor this.onBlur defined for proper .bind(this) reference for
 * adding/removing event listener
 */
class ClickOutside {
    constructor(element, focusCallback, blurCallback, ignoreElem) {
        this.element = element;
        this.focusCallback = focusCallback;
        this.blurCallback = blurCallback;
        this.ignoreElem = ignoreElem;

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);

        // Filter out all the script tags and store the root level elements in the document
        this.docElms = [];
        Array.prototype.slice.call(document.body.children).filter(docElms =>
            (docElms.tagName.toLowerCase() !== 'script'))
        .forEach((docElms) => {
            this.docElms.push(docElms);
        });

        this.init();
    }

    attachEvents() {
        this.element.addEventListener(EVENTS.CLICK, this.onFocus);
    }

    detachEvents() {
        this.element.removeEventListener(EVENTS.CLICK, this.onFocus);

        this.docElms.forEach((elm) => {
            elm.removeEventListener(EVENTS.CLICK, this.onBlur, false);
        });
    }

    destroy() {
        this.detachEvents();
    }

    onFocus(e) {
        this.focusCallback(e);
        this.docElms.forEach((elm) => {
            elm.addEventListener(EVENTS.CLICK, this.onBlur, false);
        });
    }

    onBlur(e) {
        // if e.target is outside of this.element
        if (this.element.parentNode.contains(e.target) ||
            (this.ignoreElem && this.ignoreElem.contains(e.target))) {
            return false;
        }
        this.blurCallback(this.element);
        this.docElms.forEach((elm) => {
            elm.removeEventListener(EVENTS.CLICK, this.onBlur, false);
        });

        return true;
    }

    init() {
        this.attachEvents();
    }
}

export default ClickOutside;
