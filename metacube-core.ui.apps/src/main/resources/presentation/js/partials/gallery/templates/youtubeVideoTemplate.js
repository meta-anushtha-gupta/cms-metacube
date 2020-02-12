// Util dependencies
import { htmlNode as html } from 'utils';

/**
 * @description Template for youtube video player
 * Uses ES6 template literal to composite the markup
 * @param {String} videoID
 * @param {String} containerCSSClass
 */
export default (videoID, { containerCSSClass = 'youtube-container' } = {}) => html`
    <div data-video-id="${videoID}">
        <div class="gallery__${containerCSSClass}">
            <div class="gallery__youtube-placeholder"></div>
        </div>
    </div>
`;
