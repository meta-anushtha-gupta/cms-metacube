// Util dependencies
import { renderer } from 'utils';
import { Modal } from 'partials/modal';

// Module dependencies
import ViewMore from 'partials/view-more';

// Local dependencies
import GalleryItem from './GalleryItem';
import CarouselGallery from './CarouselGallery';
import GalleryItemTypes from './../constants/galleryItemTypes';
import tileGalleryTemplate from './../templates/tileGalleryTemplate';
import tileSectionTemplate from './../templates/tileSectionTemplate';

/**
 * @const ATTRIBUTES
 * @description Attributes that can be used for selecting elements from the gallery
 * @type {{ITEMS: string, SECTION_MEDIA: string}}
 */
const ATTRIBUTES = {
    ITEMS: 'data-gallery-items',
    SECTION_MEDIA: 'data-section-media',
    VIEW_CTA: 'data-view-cta'
};

/**
 * @class TileGallery
 * @description View component for displaying a gallery items
 * in a tiled view and managing its state
 */
export default class TileGallery {
    /**
     * @constructor
     * @description On instantiation sets the properties of the class
     * @param galleryData {Array} Collection of grouped gallery items
     */
    constructor(galleryData) {
        this.galleryData = galleryData; // array of raw gallery objects
        this.gallery = null; // reference to the gallery node element
        this.gallerySections = null;
        this.gallerySectionsElm = null; // reference to element the gallerySections will append to
        this.mediaElms = []; // collection of GalleryItem dom nodes
        this.galleryItemObjects = []; // collection of GalleryItem objects

        // method aliases
        this.createGallery = this.createGallery.bind(this);
        this.createGallerySection = this.createGallerySection.bind(this);
        this.createGalleryItem = this.createGalleryItem.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);

        // initialize
        this.createGallery();
    }

    /**
     * @method createGallery
     * @description Creates a gallery element and a collection of galleryItems elements
     * from the galleryData, then renders the galleryItems to the gallery "items" element,
     * finally creates a View More cta (a component for displaying a number of
     * gallery sections (rows) at a time)
     */
    createGallery() {
        this.gallery = renderer.fromTemplate(tileGalleryTemplate());
        this.gallerySectionsElm = this.gallery.querySelector(`[${ATTRIBUTES.ITEMS}]`);
        this.setData(this.galleryData);
    }

    /**
     * @method setData
     * @description Sets the gallery data, instantiates a ViewMore component,
     * and renders ViewMore to the gallery
     * @param data
     */
    setData(data) {
        this.galleryData = data;
        this.gallerySections = this.galleryData.map(this.createGallerySection);
        this.viewMore = new ViewMore(this.gallerySections);
        renderer.append(this.viewMore.render(), this.gallerySectionsElm);
    }

    /**
     * @method updateData
     * @description Destroys previous data and elements and sets the new data
     * @param data
     */
    updateData(data) {
        this.destroy(false);
        this.setData(data);
    }

    /**
     * @method createGallerySection
     * @description Creates an gallery section element based on the galleryGroup's type,
     * then creates a collection of GalleryItems for each item in the group and appends
     * the items to the section created
     * @param galleryGroup {Object} Grouped item from a gallery collection
     * @return {Node} A galleryGroup element
     */
    createGallerySection(galleryGroup) {
        const { type, galleryItems } = galleryGroup;
        const items = galleryItems.map(this.createGalleryItem);
        const sectionElm = renderer.fromTemplate(tileSectionTemplate(type));
        const mediaElm = sectionElm.querySelector(`[${ATTRIBUTES.SECTION_MEDIA}]`);

        items.forEach((item) => {
            renderer.append(item.render(), mediaElm);
        });

        return sectionElm;
    }

    /**
     * @method createGalleryItem
     * @description Creates a GalleryItem from an group item's data
     * @param galleryItem {Object} galleryItem item from a gallery group's galleryItems collection
     * @return {GalleryItem}
     */
    createGalleryItem(galleryItem) {
        const {
            imgLarge,
            imgSmall,
            thumbnailImage,
            imgAltText
        } = galleryItem.media;

        const item = new GalleryItem(
            GalleryItemTypes.TILE,
            { imgLarge, imgSmall, thumbnailImage, imgAltText },
            { callback: this.onSelectItem.bind(this, galleryItem) }
        );

        this.galleryItemObjects.push(item);
        this.mediaElms.push(item.render());

        this.carousel = null;

        return item;
    }

    /**
     * @method onSelectedItem
     * @description Callback handler for when a gallery item is selected
     * @param item {Object} Gallery item selected
     * @return {TileGallery}
     */
    onSelectItem(item) {
        this.carousel = new CarouselGallery(
            this.galleryData,
            {
                selectedGalleryItem: item,
                theme: CarouselGallery.THEMES.DARK
            }
        );

        let modal;

        modal = new Modal(undefined, {
            modalContent: this.carousel.render(),
            sizeLarge: Modal.SIZES.FULL_OVERLAY,
            callbacks: {
                beforeClose: () => {
                    // clean up and remove the modal on close
                    modal.destroy();
                    modal = null;
                }
            }
        });

        modal.open();
    }

    /**
     * @method destroy
     * @description Calls the destroy method for each galleryItem, viewMore and gallery elements
     * @param removeGallery {boolean} Indicator to remove the gallery node
     */
    destroy(removeGallery = true) {
        if (removeGallery) {
            this.gallery.remove();
        }

        this.galleryItemObjects.forEach((item) => {
            item.destroy();
        });

        this.galleryItemObjects = [];

        if (this.viewMore) {
            this.viewMore.destroy();
        }
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
