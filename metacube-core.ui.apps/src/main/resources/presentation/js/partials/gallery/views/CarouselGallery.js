// Util dependencies
import { renderer } from 'utils';
import { Carousel } from 'partials/carousel';

// Local dependencies
import GalleryItem from './GalleryItem';
import ThumbnailNavigation from './ThumbnailNavigation';
import GalleryItemTypes from './../constants/galleryItemTypes';
import carouselGalleryTemplate from './../templates/carouselGalleryTemplate';

/**
 * @const ATTRIBUTES
 * @description Attributes that can be used for selecting elements from the gallery
 * @type {{CAROUSEL_CONTAINER: string, THUMBNAIL_NAV_CONTAINER: string}}
 */
const ATTRIBUTES = {
    CAROUSEL_CONTAINER: 'data-preview-container',
    THUMBNAIL_NAV_CONTAINER: 'data-thumbnail-navigation'
};

/**
 * @function renderGalleryItem
 * @description Creates a GalleryItem of type CAROUSEL_ITEM
 * @returns {Element} A rendered element with the template
 */
function renderGalleryItem(galleryItem) {
    return (new GalleryItem(
        GalleryItemTypes.CAROUSEL_ITEM,
        galleryItem.media,
        { details: galleryItem.details }
    )).render();
}

/**
 * @method renderCarousel
 * @description Constructs a carousel configuration based on an gallery item data and rendered
 * template
 * @param galleryItems {Object} An object from the gallery API with all the gallery data
 * @param carouselElement {Element} DOM element that represents a carousel
 * @param startIndex {Number}
 * @return {Carousel} An instance of a Carousel
 */
function renderCarousel(galleryItems, carouselElement, startIndex) {
    const carousel = new Carousel(
        galleryItems.map(renderGalleryItem), { startIndex }
    );

    renderer.insert(carousel.render(), carouselElement);

    return carousel;
}

/**
 * @method createCarousel
 * @description Parses a DOM element for carousel tags and renders a carousel for each instance
 */
function createCarousel(
    galleryData,
    carouselElement,
    selectedGalleryItem
) {
    const galleryItems = Array.prototype.concat(...galleryData.map(e => e.galleryItems));
    const startIndex = galleryItems.findIndex(g => g === selectedGalleryItem);
    return renderCarousel(galleryItems, carouselElement, startIndex);
}

/**
 * @class CarouselGallery
 * @description View component for displaying a gallery items
 * in a carousel view and managing its state
 */
export default class CarouselGallery {
    /**
     * @static THEMES
     * @description CSS class themes that can be applied to the CarouselGallery
     * @type {{DARK: string}}
     */
    static THEMES = {
        DARK: 'gallery--dark'
    };

    /**
     * @constructor
     * @description On instantiation sets the properties of the class
     * @param galleryData {Array} Collection of grouped gallery items
     */
    constructor(galleryData, {
        enableThumbnailNavigation = false,
        selectedGalleryItem = galleryData[0].galleryItems[0],
        theme = ''
    } = {}) {
        this.galleryData = galleryData; // array of raw gallery objects
        this.selectedGalleryItem = selectedGalleryItem;
        this.gallery = null; // reference to the gallery node element
        this.carouselElm = null; // reference to element the carousel will append to
        this.carousel = null; // carousel element
        this.theme = theme; // css theme to apply to the gallery

        this.enableThumbnailNavigation = enableThumbnailNavigation;
        if (this.enableThumbnailNavigation) {
            this.thumbnailNavElm = null; // carousel thumbnail nav will append to
            this.thumbnailNavigation = null; // thumbnail navigation element
        }

        // method aliases
        this.createGallery = this.createGallery.bind(this);

        // initialize
        this.createGallery();
    }

    /**
     * @method createGallery
     * @description Creates a gallery element, carousel and thumbnail nav nodes,
     * then calls method to set gallery data
     */
    createGallery() {
        this.gallery = renderer.fromTemplate(carouselGalleryTemplate(this.theme));
        this.carouselElm = this.gallery.querySelector(`[${ATTRIBUTES.CAROUSEL_CONTAINER}]`);
        if (this.enableThumbnailNavigation) {
            this.thumbnailNavElm = this.gallery.querySelector(`[${ATTRIBUTES.THUMBNAIL_NAV_CONTAINER}]`);
        }
        this.setData(this.galleryData);
    }

    /**
     * @method setData
     * @description Sets the gallery data, instantiates a Carousel and ThumbnailNav components
     * @param data
     */
    setData(data) {
        this.galleryData = data;

        this.carousel = createCarousel(
            this.galleryData, this.carouselElm, this.selectedGalleryItem
        );

        if (this.enableThumbnailNavigation) {
            this.thumbnailNavigation = new ThumbnailNavigation(
                this.galleryData, this.carousel.setActiveSlide
            );

            this.carousel.config.onSlideCallback = this.thumbnailNavigation.focusThumbnail;

            renderer.append(this.thumbnailNavigation.render(), this.thumbnailNavElm);
        }
    }

    /**
     * @method updateData
     * @description Destroys previous data and elements and sets the new data
     * @param data
     */
    updateData(data) {
        this.destroy(false);
        this.selectedGalleryItem = data[0].galleryItems[0];
        this.setData(data);
    }

    /**
     * @method destroy
     * @description Calls the destroy method of gallery, carousel and thumbnail navigation
     * @param removeGallery {boolean} Indicator to remove the gallery node
     */
    destroy(removeGallery = true) {
        if (removeGallery) {
            this.gallery.remove();
        }

        this.carousel.destroy();
        this.thumbnailNavigation.destroy();
    }

    /**
     * @method render
     * @description Retrieves the gallery element
     * @return {Node}
     */
    render() {
        return this.gallery;
    }
}
