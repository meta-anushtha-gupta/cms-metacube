import { EVENTS } from 'Constants';

const CLASSES = {
    BUTTONLINKLIST__ITEM: 'button-link-list__item',
    BUTTONLINKLIST__ACTIVE: 'button-link-list__active',
    FILTEREDLIST__LIST: 'filtered-list__list',
    FILTEREDLIST__LIST_OPEN: 'filtered-list__list--open',
    FILTEREDLIST__LIST_ACTIVE: 'filtered-list__list--active',
    FILTEREDLIST__LIST_DESC: 'filtered-list__list-desc',
    WARRANTY__CATEGORIES: 'warranty-categories',
    ICON: 'icon-mc'
};

export default class FilteredList {
    constructor(element) {
        this.element = element;
        this.init();
        this.list = null;
    }

    init() {
        this.cacheDOMElement();
        this.attachEvents();
    }

    cacheDOMElement() {
        this.list = document.getElementsByClassName(`${CLASSES.FILTEREDLIST__LIST}`);
        this.anchorList = document.getElementsByClassName(`${CLASSES.FILTEREDLIST__LIST_DESC}`);
        this.tabContainer = document.querySelector(`.${CLASSES.WARRANTY__CATEGORIES}`);
    }

    attachEvents() {
        const listItems = this.list;
        const url = location.href;
        const path = url.split('//')[1];

        [].forEach.call(this.anchorList, (el) => {
            const reference = el.parentElement.previousElementSibling.value;

            if (path.indexOf(reference) >= 0) {
                this.filteredListAccordion(el.parentElement.parentElement, listItems);
                this.filteredListActive(el.parentElement, listItems);
            }
        });

        document.addEventListener(EVENTS.CLICK, (e) => {
            if (e.target.matches(`.${CLASSES.ICON}`)) {
                const currentElement = e.target.parentElement;
                this.iconClickFn(currentElement.parentElement);
            }
        });
    }

    filteredListActive(e, listItems) {
        console.log(this);
        let parentLink = e.parentNode.parentNode.previousElementSibling;
        let levelCount = 0;

        while (parentLink != null) {
            levelCount += 1;
            parentLink = parentLink.parentNode.parentNode.previousElementSibling;
        }

        parentLink = e.parentNode.parentNode.previousElementSibling;

        for (levelCount; levelCount > 0; levelCount -= 1) {
            parentLink.parentElement.classList.add(`${CLASSES.FILTEREDLIST__LIST_OPEN}`);
            parentLink = parentLink.parentNode.parentNode.previousElementSibling;
        }

        const flag = e.parentElement.classList.contains(`${CLASSES.FILTEREDLIST__LIST_ACTIVE}`);

        [].forEach.call(listItems, (element) => {
            element.classList.remove(`${CLASSES.FILTEREDLIST__LIST_ACTIVE}`);
        });

        if (!flag) {
            e.parentElement.classList.add(`${CLASSES.FILTEREDLIST__LIST_ACTIVE}`);
        }
    }

    filteredListAccordion(el, listItems) {
        console.log(this);
        const flag = el.classList.contains(`${CLASSES.FILTEREDLIST__LIST_OPEN}`);

        [].forEach.call(listItems, (element) => {
            element.classList.remove(`${CLASSES.FILTEREDLIST__LIST_OPEN}`);
        });

        if (!flag) {
            el.classList.add(`${CLASSES.FILTEREDLIST__LIST_OPEN}`);
        }
    }

    iconClickFn(el) {
        console.log(this);
        const flag = el.classList.contains(`${CLASSES.FILTEREDLIST__LIST_OPEN}`);

        if (!flag) {
            el.classList.add(`${CLASSES.FILTEREDLIST__LIST_OPEN}`);
        } else {
            el.classList.remove(`${CLASSES.FILTEREDLIST__LIST_OPEN}`);
        }
    }
}
