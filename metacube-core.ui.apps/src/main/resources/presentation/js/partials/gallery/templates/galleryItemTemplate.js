// Util dependencies
import { html } from 'utils';

/**
 * method will form tag <img> or tag <picture> based on param galleryItemType
 * @param largeImage
 * @param smallImage
 * @param thumbnailImage
 * @param altText
 * @param galleryItemType
 * @returns tag <img> or tag <picture>
 */

function renderImage(largeImage, smallImage, thumbnailImage, altText, galleryItemType) {
    if (galleryItemType === 'thumbnail') {
        return `<img src="${thumbnailImage}" alt="${altText}" class="gallery__image gallery__image--${galleryItemType}">`;
    }

    return `
        <picture class="gallery__picture">
            <source media="(max-width: 767px)" srcset="${smallImage || largeImage}">
            <img src="${largeImage}" alt="${altText}" class="gallery__image gallery__image--${galleryItemType}">
        </picture>
    `;
}

/**
 * @description Template for galleryItem
 * Uses ES6 template literal to composite the markup for a gallery item
 * @param {String} largeImage - Image used for large screen
 * @param {String} smallImage - Image used for small screen
 * @param {String} altText - Image alt text
 * @param {String} galleryItemType - Type of gallery item ('tile' or 'thumbnail')
 * to be used as class modifier
 */
export default (largeImage, smallImage, thumbnailImage, altText, galleryItemType) => html`
    <a href="#" class="gallery__item gallery__item--${galleryItemType}" data-analytics-trigger="gallery-expand">
        ${renderImage(largeImage, smallImage, thumbnailImage, altText, galleryItemType)}
    </a>
`.trim();
