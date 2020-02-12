/**
 * Template for a carousel
 * Uses ES6 template literal to composite the markup for a carousel
 */
import { html } from 'utils';

export default () => html`
    <div class="carousel">
        <ul data-carousel-slides
            class="carousel__slides">
         </ul>
        <div data-carousel-navigation />
    </div>
`.trim();
