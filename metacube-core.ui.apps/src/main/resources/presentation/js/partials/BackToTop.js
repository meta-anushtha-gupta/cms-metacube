import { EVENTS } from 'Constants';
import { debounce, scrollTo, isScrolledIntoView } from 'utils';
// CSS class definintions
const CLASSES = {
    CTA: 'back-to-top__cta',
    ENABLED: 'back-to-top--enabled',
    STICKY: 'back-to-top--sticky'
};

const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
let scrollTop = 0;
export default class BackToTop {
    constructor(element) {
        this.element = element;
        this.backToTopBtn = null;
        this.footer = null;

        this.init();
    }

    init() {
        this.cacheDOM();
        this.attachEventListeners();
    }

    cacheDOM() {
        this.backToTopBtn = this.element.querySelector(`.${CLASSES.CTA}`);
        this.footer = document.querySelector('footer');
    }

    attachEventListeners() {
        window.addEventListener(EVENTS.SCROLL, debounce(this.onScroll.bind(this), 10));
        this.backToTopBtn.addEventListener(EVENTS.CLICK, this.onClick.bind(this));
    }

    /**
     * Scroll handler
     * Adds enabled and sticky classes based on scroll position
     */
    onScroll() {
        scrollTop = window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;

        this.element.classList[(scrollTop > 0.3 * viewportHeight) ? 'add' : 'remove'](CLASSES.ENABLED);
        this.element.classList[isScrolledIntoView(this.footer) ? 'add' : 'remove'](CLASSES.STICKY);
    }

    /**
     * Click handler
     * Scrolls the page to top on the click of back to top CTA
     */
    onClick(event) {
        event.preventDefault();
        if (!document.querySelector('nav[data-load-module="DogStickyNav"]')) {
            scrollTo(0);
        } else {
            window.scrollTo(0, 0);
        }
        return this;
    }
}
