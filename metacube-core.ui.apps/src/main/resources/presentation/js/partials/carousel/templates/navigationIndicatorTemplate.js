/**
 * Template for the carousel navigation indicators or dots
 * Uses ES6 template literal to composite the markup for a navigation component
 * for the hero carousel
 */
import { html } from 'utils';

export default () => html`
    <div class="carousel-nav__indicator">
        <ul class="carousel-nav__indicator-list"></ul>
    </div>
`.trim();
