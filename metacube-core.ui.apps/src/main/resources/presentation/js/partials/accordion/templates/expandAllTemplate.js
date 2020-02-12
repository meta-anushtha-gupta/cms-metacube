/**
 * Template for accordion expand all / collapse all
 * Uses ES6 template literal to composite the markup for a accordion expand all / collapse all
 */
import { html } from 'utils';

export default labels => html`
    <ul class="accordion__expand-collapse-all-container">
        <li class="accordion__expand-collapse-all">
            <a data-expand-all href="#" class="link link_bold">
                ${labels.expandAll}
            </a>
        </li>
        
        <li class="accordion__expand-collapse-all">
            <a data-collapse-all href="#" class="link link_bold">
                ${labels.collapseAll}
            </a>
        </li>
    </ul>
`.trim();
