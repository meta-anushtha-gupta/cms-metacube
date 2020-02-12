import { EVENTS } from 'Constants';
import Ajax from '../modules/Ajax';

const CLASSES = {
    TAB_WRAPPER: 'training-courses-wrapper',
    TAB: 'training-courses-tab',
    TABS: 'training-courses__tabs',
    TAB_ITEM: 'tab__item',
    TAB_LINK: 'tab-link',
    TAB_LINK_ACTIVE: 'tab-link--active',
    HIDDEN: 'hidden'
};

export default class TabContainer {
    constructor(element) {
        this.element = element;
        this.tabList = [];
        this.init();
    }
    init() {
        this.cacheDOMElement();
        this.loadModules();
        this.loadTabs();
        this.attachEvents();
    }
    cacheDOMElement() {
        this.tabs = document.querySelector(`.${CLASSES.TABS}`);
    }

    loadModules() {
        this.Ajax = new Ajax(this.element);
    }

    loadTabs() {
        const tab = Array.from(document.querySelectorAll(`.${CLASSES.TAB_WRAPPER}`));
        tab.forEach((currentTab) => {
            const tabKey = currentTab.getAttribute('id');
            const tabValue = currentTab.firstElementChild.innerHTML.trim();
            this.tabList.push({ key: tabKey, value: tabValue });
            document.querySelector(`.${CLASSES.TAB_WRAPPER}#${tabKey}`).classList.add(`${CLASSES.HIDDEN}`);
            this.tabs.innerHTML += `<li class="${CLASSES.TAB_ITEM}"><a href="#${tabKey}" class="${CLASSES.TAB_LINK}">${tabValue}</a></li>`;
        });

        // Show 1st tab content initially
        this.toggleTabs(this.tabList[0].key);
    }

    toggleTabs(selectedTab) {
        this.tabList.forEach((tab) => {
            document.querySelector(`.${CLASSES.TAB_LINK}[href="#${tab.key}"]`).classList.remove(`${CLASSES.TAB_LINK_ACTIVE}`);
            document.querySelector(`.${CLASSES.TAB_WRAPPER}#${tab.key}`).classList.add(`${CLASSES.HIDDEN}`);
        });
        document.querySelector(`.${CLASSES.TAB_LINK}[href="#${selectedTab}"]`).classList.add(`${CLASSES.TAB_LINK_ACTIVE}`);
        document.querySelector(`.${CLASSES.TAB_WRAPPER}#${selectedTab}`).classList.remove(`${CLASSES.HIDDEN}`);
    }

    attachEvents() {
        console.log('attachEvents: ', this);
        document.addEventListener(EVENTS.CLICK, (e) => {
            if (e.target.matches(`.${CLASSES.TAB_LINK}`)) {
                e.preventDefault();
                const tabLink = e.target.href.split('#')[1];
                this.toggleTabs(tabLink);
            }
        });
    }
}
