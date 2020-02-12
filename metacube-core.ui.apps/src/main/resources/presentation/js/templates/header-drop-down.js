/**
 * Template for DOG header dropdown
 * Uses ES6 template literal to composite the markup for a DOG header dropdown
 * @param dropdownItems {Array} the array of dropdown items
 */
import { html } from 'utils';

export default (dropdownItems = []) => html`
    <li class='custom-top-nav__sub-menu-list__item'>
        <img src='${dropdownItems[1].imagePath}' alt='${dropdownItems[1].imageSmall}' class='custom-top-nav__sub-menu-list__img'/>
        <a href='${dropdownItems[1].cta}' target='_self' class="custom-top-nav__sub-menu-list__link">
            ${dropdownItems[1].name}
        </a>
    </li>
`.trim();
