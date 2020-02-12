/**
 * Hero Carousel Module
 * Carousel for the Home Page Hero
 * This module shows the carousel controls if there is more than one asset
 * and initializes the HeroCarousel module
 */

// Partial dependencies
import { carouselParser } from 'partials/carousel';

class HeroCarousel {
    /**
     * Instantiates the HeroCarousel class
     * @param {Object} element
     */
    constructor(element) {
        this.element = element;
        this.carousels = null;
        this.init.bind(this)();
    }

    /**
     * init()
     */
    init() {
        this.carousels = carouselParser.createCarousel(this.element);
    }
}

export default HeroCarousel;
