// Constant dependencies
import { EVENTS } from 'Constants';

// Util dependencies
import { renderer } from 'utils';

import MoreInfoBar from 'partials/more-info-bar';
import { YouTube } from 'partials/youtube';

// Local dependencies
import ImageTemplate from './../templates/imageTemplate';
import YoutubeTemplate from './../templates/youtubeVideoTemplate';
import galleryItemTemplate from './../templates/galleryItemTemplate';
import GalleryItemTypes from './../constants/galleryItemTypes';

/**
 * @const CLASSES
 * @description Collection of classes for querying
 */
const CLASSES = {
    GALLERY_YOUTUBE_CONTAINER: 'gallery__youtube-container'
};

/**
 * @const defaultLocalization
 * @description Default localization labels for "More Info" button
 * moreInfo: The label for the "More Info" cta.
 * @type {{moreInfo: String}}
 */
const defaultLocalization = {
    moreInfo: 'More Info'
};

// Deconstruct localization pagedata
const {
    moreInfo
} = defaultLocalization;

/**
 * @function renderCarouselItem
 * @description given a galleryItem, it checks the type and returns the associated element with
 * rendered template using properties from data
 * @returns {Element} A rendered element with the template
 */
function renderCarouselItem(media, details) {
    // Deconstruct media
    const {
        imgSmall,
        overlayImage,
        youtube: youtubeId
    } = media;

    const {
        modelTitle,
        modelPath,
        captionHeading,
        captionDescription,
        CTAs
    } = details;

    const getAnalyticsMediaContainerInfo = ({ bodystyleId, classId, isAMG } = window.metacube.ns('pageData', 'vehicle')) => (
        { media: { body: bodystyleId, class: classId, isAMG } }
    );

    // Node which contains each gallery item
    const renderedItem = renderer.fromTemplate('<div class="carousel-gallery-item"></div>');
    renderedItem.dataset.analyticsContainer = JSON.stringify(getAnalyticsMediaContainerInfo()).replace(/"/g, '\'');

    if (youtubeId) {
        renderer.insert(YoutubeTemplate(youtubeId)({ getNode: true }), renderedItem);
        YouTube.createInstance(youtubeId, renderedItem.querySelector(`.${CLASSES.GALLERY_YOUTUBE_CONTAINER}`));
    } else {
        renderer.insert(ImageTemplate(imgSmall.replace(/\s/g, '%20'), overlayImage.replace(/\s/g, '%20'), { cssClass: 'modal__image' })({ getNode: true }), renderedItem);
    }

    const renderMoreInfoBar = !!(CTAs.length || modelTitle
        || captionHeading || captionDescription);

    if (renderMoreInfoBar) {
        const moreInfoBar = new MoreInfoBar(
            null,
            {
                buttonContent: moreInfo,
                title: modelTitle,
                endpoint: modelPath,
                captionHeading,
                captionDescription
            },
            CTAs
        );

        renderedItem.appendChild(moreInfoBar.render());
    }

    return renderedItem;
}

/**
 * @class GalleryItem
 * @description A view component for displaying a gallery items image
 * and applies a callback when clicked
 * A gallery item can be one of the following:
 * 1. A Tile (current desktop gallery, ref: http://imgur.com/RY7gial)
 * 2. A Thumbnail (current thumbnails underneath GalleryCarousel, ref: http://imgur.com/4sdp0mO)
 * 3. A carousel item (current carousel in the modal of gallery detail, ref: http://imgur.com/slfM3iU)
 */
export default class GalleryItem {
    /**
     * @constructor
     * @description On instantiation sets data and callback, then creates a
     * gallery item node and attaches its events
     * @param {String} type - Value from GalleryItemType enum
     * @param {Object} media - Media object from GalleryItem object
     * @param {Object} [details] - Details object from GalleryItem object
     * @param {Function} [callback=noop] - Callback for onClick event
     */
    constructor(type, media, { details, callback } = {}) {
        this.galleryItemType = type;
        this.media = media;
        this.details = details;
        this.callback = callback;
        this.element = null;

        // method aliases
        this.onClick = this.onClick.bind(this);
        this.destroy = this.destroy.bind(this);

        // initialize
        this.createItem();
        this.attachEvents();
    }

    /**
     * @method createItem
     * @description Creates a gallery item element from the media data
     */
    createItem() {
        const {
            imgLarge,
            imgSmall,
            thumbnailImage,
            imgAltText,
        } = this.media;

        switch (this.galleryItemType) {
        case GalleryItemTypes.TILE:
        case GalleryItemTypes.THUMBNAIL:
            this.element = renderer.fromTemplate(
                galleryItemTemplate(imgLarge.replace(/\s/g, '%20'), imgSmall.replace(/\s/g, '%20'), thumbnailImage.replace(/\s/g, '%20'), imgAltText, this.galleryItemType)
            );
            break;
        case GalleryItemTypes.CAROUSEL_ITEM:
            this.element = renderCarouselItem(this.media, this.details);
            break;
        default:
            console.error('GalleryItemType not found');
        }
    }

    /**
     * @method destroy
     * @description Detaches events and removes the reference to the gallery element
     */
    destroy() {
        this.detachEvents();
        this.element.remove();
        this.element = null;
    }

    /**
     * @method attachEvents
     * @description Adds a click event listener and callback to the gallery element
     */
    attachEvents() {
        this.element.addEventListener(EVENTS.CLICK, this.onClick);
    }

    /**
     * @method detachEvents
     * @description Removes the click event listener and callback from the gallery element
     */
    detachEvents() {
        this.element.removeEventListener(EVENTS.CLICK, this.onClick);
    }

    /**
     * @method onClick
     * @description Event handler for when a gallery item is clicked to
     * prevent the default and apply the callback property
     * @param event {Event}
     */
    onClick(event) {
        if (typeof this.callback === 'function') {
            event.preventDefault();

            this.callback();
        }
    }
    /**
     * @method render
     * @description Retrieves the gallery item element
     * @return {Node}
     */
    render() {
        return this.element;
    }
}
