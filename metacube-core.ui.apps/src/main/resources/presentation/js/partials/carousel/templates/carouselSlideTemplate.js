/**
 * Template for a carousel slide.
 * Uses ES6 template literal to composite the markup for a carousel slide
 */
import { html } from 'utils';

/**
 * method will form li element and adds or skip data-analytics-container attribute
 * based on the passed argument
 * @param content
 * @param hasMoreThanOneSlide
 * @param analyticsContainerKey
 * @param analyticsContainerValue
 * @returns li element
 */

function generateTemplate(content, hasMoreThanOneSlide,
                            analyticsContainerKey, analyticsContainerValue) {
    if (hasMoreThanOneSlide && analyticsContainerKey) {
        return `<li data-carousel-slide data-analytics-container="{'${analyticsContainerKey}': '${analyticsContainerValue}'}" class="carousel__slide">${content}</li>`;
    }
    return `<li data-carousel-slide class="carousel__slide">${content}</li>`;
}

export default (content, hasMoreThanOneSlide, analyticsContainerKey, analyticsContainerValue) => html`
    ${generateTemplate(content, hasMoreThanOneSlide, analyticsContainerKey, analyticsContainerValue)}
`.trim();
