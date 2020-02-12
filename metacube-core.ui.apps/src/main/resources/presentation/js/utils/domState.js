/**
 * @method onReady
 * @description Creates a callback to be applied when the DOM has completed loading the content
 * @param callback {Function} Method to apply when the DOM has loaded the page content
 */
function onReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

/**
 * @module domState
 * @description
 * Module for performing tasks based on the state of the DOM
 */
export default {
    onReady
};
