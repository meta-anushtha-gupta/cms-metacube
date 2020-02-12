// Util dependencies
import { html, htmlNode } from 'utils';

/**
 * @description Template for menu selector
 * Uses ES6 template literal to composite the markup for a carousel gallery
 */
export default ({ items = [], defaultSelection }) => htmlNode`
    <div class="menu-selector">
        <button class="menu-selector__selected-item" aria-controls="menu-selector-list">${items[defaultSelection].label}</button>
        <ul id="menu-selector-list"class="menu-selector__item-list">
            ${items.map((item, index) => html`
                <li class="menu-selector__item ${index === defaultSelection ? 'menu-selector__item--selected' : ''}" data-value="${item.value}" data-analytics-trigger="menu-selector-${item.value}">
                    <button class="menu-selector__item-link">
                        ${item.label}
                    </button>
                </li>
            `).join('')}
        </ul>
    </div>
`;
