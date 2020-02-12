// Util dependencies
import { html } from 'utils';

/**
 * @description Template for tile gallery
 * Uses ES6 template literal to composite the markup for a gallery made of tiles
 */
export default () => html`
    <div class="gallery">
        <div class="gallery__container"
             data-gallery-items>
        </div>
    </div>
`.trim();
