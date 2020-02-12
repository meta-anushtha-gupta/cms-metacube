// Util dependencies
import {
    isScrolledIntoViewHorizontally,
    noop,
    renderer
} from 'utils';

// Local dependencies
import GalleryItem from './GalleryItem';
import GalleryItemTypes from './../constants/galleryItemTypes';
import thumbnailNavTemplate from './../templates/thumbnailNavTemplate';

const CLASSES = {
    FOCUS: 'gallery__item--focus'
};

/**
 * @class ThumbnailNavigation
 * @description A view component for displaying a thumbnail navigation
 * and applies a callback when clicked on each thumbnail
 */
export default class ThumbnailNavigation {
    /**
     * @constructor
     * @description On instantiation sets data and callback, then creates a
     * thumbnail nav node composed by gallery item nodes
     * @param galleryData
     * @param callback
     */
    constructor(galleryData, callback = noop) {
        this.galleryData = galleryData;
        this.element = null;
        this.callback = callback;
        this.lastSelectedIndex = 0;
        this.mediaElms = []; // collection of GalleryItem dom nodes
        this.galleryItemObjects = []; // collection of GalleryItem objects

        // method aliases
        this.createThumbnailNav = this.createThumbnailNav.bind(this);
        this.createGalleryItem = this.createGalleryItem.bind(this);
        this.focusThumbnail = this.focusThumbnail.bind(this);

        // initialize
        this.createThumbnailNav();
    }

    /**
     * focusThumbnail()
     * applies class to focus the active thumbnail
     */
    focusThumbnail(activeIndex) {
        this.mediaElms.forEach((item) => {
            item.classList.remove(CLASSES.FOCUS);
        });

        const activeThumb = this.mediaElms[activeIndex];
        const widthOffset = 20;

        activeThumb.classList.add(CLASSES.FOCUS);

        if (!isScrolledIntoViewHorizontally(activeThumb, widthOffset)) {
            this.element.scrollLeft = activeThumb.offsetLeft - widthOffset;
        }
    }

    /**
     * @method selectThumbnail
     * @description When a thumbnail is selected, calls the callback method
     * with current and previous indexes
     * @param index
     */
    selectThumbnail(index) {
        this.callback(index, this.lastSelectedIndex);
        this.lastSelectedIndex = index;
    }

    /**
     * @method createThumbnailNav
     * @description Creates a thumbnailNav element from the media data
     */
    createThumbnailNav() {
        this.element = renderer.fromTemplate(
            thumbnailNavTemplate()
        );

        const items = Array.prototype.concat(...this.galleryData.map(e => e.galleryItems));

        items.forEach((item, index) => {
            renderer.append(this.createGalleryItem(item, index), this.element);
        });

        // Add focus class to first thumbnail
        if (this.mediaElms.length > 0) {
            this.mediaElms[0].classList.add(CLASSES.FOCUS);
        }
    }

    /**
     * @method createGalleryItem
     * @description Creates a GalleryItem from an group item's data
     * @param galleryItem {Object} galleryItem item from a gallery group's galleryItems collection
     * @param index
     * @return {Node}
     */
    createGalleryItem(galleryItem, index) {
        const {
            imgLarge,
            imgSmall,
            thumbnailImage,
            imgAltText
        } = galleryItem.media;

        const item = new GalleryItem(
            GalleryItemTypes.THUMBNAIL,
            { imgLarge, imgSmall, thumbnailImage, imgAltText },
            { callback: this.selectThumbnail.bind(this, index) }
        );

        const rendered = item.render();
        this.galleryItemObjects.push(item);
        this.mediaElms.push(rendered);
        return rendered;
    }

    /**
     * @method destroy
     * @description Calls the destroy method for each galleryItem to detach events
     */
    destroy() {
        this.galleryItemObjects.forEach((item) => {
            item.destroy();
        });

        this.mediaElms = [];
        this.galleryItemObjects = [];
        this.element.innerHTML = '';
    }

    /**
     * @method render
     * @description Retrieves the thumbnail navigation element
     * @return {Node}
     */
    render() {
        return this.element;
    }
}
