// Util dependencies
import { htmlNode as html } from 'utils';

/**
 * @description Template for images
 * Uses ES6 template literal to composite the markup
 * @param {String} smallImagePath - Image used for small screen
 * @param {String} largeImagePath - Image used for large screen
 * @param {String} altText - Image alt text
 * @param {String} cssClass - CSS class for image
 */
export default (smallImagePath, largeImagePath, { altText = '', cssClass = '' } = {}) => html`
    <picture>
        ${smallImagePath ? `<source media="(max-width: 767px)" srcset="${smallImagePath}" />` : ''}
        <img src="${largeImagePath}" alt="${altText}" class="${cssClass}" />
    </picture>
`;
