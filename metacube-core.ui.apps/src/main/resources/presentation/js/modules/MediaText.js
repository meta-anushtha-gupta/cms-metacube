import { EVENTS } from 'Constants';

const CLASSES = {
    CAROUSEL_SLIDES: 'media-text__carousel-slides',
    CAROUSEL_SLIDE: 'media-text__carousel-slide',
    CAROUSEL_SLIDE__ACTIVE: 'media-text__carousel-slide--active',
    CAROUSEL_NAV_BUTTON: 'media-text__carousel-nav-button',
    CAROUSEL_NAV_BUTTON__INACTIVE: 'media-text__carousel-nav-button--inactive',
    CAROUSEL_NAV_BUTTON__PREV: 'media-text__carousel-nav-button--prev',
    CAROUSEL_NAV_BUTTON__NEXT: 'media-text__carousel-nav-button--next',
    CAROUSEL_JS_LOADED: 'media-text__carousel-js-loaded'
};

export default class MediaText {
    constructor(element) {
        this.element = element;
        this.init();
        this.checkCarousel();
        this.currentActiveIndex = null;
        this.totalLength = null;
    }

    init() {
        this.cacheDOMElement();
        this.attachEvents();
    }

    cacheDOMElement() {
        this.carouselSlides = this.element.querySelector(`.${CLASSES.CAROUSEL_SLIDES}`);
        this.carouselSlide = this.element.querySelectorAll(`.${CLASSES.CAROUSEL_SLIDE}`);
        this.carouselNavButtons = this.element.querySelectorAll(`.${CLASSES.CAROUSEL_NAV_BUTTON}`);
        this.carouselNavPrev = this.element.querySelector(`.${CLASSES.CAROUSEL_NAV_BUTTON__PREV}`);
        this.carouselNavNext = this.element.querySelector(`.${CLASSES.CAROUSEL_NAV_BUTTON__NEXT}`);
    }

    attachEvents() {
        if (this.carouselNavPrev) {
            this.carouselNavPrev.addEventListener(EVENTS.CLICK, () => {
                const prevElement = this.element.querySelector(`.${CLASSES.CAROUSEL_SLIDE__ACTIVE}`).previousElementSibling;

                if (prevElement !== null) {
                    this.removeActiveSlide();
                    prevElement.classList.add(`${CLASSES.CAROUSEL_SLIDE__ACTIVE}`);
                    this.carouselActiveIndex();
                    this.carouselPages();
                    this.carouselNavButtonsFn();
                }
            });
        }

        if (this.carouselNavNext) {
            this.carouselNavNext.addEventListener(EVENTS.CLICK, () => {
                const nextElement = this.element.querySelector(`.${CLASSES.CAROUSEL_SLIDE__ACTIVE}`).nextElementSibling;

                if (nextElement !== null) {
                    this.removeActiveSlide();
                    nextElement.classList.add(`${CLASSES.CAROUSEL_SLIDE__ACTIVE}`);
                    this.carouselActiveIndex();
                    this.carouselPages();
                    this.carouselNavButtonsFn();
                }
            });
        }
    }

    checkCarousel() {
        if (this.carouselSlide.length) {
            this.carouselSlide[0].classList.add(`${CLASSES.CAROUSEL_SLIDE__ACTIVE}`);
            this.carouselSlides.classList.add(`${CLASSES.CAROUSEL_JS_LOADED}`);

            this.carouselActiveIndex();
            this.carouselPages();
            this.carouselNavButtonsFn();
        }
    }

    carouselActiveIndex() {
        const activeSlide = this.element.querySelector(`.${CLASSES.CAROUSEL_SLIDE__ACTIVE}`);
        const nodes = Array.prototype.slice.call(this.carouselSlide);
        this.currentActiveIndex = nodes.indexOf(activeSlide) + 1;
        this.totalLength = this.carouselSlide.length;
    }

    carouselPages() {
        this.element.querySelector('[data-carousel-page-current]').innerHTML = this.currentActiveIndex;
        this.element.querySelector('[data-carousel-page-total]').innerHTML = this.totalLength;
    }

    carouselNavButtonsFn() {
        [].forEach.call(this.carouselNavButtons, (el) => {
            el.classList.remove(`${CLASSES.CAROUSEL_NAV_BUTTON__INACTIVE}`);
        });

        if (this.currentActiveIndex === 1) {
            this.element.querySelector(`.${CLASSES.CAROUSEL_NAV_BUTTON__PREV}`).classList.add(`${CLASSES.CAROUSEL_NAV_BUTTON__INACTIVE}`);
        }

        if (this.currentActiveIndex === this.totalLength) {
            this.element.querySelector(`.${CLASSES.CAROUSEL_NAV_BUTTON__NEXT}`).classList.add(`${CLASSES.CAROUSEL_NAV_BUTTON__INACTIVE}`);
        }
    }

    removeActiveSlide() {
        [].forEach.call(this.carouselSlide, (el) => {
            el.classList.remove(`${CLASSES.CAROUSEL_SLIDE__ACTIVE}`);
        });
    }
}
