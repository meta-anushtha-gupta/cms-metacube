/**
 * Utility module for retrieving the dimensions of a DOM element
 */

/**
 * @method parseElement Deterimes if the DOM element is from a querySelector NodeList
 * or a single element and returns the corresponding element
 * @param el
 * @return {*}
 */
function parseElement(el) {
    return el.length ? el[0] : el;
}

/**
 * @method getOffset
 * @description
 * Gets the offset properties of an element
 * @param {object} el The DOM or jqLite element to get offset for
 * @return {object} Object containing the width, height, top and left properties of an element
 */
export function getOffset(el) {
    const element = parseElement(el);
    const boundingClientRect = element.getBoundingClientRect();

    return {
        top: boundingClientRect.top + (window.pageYOffset || document.documentElement.scrollTop),
        left: boundingClientRect.left + (window.pageXOffset || document.documentElement.scrollLeft)
    };
}

/**
 * @method getHeight
 * @description
 * Gets the height of an element
 * @param {object} el The DOM or jqLite element to get height for
 * @returns {number} The height of the element
 */
export function getHeight(el) {
    const element = parseElement(el);
    const boundingClientRect = element.getBoundingClientRect();

    return boundingClientRect.height || element.offsetHeight;
}

/**
 * @method getWidth
 * @description
 * Gets the width of an element
 * @param {object} el The DOM or jqLite element to get width for
 * @returns {number} The width of the element
 */
export function getWidth(el) {
    const element = parseElement(el);
    const boundingClientRect = element.getBoundingClientRect();

    return boundingClientRect.width || element.offsetWidth;
}

/**
 *
 * @param el
 * @return {{height: number, width: number, offset: ({top, left}|*)}}
 */
export function get(el) {
    return {
        height: getHeight(el),
        width: getWidth(el),
        offset: getOffset(el)
    };
}

/**
 * @module dimensions
 * @description
 * Module for retrieving properties of a DOM element
 */
export default {
    get,
    getOffset,
    getHeight,
    getWidth
};
