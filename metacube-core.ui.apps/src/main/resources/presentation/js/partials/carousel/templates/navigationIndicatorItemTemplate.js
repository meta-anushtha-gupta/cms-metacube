/**
 * Template for the carousel navigation indicators or dots
 * Uses ES6 template literal to composite the markup for a navigation component
 * for the hero carousel
 */
import { html } from 'utils';

export default index => html`
    <li>
        <a class="carousel-nav__indicator-dot" data-index="${index}"></a>
    </li>
`.trim();
