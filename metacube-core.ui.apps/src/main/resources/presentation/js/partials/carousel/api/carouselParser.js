/**
 * An api for creating Carousel components from specially tagged DOM elements
 *
 * Example markup for creating a carousel from html tags:
 *
 * <div data-carousel="[type]" (bottom || overlay|| sliding)
 *      data-infinite="[boolean]"
 *      data-label-previous="[string]"
 *      data-label-next="[string]"
 *      data-theme="[string]">
 *
 *     <div data-carousel-slides>
 *         <div>slide 1</div>
 *         <div>slide 2</div>
 *         <div>slide 3</div>
 *         ...
 *     </div>
 * </div>
 */
// Module dependencies
import { renderer } from 'utils';
// Local dependencies
import Carousel from './../views/Carousel';

/**
 * @const ATTRIBUTES
 * @description Collection of data attributes for querying
 * @type {{CAROUSEL: string, SLIDES: string}}
 */
const ATTRIBUTES = {
    CAROUSEL: 'data-carousel',
    SLIDES: 'data-carousel-slides',
    CQ: 'CQ'
};

const CLASSES = {
    NEWSECTION: 'new section newpar',
    NEWPAR: 'newpar',
    AEMEDITORIAL: 'aem-editorial'
};


/**
 * @method getCarouselElements
 * @description
 * Retrieves a collection of the carousel elements from a DOM element
 * @returns {NodeList}
 */
function getCarouselElements(element) {
    return element.querySelectorAll('[data-carousel]');
}

/**
 * @method filterArray
 * @description filter array to remove empty slots
 * @returns Array
*/
function filterArray(testArray) {
    let index = -1;
    const arrLength = testArray ? testArray.length : 0;
    let resIndex = -1;
    const result = [];

    while (index < arrLength) {
        const value = testArray[index];

        if (value) {
            result[resIndex += 1] = value;
        }
        index += 1;
    }

    return result;
}

/**
 * @method filterSlides
 * @description filter slides to remove extra CQ and section
 * @returns Array
*/
function filterSlides(slides) {
    const filteredSlides = [];
    if (slides.length) {
        slides.forEach((slide) => {
            if (slide.querySelector('.fixed-hero')) {
                const revisedIndex = parseInt(slide.querySelector('.fixed-hero').getAttribute('data-order'), 10);
                const hideItem = slide.querySelector('.fixed-hero').getAttribute('data-hide') != null;

                if (slide.className !== CLASSES.NEWSECTION
                && slide.tagName !== ATTRIBUTES.CQ
                && !slide.matches(`.${CLASSES.NEWPAR}`)
                && !slide.matches(`.${CLASSES.AEMEDITORIAL}`)
                && hideItem === false) {
                    if (filteredSlides[revisedIndex - 1] === undefined) {
                        filteredSlides[revisedIndex - 1] = slide;
                    }
                }
            }
        });
        if (filteredSlides.length) {
            return filterArray(filteredSlides);
        }
        filteredSlides[0] = slides[0];
    }
    return filteredSlides;
}


/**
 * @method renderCarousel
 * @description Constructs a carousel configuration based on an elements data attributes,
 * and a collection of carousel elements to create a Carousel object from
 * @param carouselElement {Element} DOM element that represents a carousel
 * @return {Carousel} An instance of a Carousel
 */
function renderCarousel(carouselElement) {
    const carouselSlides = carouselElement.querySelector(`[${ATTRIBUTES.SLIDES}]`);
    let carousel = null;
    const carouselData = carouselElement.dataset;
    const carouselItems = carouselSlides.children ?
        filterSlides([...carouselSlides.children]) : null;
    if (carouselItems && carouselItems.length) {
        const config = {};
        config.type = carouselData.carousel;
        config.infinite = carouselData.infinite === 'true';
        config.indicators = carouselData.indicators === 'true';
        config.labels = {
            next: carouselData.labelNext,
            prev: carouselData.labelPrevious
        };
        config.theme = carouselData.theme;
        config.analyticsKey = carouselData.carouselAnalyticsContainerKey;
        carousel = new Carousel(carouselItems, config);

        renderer.insert(carousel.render(), carouselElement);
    }
    return carousel;
}

/**
 * @method createCarousel
 * @description Parses a DOM element for carousel tags and renders a carousel for each instance
 */
export function createCarousel(element) {
    const carouselElements = getCarouselElements(element);
    const carousels = [];

    for (let i = 0; i < carouselElements.length; i += 1) {
        carousels.push(
            renderCarousel(carouselElements[i])
        );
    }

    return carousels;
}

/**
 * export public api
 */
export default {
    createCarousel
};
