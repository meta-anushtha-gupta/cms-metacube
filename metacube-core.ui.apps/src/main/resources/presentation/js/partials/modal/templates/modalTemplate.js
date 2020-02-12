/**
 * Template for modal
 * Uses ES6 template literal to composite the markup for a modal
 */
import { htmlNode as html } from 'utils';

/**
 * @function
 * @name renderAnalyticAttribute
 * @description render return analytic container attribute if
 * attribute value is specified.
 * @param {dataAnalyticContainer} container value
 * @return {String} template string
 */
const renderAnalyticAttribute = (dataAnalyticContainer) => {
    if (dataAnalyticContainer) {
        return `data-analytic-container="${dataAnalyticContainer}"`;
    }
    return '';
};


/**
 * @function
 * @name renderAnalyticTriggerAttribute
 * @description render return analytic trigger attribute if
 * attribute value is specified.
 * @param {dataAnalyticTriggerClose} trigger value
 * @return {String} template string
 */
const renderAnalyticTriggerAttribute = (dataAnalyticTriggerClose) => {
    if (dataAnalyticTriggerClose) {
        return `data-analytic-trigger="${dataAnalyticTriggerClose}"`;
    }
    return '';
};

export default ({ content = '', modalClassName = 'modal', modalFocusBackId = '', modalID = 'js-modal', overlayClass = 'modal__overlay', overlayID = 'js-modal-overlay', role = 'dialog', title = 'Close Modal', modalTitle = 'Modal Title', theme = 'default', transitionInOut = false, unclosable = false, dataAnalyticContainer, dataAnalyticTriggerClose } = {}) => html`
    <span id="${overlayID}" class="${`${overlayClass} ${overlayClass}--${theme} ${(transitionInOut) ? `${overlayClass}--transitions` : ''} ${(unclosable) ? `${overlayClass}--unclosable` : ''}`}" title="${title}">
        <span class="offscreen">${title}</span>
    </span>
    <dialog id="${modalID}" role="${role}" class="${`${modalClassName} ${modalClassName}--${theme} ${(transitionInOut) ? `${modalClassName}--transitions` : ''}`}" open aria-labelledby="modal-title" ${renderAnalyticAttribute(dataAnalyticContainer)}>
        <h3 id="modal-title" class="modal__title offscreen">${modalTitle}</h3>
        <div role="document" class="modal__container">
            ${(unclosable) ? '' : `<button type="button" class="${modalClassName}__close" id="js-modal-close" title="${title}" data-focus-back="${modalFocusBackId}"  ${renderAnalyticTriggerAttribute(dataAnalyticTriggerClose)}>
                <span class="offscreen">${title}</span>
                <i class="icon-mb icon-exit"></i>
            </button>`}
            <div class="${modalClassName}__content" data-modal-content="" tabindex="-1">
                ${typeof content === 'string' ? content : ''}
            </div>
        </div>
    </dialog>
`;
