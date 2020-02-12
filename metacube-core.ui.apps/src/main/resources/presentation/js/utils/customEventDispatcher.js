/**
 * Utility for Custom Events
 */

/**
 * @method createCustomEvent
 * @description Create a Custom Event
 * @param type {String} Custom Event name
 * @param initObj {Dictionary} Optional CustomEventInit dictionary ( accepts fields from EventInit)
 */
function createCustomEvent(type, initObj) {
    return new CustomEvent(type, initObj);
}

/**
 * @method addEventListener
 * @description Add an event listener for Custom Events
 * @param type {String} Custom Event name
 * @param callback {Function} Listener callback function
 */
function addEventListener(type, callback) {
    window.addEventListener(type, callback);
}


/**
 * @method removeEventListener
 * @description remove an event listener for Custom Events
 * @param type {String} Custom Event name
 * @param callback {Function} Listener callback function
 */
function removeEventListener(type, callback) {
    window.removeEventListener(type, callback);
}


/**
 * @method dispatchEvent
 * @description Event dispatcher
 * @param event {Custom Event} A custom Event
 */
function dispatchEvent(event) {
    window.dispatchEvent(event);
}

/**
 * @module renderer
 * @description Rendering content to the DOM
 */
export default {
    createCustomEvent,
    addEventListener,
    removeEventListener,
    dispatchEvent
};
