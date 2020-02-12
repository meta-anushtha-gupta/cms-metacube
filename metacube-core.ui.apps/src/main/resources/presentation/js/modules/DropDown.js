import { EVENTS, CLASSES } from 'Constants';

export default class DropDown {
    constructor(element) {
        this.element = element;
        this.init();
        this.list = null;
        this.button = null;
    }

    init() {
        this.cacheDOMElement();
        this.attachEvents();
    }

    cacheDOMElement() {
        this.list = document.getElementsByClassName(`${CLASSES.DROPDOWN__CONTENT}`);
        this.button = document.getElementsByClassName(`${CLASSES.DROPDOWN__BUTTON}`);
    }

    attachEvents() {
        const contentList = this.list;
        const buttonList = this.button;
        let targetElement;
        window.addEventListener(EVENTS.CLICK, (e) => {
            if (e.target.matches(`.${CLASSES.DROPDOWN__BUTTON}`) || e.target.matches(`.${CLASSES.DROPDOWN__STARICON}`) || e.target.matches(`.${CLASSES.DROPDOWN__CARETICON}`) || e.target.matches(`.${CLASSES.DROPDOWN__PRINTICON}`)) {
                if (e.target.matches(`.${CLASSES.DROPDOWN__BUTTON}`)) {
                    targetElement = e.target;
                } else {
                    targetElement = e.target.parentNode;
                }
                this.contentDisplay(targetElement, contentList, buttonList);
            } else {
                const dropdowns = document.getElementsByClassName(`${CLASSES.DROPDOWN__CONTENT}`);
                [].forEach.call(buttonList, (element) => {
                    element.classList.remove(`${CLASSES.DROPDOWN__ACTIVE}`);
                });
                [].forEach.call(dropdowns, (element) => {
                    const openDropdown = element;
                    if (openDropdown.classList.contains(`${CLASSES.DROPDOWN__SHOW}`)) {
                        openDropdown.classList.remove(`${CLASSES.DROPDOWN__SHOW}`);
                    }
                });
            }
        });
    }

    contentDisplay(targetElement, contentList, buttonList) {
        console.log(this);
        let flag = 0;
        if (targetElement.classList.contains(`${CLASSES.DROPDOWN__ACTIVE}`)) {
            targetElement.classList.remove(`${CLASSES.DROPDOWN__ACTIVE}`);
        } else {
            [].forEach.call(buttonList, (element) => {
                element.classList.remove(`${CLASSES.DROPDOWN__ACTIVE}`);
            });
            targetElement.classList.add(`${CLASSES.DROPDOWN__ACTIVE}`);
        }
        // targetElement.classList.toggle(`${CLASSES.DROPDOWN__ACTIVE}`);
        targetElement.nextElementSibling.classList.toggle(`${CLASSES.DROPDOWN__SHOW}`);
        [].forEach.call(contentList, (content) => {
            if (content.classList.contains(`${CLASSES.DROPDOWN__SHOW}`)) {
                flag += 1;
            }
        });
        if (flag > 1) {
            [].forEach.call(contentList, (content) => {
                content.classList.remove(`${CLASSES.DROPDOWN__SHOW}`);
            });
            targetElement.nextElementSibling.classList.toggle(`${CLASSES.DROPDOWN__SHOW}`);
            flag = 0;
        }
    }
}
