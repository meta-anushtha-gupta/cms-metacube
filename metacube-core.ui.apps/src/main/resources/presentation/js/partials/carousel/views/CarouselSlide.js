// Module dependencies
import { renderer } from 'utils';

// Local dependencies
import carouselSlideTemplate from './../templates/carouselSlideTemplate';

/**
 * @const CLASSES
 * @description Collection of constant values for related class attributes of the module
 * @type {{SLIDE: string, ACTIVE: string}}
 */
const CLASSES = {
    SLIDE: 'carousel__slide',
    ACTIVE: 'carousel__slide--active'
};

/**
 * @class CarouselSlide
 * @description View component for displaying a Carousel slide and managing its state
 */
export default class CarouselSlide {
    /**
     * @constructor On instantiation, sets the properties and creates a slide element
     * @param element {Element} The element to create a slide from
     * @param isActive {boolean} Indicator for whether to set the slide as active
     */
    constructor(element, isActive = false, analyticsKey,
                    hasMoreThanOneSlide, slideIndex) {
        // properties
        this.slide = null;
        this.isActive = isActive;
        this.analyticsKey = analyticsKey;
        this.carouselSlideIndex = slideIndex;
        this.hasMoreThanOneSlide = hasMoreThanOneSlide;
        // initialize
        this.createSlide(element);
    }

    /**
     * @method createSlide
     * @description Creates a slide elements and sets its
     * visual state based on if the item is active
     * @param element
     */
    createSlide(element) {
        const template = renderer.fromTemplate(
                                            carouselSlideTemplate(null,
                                                                this.hasMoreThanOneSlide,
                                                                this.analyticsKey,
                                                                this.carouselSlideIndex));

        this.slide = renderer.insert(element, template);

        if (this.isActive) {
            this.enable();
        } else {
            this.disable();
        }
    }

    /**
     * @method destroy
     * @description Removes the slide element reference
     */
    destroy() {
        this.slide = null;
    }

    /**
     * @method enable
     * @description Sets the isActive state to true and applies
     * the active class to the slide element
     */
    enable() {
        this.isActive = true;
        this.slide.classList.add(CLASSES.ACTIVE);
    }

    /**
     * @method disable
     * @description Sets the isActive state to false and removes
     * the active class from the slide element
     */
    disable() {
        this.isActive = false;
        this.slide.classList.remove(CLASSES.ACTIVE);
    }

    /**
     * @method render
     * @description Retrieves the slide DOM element
     * @return {Element|null} The slide DOM element
     */
    render() {
        return this.slide;
    }
}
