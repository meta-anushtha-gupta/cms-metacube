/**
 * @method fromTemplate
 * @description
 * Converts an HTML element string to a DOM object
 *
 * @param {String} templateString String representation of a DOM element (e.g. '<div>content</div>')
 *
 * @returns {Node}
 */
function fromTemplate(templateString) {
    const el = document.createElement('div');
    el.innerHTML = templateString;

    // If there are multiple child nodes return the wrapped elements in a div
    if (el.childNodes.length > 1) {
        return el;
    }

    return el.firstChild;
}

/**
 * @method empty
 * @description Empties all of the inner elements from an element
 * @param element {Node} Element to empty
 */
function empty(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * @method insert
 * @description
 * Replaced the inner content of an element with a new node
 *
 * @param {Node} node The DOM node element to insert
 * @param {Node} toElement The DOM node element to insert node into
 *
 * @returns {Node}
 */
function insert(node, toElement) {
    // dump the inner nodes before appending new content
    empty(toElement);

    // append the new node
    toElement.appendChild(node);

    return toElement;
}

/**
 * @method append
 * @description
 * Append a node to an element
 *
 * @param {Node} node The DOM node element to insert
 * @param {Node} toElement The DOM node element to insert node into
 *
 * @returns {Node}
 */
function append(node, toElement) {
    // append the new node
    toElement.appendChild(node);

    return toElement;
}

/**
 * @method prepend
 * @description
 * Prepend a node to an element
 *
 * @param {Node} node The DOM node element to insert
 * @param {Node} toElement The DOM node element to insert node into
 *
 * @returns {Node}
 */
function prepend(node, toElement) {
    toElement.insertBefore(node, toElement.firstChild);

    return toElement;
}

/**
 * @method insertBefore
 * @description
 * Insert a node to an element, before another element
 *
 * @param {Node} node The DOM node element to insert
 * @param {Node} toElement The DOM node element to insert node into
 * @param {Node} afterElement The DOM node element to insert node before
 *
 * @returns {Node}
 */
function insertBefore(node, toElement, afterElement) {
    toElement.insertBefore(node, afterElement);

    return toElement;
}

/**
 * @module renderer
 * @description
 * Module for rendering content to the DOM
 *
 */
export default {
    fromTemplate,
    insert,
    empty,
    prepend,
    append,
    insertBefore
};
