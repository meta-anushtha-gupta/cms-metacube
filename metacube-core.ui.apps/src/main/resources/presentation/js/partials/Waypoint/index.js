/**
 * Waypoint JS module
 * A waypoint is an element that triggers a callback when
 * that element reaches the top of the page
 * It can be instantiated by passing in the element. It also
 * accepts an optional callback
 */
import { generateUniqueID as ID } from 'utils';
import Adapter from './Adapter';

const defaultCallback = () => {};

export default class Waypoint {
    /**
     * consructor
     * @param {Node} element - The element for which a waypoint needs to be created
     * @param {Object} option - The options object
     * @param {function} option.callback - Callback function that needs to be called when waypoint
     * is reached
     * @param {function} option.inactiveCallback - Callback function that gets called when
     * no waypoint is reached
     * @param {boolean} shouldRecacheDom - Whether to call Adapter cacheDom function
     * @param {function} offsetOption - Function to set offset height
     */
    constructor(element,
                { callback = defaultCallback, inactiveCallback = defaultCallback } = {},
                shouldRecacheDom, offsetOption = defaultCallback) {
        if (!element) {
            throw new Error('No element passed to Waypoint');
        }

        this.element = element;
        this.callback = callback.bind(this, this.element);
        this.inactiveCallback = inactiveCallback.bind(this, this.element);
        this.ID = ID();

        this.init();

        if (shouldRecacheDom) {
            Adapter.cacheDOM();
        }

        if (typeof offsetOption === 'function') {
            Adapter.setOffset(offsetOption.bind(this, this.element));
        }
    }

    /**
     * Init method
     * Adds the current waypoint to adapter
     */
    init() {
        Adapter.addWaypoint(this);
    }
}
