/**
 * Template for a more info bar
 * Uses ES6 template literal to composite the markup for a carousel
 */

import { htmlNode, html } from 'utils';

/**
 * method will form anchor link or span element based on the passed argument
 * @param title
 * @param endpoint
 * @returns anchor link or span element or empty string
 */

function renderTitle(title, endpoint) {
    if (endpoint && title) {
        return `<a href="${endpoint}" class="more-info-bar__model" data-analytics-trigger="cta">${title}</a>`;
    } else if (title) {
        return `<span class="more-info-bar__model">${title}</span>`;
    }

    return '';
}

/**
 * method will create span element containing captionHeading if available
 * @param captionHeading
 * @returns span element or empty string
 */
function renderCaptionHeading(captionHeading) {
    return captionHeading ?
            `<span class="more-info-bar__caption-heading">${captionHeading}</span>` :
                '';
}

function renderAnalyticsTrigger(cta) {
    return Object.prototype.hasOwnProperty.call(cta, 'dataAnalyticsTrigger') ?
        `data-analytics-trigger="${cta.dataAnalyticsTrigger}"` :
        '';
}

/**
 * method will create span element containing captionDescription if available
 * @param captionDescription
 * @returns span element or empty string
 */

function renderCaptionDescription(captionDescription) {
    return captionDescription ?
            `<p class="more-info-bar__caption-description">${captionDescription != null ? captionDescription : ''}</p>` :
                '';
}

export default ({ buttonContent = 'More Info', title = '', endpoint = '', captionHeading = '', captionDescription = '' }, ctas = []) => htmlNode`
    <div class="more-info-bar">
        <button class="more-info-bar__toggle">
            <span class="more-info-bar__toggle-copy">${buttonContent}</span>
        </button>
        <div class="more-info-bar__content">
            <div class="more-info-bar__copy-container">
                ${renderTitle(title, endpoint)}
                ${renderCaptionHeading(captionHeading)}
                ${renderCaptionDescription(captionDescription)}
            </div>
            <ul class="more-info-bar__cta-container">
                ${ctas.map(cta => html`
                    <li class="more-info-bar__cta-list-item">
                        <a class="more-info-bar__cta ${cta.className}" href="${cta.endpoint}" target="${cta.target}" ${cta.type === 'download' ? 'download' : ''} ${renderAnalyticsTrigger(cta)}>${cta.label}</a>
                    </li>
                `).join('')}
            </ul>
        </div>
    </div>
`;

