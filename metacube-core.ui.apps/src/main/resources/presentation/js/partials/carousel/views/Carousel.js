// Module dependencies
import { CUSTOM_EVENTS } from 'Constants';
import {
    noop,
    renderer,
    Touch
} from 'utils';

// Local dependencies
import CarouselNavigation from './CarouselNavigation';
import CarouselSlide from './CarouselSlide';
import carouselTemplate from './../templates/carouselTemplate';

/**
 * @const ATTRIBUTES
 * @description Collection of constant values for related data attributes of the module
 * @type {{BUTTONS: string}}
 */
const ATTRIBUTES = {
    SLIDES: 'data-carousel-slides',
    NAVIGATION: 'data-carousel-navigation'
};

/**
 * @cosnt YOUTUBE_VIDEO_ATTR
 * @description Data attr for video ID, will be used to select container for Youtube
 */
const YOUTUBE_VIDEO_ATTR = '[data-video-id]';

/**
 * @cosnt VIDEO_TAG
 * @description Video tag, used to select HTML5 video
 */
const VIDEO_TAG = 'video';

/**
 * @const defaultConfig
 * @description Default configuration options for a Carousel
 * @type {{startIndex: number, type: string, infinite: boolean,
 * indicators: boolean, labels: {next: string, prev: string},
 * theme: string, onSlideCallback: function, navEnabledSmall: boolean}}
 */
const defaultConfig = {
    startIndex: 0,
    type: 'overlay',
    infinite: false,
    indicators: false,
    navEnabledSmall: false,
    labels: {
        prev: 'Previous',
        next: 'Next'
    },
    theme: '',
    onSlideCallback: noop // function to call when active slide changes
};

/**
 * @class Carousel
 * @description View component for displaying a Carousel and managing its state
 */
export default class Carousel {
    constructor(items, config = defaultConfig) {
        // properties
        this.carousel = null; // ref to the carousel element
        this.slideItems = null; // ref to the collection of slide items objects
        this.navigation = null; // ref to the navigation object
        this.currentIndex = 0; // current index of the active slide item
        this.totalSlides = 0; // total number of slide items
        this.slidesContainer = null; // ref to the slides wrapper element
        this.swipeContainer = null; // ref to the swipeable slides container
        this.navigationContainer = null; // ref to navigation element
        this.hasMoreThanOneSlide = items.length > 1;
        this.config = {
            ...defaultConfig,
            ...config
        };
        // alias methods
        this.onNext = this.onNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
        this.dotNavHelper = this.dotNavHelper.bind(this);
        this.setActiveSlide = this.setActiveSlide.bind(this);

        // init carousel
        this.createCarousel();
        this.createSlides(items);
        this.createNavigation();
        this.attachEvents();
        this.render();
    }

    /**
     * @method createCarousel
     * @description Creates a carousel element, sets references to the navigation
     * and slides elements, and creates attaches a Touch utility to the slidesContainer
     */
    createCarousel() {
        this.carousel = renderer.fromTemplate(carouselTemplate());
        this.slidesContainer = this.carousel.querySelector(`[${ATTRIBUTES.SLIDES}]`);
        this.navigationContainer = this.carousel.querySelector(`[${ATTRIBUTES.NAVIGATION}]`);
        this.swipeContainer = new Touch(this.slidesContainer);
        this.setTheme();
    }

    /**
     * @method setTheme
     * @description Sets the css theme of the navigation
     */
    setTheme() {
        if (this.config.theme) {
            this.carousel.classList.add(`carousel--${this.config.theme}`);
        }
    }

    /**
     * @method createSlides
     * @description Iterates a collection of elements to create a CarouselSlide for each,
     * and sets their initial state based on the currentIndex.
     * @param items {Array} Collection of elements to create CarouselSlide from
     */
    createSlides(items) {
        this.currentIndex = this.config.startIndex;
        this.slideItems = items.map(
            (item, index) => new CarouselSlide(item, index === this.currentIndex,
                                    this.config.analyticsKey, this.hasMoreThanOneSlide, index));

        this.totalSlides = this.slideItems.length;
    }

    /**
     * @method createNavigation
     * @description Creates a CarouselNavigation and sets callback for next and previous events
     */
    createNavigation() {
        this.navigation = new CarouselNavigation({
            onNext: this.onNext,
            onPrev: this.onPrev,
            setActiveSlide: this.setActiveSlide.bind(this),
            currentIndex: this.currentIndex,
            totalCount: this.totalSlides,
            infinite: this.config.infinite,
            indicators: this.config.indicators,
            navEnabledSmall: this.config.navEnabledSmall,
            type: this.config.type,
            labels: this.config.labels,
            theme: this.config.theme
        });
    }

    /**
     * @method destroy
     * @description Destroys the carousel by removing all references, detaching events
     * and clearing the carousel element
     */
    destroy() {
        this.detachEvents();
        this.carousel.remove();
        this.slideItems = null;
        this.navigation = null;
        this.carousel = null;
    }

