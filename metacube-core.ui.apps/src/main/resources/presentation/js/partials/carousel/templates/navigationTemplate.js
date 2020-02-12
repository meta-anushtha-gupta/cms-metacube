/**
 * Template for the media asset carousel navigation
 * Uses ES6 template literal to composite the markup for a navigation component
 * for the media asset carousel
 */
import { html } from 'utils';

export default labels => html`
    <div data-carousel-navigation
         class="carousel-nav">
         <div class="carousel-nav__pages">
            <span data-carousel-page-current></span>/<span data-carousel-page-total></span>
        </div>
        <div class="carousel-nav__buttons">
            <button data-navigation-button="prev"
                class="carousel-nav__button carousel-nav__button--prev" data-analytics-trigger="image rotate">
                <span class="offscreen">${labels.prev}</span>
            </button><!--
         --><button data-navigation-button="next"
                class="carousel-nav__button carousel-nav__button--next" data-analytics-trigger="image rotate">
                <span class="offscreen">${labels.next}</span>
            </button>
        </div>
     </div>
`.trim();
