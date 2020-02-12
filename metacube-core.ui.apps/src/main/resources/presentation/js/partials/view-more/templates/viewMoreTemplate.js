// Util dependencies
import { html } from 'utils';

/**
 * @description Template for View More CTA
 * Uses ES6 template literal to composite the markup for a View More CTA
 */
export default () => html`
    <div class="view-more">
        <div data-view-more-sections></div>
        <div class="view-more-cta__container">
            <button class="view-more-cta" data-analytics-trigger="cta">
                <span data-view-more-label></span>
                <span class="icon-mb"></span>
            </button>
        </div>
    </div>
`.trim();
