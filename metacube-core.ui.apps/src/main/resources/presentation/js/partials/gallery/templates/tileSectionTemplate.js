// Util dependencies
import { html } from 'utils';

/**
 * @description Template for tile section
 * Uses ES6 template literal to composite the markup for a gallery section
 * and insert the theme class to corresponding elements
 * @param {String} theme - class modifier for the different types of
 * gallery sections (groups)
 */
export default theme => html`
    <div class="gallery__section gallery__section--${theme}">
        <div class="gallery__items"
             data-section-media>
        </div>
    </div>
`.trim();
