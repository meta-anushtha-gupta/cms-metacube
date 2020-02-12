// Util dependencies
import { html } from 'utils';

/**
 * @description Template for carousel gallery
 * Uses ES6 template literal to composite the markup for a carousel gallery
 */
export default (theme = '') => html`
    <div class="gallery ${theme}">
        <div class="gallery__preview-container"
            data-preview-container>
        </div>
        <div data-thumbnail-navigation>
        </div>
    </div>
`.trim();
