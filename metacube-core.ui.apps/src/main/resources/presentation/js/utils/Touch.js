// Constants
import { EVENTS } from 'Constants';

// Module dependencies
import {
    debounce,
    noop
} from 'utils';

/**
 * @class Touch
 * @description Utility class for creating an event listener on a dom element for touch events
 * and applying callbacks based on the swipe direction
 */
export default class Touch {
    /**
     * @constructor
     * @description On instantiation, sets the initial properties and creates method aliases
     * @param element {Element} DOM element to attach touch events to
     * @param threshold {Number} Swipe distance needed before executing a swipe event
     */
    constructor(element, threshold = 30) {
        // properties
        this.element = element; // ref to the element the Touch handler will be attached to
        this.threshold = threshold; // threshold to set the swipe distance to
        this.xCoordinate = null;
        this.yCoordinate = null;
        this.callbacks = [];

        // method aliases
        this.onTouchStartDebounce = debounce(this.onTouchStart.bind(this), 50);
        this.onTouchMoveDebounce = debounce(this.onTouchMove.bind(this), 50);
    }

    /**
     * @static EVENTS
     * @description Collection of swipe event types
     * @type {{SWIPE_UP: string, SWIPE_DOWN: string, SWIPE_LEFT: string, SWIPE_RIGHT: string}}
     */
    static EVENTS = {
        SWIPE_UP: 'swipeUp',
        SWIPE_DOWN: 'swipeDown',
        SWIPE_LEFT: 'swipeLeft',
        SWIPE_RIGHT: 'swipeRight'
    };

    /**
     * @static isTouch
     * @description Util method to determine if the device has touch support
     * @return {boolean|*}
     */
    static isTouch = () =>
        'ontouchstart' in window      // works on most browsers
        || navigator.maxTouchPoints;  // works on IE10/11 and Surface

    /**
     * @method on
     * @description Applies an event listener for a swipe direction
     * and applies a callback when triggered
     * @param swipeDirection {String} Touch.EVENTS type
     * @param callback {Function} Callback method to apply when event is triggered
     */
    on(swipeDirection, callback = noop) {
        this.callbacks.push({
            event: swipeDirection,
            callback,
        });

        this.element.addEventListener(
            EVENTS.TOUCHSTART, this.onTouchStartDebounce.bind(this)
        );
        this.element.addEventListener(
            EVENTS.TOUCHMOVE, this.onTouchMoveDebounce.bind(this)
        );
    }

    /**
     * @method off
     * @description Removes an event listener for a swipe direction and callback
     * @param swipeDirection {String} Touch.EVENTS type
     * @param callback {Function} Callback method to remove from listeners
     */
    off(swipeDirection, callback = noop) {
        if (this.callbacks.length) {
            this.callbacks.forEach((listener, index) => {
                if (listener.event === swipeDirection && listener.callback === callback) {
                    this.callbacks.splice(index, 1);
                }
            });
        }

        if (this.callbacks.length === 0) {
            this.element.removeEventListener(
                EVENTS.TOUCHSTART, this.onTouchStartDebounce.bind(this)
            );
            this.element.removeEventListener(
                EVENTS.TOUCHMOVE, this.onTouchMoveDebounce.bind(this)
            );
        }
    }

    /**
     * @method onTouchStart
     * @description Event handler for a touchstart event to set the x/y coordinates of the event
     * @param event {Event} Event object from touch event
     */
    onTouchStart(event) {
        const touches = event.touches[0];

        this.xCoordinate = touches.clientX;
        this.yCoordinate = touches.clientY;
    }

    /**
     * Swipe handler
     * @param {Event} event - a touchmove event
     */
    /**
     * @method onTouchMove
     * @description Event handler for a touchmove event to determine the direction of
     * the swipe and trigger a swipe callback with the corresponding direction
     * @param event
     */
    onTouchMove(event) {
        if (!this.xCoordinate && !this.yCoordinate) {
            return;
        }

        const touches = event.touches[0];
        const xDiff = this.xCoordinate - touches.clientX;
        const yDiff = this.yCoordinate - touches.clientY;
        const isSwipe = Math.abs(xDiff) >= this.threshold || Math.abs(yDiff) >= this.threshold;
        const isHorizontal = Math.abs(xDiff) >= Math.abs(yDiff) && Math.abs(yDiff) < this.threshold;

        // horizontal swipe
        if (isSwipe && xDiff < 0 && isHorizontal) this.applySwipe(Touch.EVENTS.SWIPE_LEFT);
        else if (isSwipe && xDiff > 0 && isHorizontal) this.applySwipe(Touch.EVENTS.SWIPE_RIGHT);

        // vertical swipe
        if (isSwipe && yDiff < 0 && !isHorizontal) this.applySwipe(Touch.EVENTS.SWIPE_UP);
        else if (isSwipe && xDiff > 0 && !isHorizontal) this.applySwipe(Touch.EVENTS.SWIPE_DOWN);

        // reset value
        this.xCoordinate = null;
        this.yCoordinate = null;
    }

    /**
     * @method applySwipe
     * @description Applies all callbacks that corresponding to the swipeDirection
     * @param swipeDirection {String} Direction of the swipe event
     */
    applySwipe(swipeDirection) {
        this.callbacks.forEach((listener) => {
            if (listener.event === swipeDirection) {
                listener.callback();
            }
        });
    }
}