    /**
     * @method attachEvents
     * @description Attaches swipe events and callbacks to the swipeContainer
     */
    attachEvents() {
        this.swipeContainer.on(Touch.EVENTS.SWIPE_RIGHT, this.onNext);
        this.swipeContainer.on(Touch.EVENTS.SWIPE_LEFT, this.onPrev);
    }

    /**
     * @method detachEvents
     * @description Removes swipe events and callbacks from the swipeContainer
     */
    detachEvents() {
        this.swipeContainer.off(Touch.EVENTS.SWIPE_RIGHT, this.onNext);
        this.swipeContainer.off(Touch.EVENTS.SWIPE_LEFT, this.onPrev);
    }

    /**
     * @method onNext
     * @description Determines which slide is next based on the currentIndex then
     * increments and sets the new current slide
     */
    onNext() {
        let nextSlide = this.currentIndex;

        if (this.currentIndex + 1 < this.totalSlides) {
            nextSlide = this.currentIndex + 1;
        } else if (this.config.infinite) {
            nextSlide = 0;
        }

        if (nextSlide !== this.currentIndex) {
            this.setActiveSlide(nextSlide, this.currentIndex);
        }
    }

    /**
     * @method onPrev
     * @description Determines which slide is previous based on the currentIndex then
     * decrements and sets the new current slide
     */
    onPrev() {
        let prevSlide = this.currentIndex;

        if (this.currentIndex - 1 > -1) {
            prevSlide = this.currentIndex - 1;
        } else if (this.config.infinite) {
            prevSlide = this.totalSlides - 1;
        }

        if (prevSlide !== this.currentIndex) {
            this.setActiveSlide(prevSlide, this.currentIndex);
        }
    }

    /**
     * @method dotNavHelper
     * @description call toggleSelectedDot if indicators are enabled
     * @param activeIndex index, next slide index
     */
    dotNavHelper(activeIndex) {
        if (this.config.indicators) {
            this.navigation.toggleDots(activeIndex);
        }
    }

    /**
     * @method setActiveSlide
     * @description Sets the current slide and disables all slide that are inactive
     * @param activeIndex {Number} Index of the slide to set as the active current slide
     * @param prevIndex {Number} Index of the previous active slide to pause youtube video if needed
     */
    setActiveSlide(activeIndex, prevIndex) {
        this.slideItems.forEach((slide, index) => {
            if (index === activeIndex) {
                slide.enable();
            } else {
                slide.disable();
            }
        });
        this.onSlideCallback(activeIndex);
        this.pauseVideo(prevIndex);
        this.playVideo(activeIndex);
        this.navigation.setCurrentPage(activeIndex);
        this.currentIndex = activeIndex;
        this.dotNavHelper(this.currentIndex);
    }

    /**
     * @method pauseVideo
     * @description Checks if a slideItem contains a youtube video and if so
     * it is dispatches an event to pause the video
     * @param slideIndex {Number} Index of the slide to pause
     */
    pauseVideo(slideIndex) {
        const youtubeVideo = this.slideItems[slideIndex].slide.querySelector(`${YOUTUBE_VIDEO_ATTR}`);
        const video = this.slideItems[slideIndex].slide.querySelector(`${VIDEO_TAG}`);

        if (youtubeVideo) {
            const event = new CustomEvent(CUSTOM_EVENTS.PAUSE_YOUTUBE_VIDEO, {
                detail: {
                    videoId: youtubeVideo.dataset.videoId
                }
            });
            window.dispatchEvent(event);
        } else if (video) {
            video.pause();
        }
    }

    /**
     * @method playVideo
     * @description Checks if a slideItem contains a video and has an autoplay attribute;
     * if so calls the play method of the video
     * @param slideIndex {Number} Index of the slide to pause
     */
    playVideo(slideIndex) {
        const video = this.slideItems[slideIndex].slide.querySelector(`${VIDEO_TAG}`);
        const isAutoPlay = video && video.hasAttribute('autoplay');

        if (video && isAutoPlay) {
            video.play();
        }
    }

    /**
     * @method onSlideCallback
     * @description Calls a function to notify the active slide has changed
     * @param activeIndex {Number} Index of the active slide
     */
    onSlideCallback(activeIndex) {
        this.config.onSlideCallback(activeIndex);
    }

    /**
     * @method render
     * @description Renders the slideItems and navigation to the carousel, then renders
     * the carousel to the element reference
     */
    render() {
        [...this.slideItems].forEach(
            slide => this.slidesContainer.appendChild(slide.render())
        );

        this.navigationContainer.appendChild(this.navigation.render());

        // If a carousel's first item has an autoplaying video, the video stops
        // playing once added to DOM because of changes in parent structure while
        // adding. To force the video to continue playing, call playVideo method
        // with currentIndex.
        this.playVideo(this.currentIndex);

        return this.carousel;
    }
}
