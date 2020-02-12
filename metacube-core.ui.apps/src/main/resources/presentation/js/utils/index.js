import Screen from './Screen';
import renderer from './renderer';
import ClickOutside from './ClickOutside';
import customEventDispatcher from './customEventDispatcher';
import DisableBodyScroll from './DisableBodyScroll';

export const screen = new Screen();
export dimensions from './dimensions';
export Touch from './Touch';
export {
    renderer,
    ClickOutside,
    customEventDispatcher,
    DisableBodyScroll
};

/**
 * easing - ease in out quad
 */
// easing functions http://goo.gl/5HLl8
export function easeInOutQuad(pT, b, c, d) {
    let t = pT;

    t /= d / 2;
    if (t < 1) {
        return c / 2 * t * t + b;
    }
    t -= 1;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

/**
 * easing - ease out quad
 */
// easing functions http://goo.gl/5HLl8
export function easeOutQuad(pT, b, c, d) {
    let t = pT;
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

/**
 * A function which measures the elements position on the page in
 * relation to the what the user can currently see on their screen
 * and returns a boolean value with `true` being that the element
 * is visible and `false` being that it is not visible.
 *
 * @param  {Object}  elem A DOM element
 * @return {Boolean} isVisible A boolean value with `true` representing that the element is visible
 */
export function isScrolledIntoView(elem) {
    const elementBounds = elem.getBoundingClientRect();
    return elementBounds.top < window.innerHeight && elementBounds.bottom >= 0;
}

/**
 * A function which measures the elements position on the page in
 * relation to the what the user can currently see on their screen
 * in the X axis when scrolling horizontally
 * and returns a boolean value with `true` being that the element
 * is visible and `false` being that it is not visible.
 *
 * @param  {Object}  elem A DOM element
 * @param  {Number}  offset Number to substract to the offsetWidth
 * @return {Boolean} isVisible A boolean value with `true` representing that the element is visible
 */
export function isScrolledIntoViewHorizontally(elem, offset = 0) {
    const elementBounds = elem.getBoundingClientRect();
    return elementBounds.left < (window.innerWidth - offset) && elementBounds.right >= offset;
}

/**
 * A function which measures the elements position on the page in
 * relation to top of the screen and returns a boolean value with
 * `true` being that the element has reached the top of viewport
 * and `false` being that it has not reached the top or is beneath
 * the viewport
 *
 * @param  {Object} elem A DOM element
 * @param {Number} [offset] An offset to subtract from the top of the elements position
 * @return {Boolean} isVisible A boolean value with `true` representing that the element is at top
 * of viewport
 */
export function isScrolledToTop(elem, offset = 0) {
    const elementBounds = elem.getBoundingClientRect();
    return elementBounds.top - offset <= 0;
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @param  {Function} func A function to call after N milliseconds
 * @param  {number} wait The number of milliseconds to wait
 * @param  {boolean} immediate Trigger the function on the leading edge instead of the trailing
 * @return {Function} A function, that, as long as it continues to be invoked, will not be triggered
 */
export function debounce(func, wait, immediate) {
    let timeout;
    return (...passedArgs) => {
        const context = this;
        const args = passedArgs;
        const later = () => {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}

/**
 * https://jsfiddle.net/jonathansampson/m7G64/
 * Allow callback to run at most 1 time per 100ms
 * window.addEventListener("resize", throttle(callback, 100));
 * Allow callback to run on each resize event
 * window.addEventListener("resize", callback2);
 *
 * function callback ()  { console.count("Throttled");     }
 * function callback2 () { console.count("Not Throttled"); }
 *
 * @method function
 * @param  {Function} callback The function that will be executed
 * @param  {Number}   limit    The time it will wait before excuting the callba again
 */
export function throttle(callback, limit) {
    let wait = false;                  // Initially, we're not waiting

    return (...args) => { // We return a throttled function
        if (!wait) { // If we're not waiting
            callback.apply(this, args); // Execute users function with conext and arguments
            wait = true; // Prevent future invocations
            setTimeout(() => { // After a period of time
                wait = false; // And allow future invocations
            }, limit);
        }
    };
}

/**
 * A function which animates to the provided location
 * @refer: https://gist.github.com/james2doyle/5694700
 */
export function scrollTo(to, pDuration, direction = 'vertical', element) {
    let duration = pDuration;
    return new Promise((resolve) => {
        let start = direction === 'horizontal' ? element.scrollLeft : window.pageYOffset;
        if (element && direction !== 'horizontal') {
            start = element.scrollTop;
        }
        const change = to - start;
        let currentTime = 0;
        const increment = 20;
        const animateScroll = () => {
             // increment the time
            currentTime += increment;
             // find the value with the quadratic in-out easing function
            let val = easeInOutQuad(currentTime, start, change, duration);

             // normalize the value to 0 if the ease returns Infinity || NaN
            if (Math.abs(val) === Infinity || window.isNaN(val)) {
                val = to;
            }

             // move the document.body
            if (direction === 'horizontal') {
                element.scrollLeft = val;
            } else if (element) {
                element.scrollTop = val;
            } else {
                window.scrollTo(0, val);
            }
             // do the animation unless its over
            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            } else {
                 // the animation is done so lets resolve promise
                resolve();
            }
        };

        duration = typeof duration === 'undefined' ? 500 : duration;
        animateScroll();
    });
}

/**
 * A function which finds the depth of the given element
 * relative to the element with the given id. A waypoint can
 * be provided to only count depth if parent has a certain classname
 *
 * @param {Node} e the element for which the depth should be calculated
 * @param {string} id the ID of the element relative to which the depth should be calculated
 * @param {string} [waypoint] a classname which will be used to count depth
 * @param {number} [cnt=0] Count
 */
export function getLevelDepth(e, id, waypoint, cnt) {
    let count = cnt || 0;
    if (e.id.indexOf(id) >= 0) {
        return count;
    }
    if (waypoint) {
        if (e.classList.contains(waypoint)) {
            count += 1;
        }
    } else {
        count += 1;
    }
    return e.parentNode && getLevelDepth(e.parentNode, id, waypoint, count);
}

/**
 * Generates a Unique identifier string with a prefix '_'
 * Combines the base36 value of current date and a random number
 *
 * @refer: https://gist.github.com/gordonbrander/2230317#gistcomment-1713405
 */
export function generateUniqueID() {
    return `_${Date.now().toString(36) + Math.random().toString(36).substr(2, 5)}`;
}

/**
 * Finds the closest ancestor element that has a specific class
 * @param element
 * @param selector
 * @returns {*}
 */
export function findAncestor(element, selector) {
    let el = element;

    do {
        el = el.parentElement;
    }
    while (el.parentElement && !el.matches(selector));

    if (!el.matches(selector)) {
        el = null;
    }

    return el;
}

/**
 *
 */
export function html(literalSections, ...substs) {
    return literalSections.raw.reduce((res, current, index) => {
        let result = res;
        result += current;
        if (Object.prototype.hasOwnProperty.call(substs, index)) {
            result += String(substs[index]);
        }
        return result;
    }, '');
}

/**
 * Tagged Template Literal
 * @returns {function} A function which when run with argument returns an HTML string or Element
 */
export function htmlNode(literalSections, ...substs) {
    return ({ getNode = false }) => {
        const combinedHTMLString = literalSections.raw.reduce((res, current, index) => {
            let result = res;
            result += current;
            if (Object.prototype.hasOwnProperty.call(substs, index)) {
                result += String(substs[index]);
            }
            return result;
        }, '');

        if (getNode) {
            return renderer.fromTemplate(combinedHTMLString.trim());
        }

        return combinedHTMLString;
    };
}

/**
 * Determines if an element is fixed to a specific position
 * @param element {Element} Element to test if is sticky
 * @param position {String} Enum value to test the position of the element
 *                          (top, right, bottom, left)
 */
export function isStickyElement(element, position = 'top') {
    const elmStyles = window.getComputedStyle(element, null);
    const isFixed = elmStyles.getPropertyValue('position') === 'fixed';
    const isPositioned = elmStyles.getPropertyValue(position) === '0px';

    return isFixed && isPositioned;
}

/**
 * No Operation function
 */
export const noop = () => ({});

/**
 * Serializes an object into a key/value string, each string being of the format key=value, and
 * separated by &
 * @param obj {Object} Input object which should be serialized
 * @return {String} Serialized string
 */
export function serializeObject(obj) {
    return Object.keys(obj).reduce((prev, next) => {
        if (obj[next]) {
            prev += `${next}=${obj[next]}&`;
        }

        return prev;
    }, '?').slice(0, -1);
}

/**
 * Converts a serialized string into an object.
 * @param objectString {String} Serialized object string
 * @return {Object} A deserialized object
 */
export function deserializeObject(objectString) {
    if (objectString) {
        const hashes = objectString.split('&');
        return hashes.reduce((params, hash) => {
            const [key, val] = hash.split('=');
            return Object.assign(params, { [key]: decodeURIComponent(val) });
        }, {});
    }
    return {};
}
