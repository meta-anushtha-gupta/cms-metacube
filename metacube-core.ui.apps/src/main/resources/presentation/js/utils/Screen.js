import { debounce } from 'utils';
import { EVENTS } from 'Constants';

/**
 * @const DEFAULTS
 * @type {Object}
 * @description Collection of constant default values
 */
const DEFAULTS = {
    DEBOUNCE_LENGTH: 10
};

class Screen {
    constructor() {
        this.listeners = [];
        this.addedDebounceTimeouts = {};
        this.state = {
            inited: false
        };

        this.init();
    }

    init() {
        if (!this.state.inited) {
            this.state.tests = [
                {
                    name: 'small',
                    className: 'screen-small-test'
                },
                {
                    name: 'large',
                    className: 'screen-large-test'
                },
                {
                    name: 'xlarge',
                    className: 'screen-xlarge-test'
                }
            ].map((obj) => {
                const item = obj;
                item.elm = window.document.createElement('div');
                item.elm.className = item.className;
                window.document.body.appendChild(item.elm);
                return item;
            });
        }

        this.state.inited = true;
    }

    getState() {
        // for when viewport is needed...
        // const w = window,
        //     d = document,
        //     e = d.documentElement,
        //     g = d.getElementsByTagName('body')[0],
        //     x = w.innerWidth || e.clientWidth || g.clientWidth,
        //     y = w.innerHeight|| e.clientHeight|| g.clientHeight;

        const ret = {
            // screen: window.screen,
            // viewport: {
            //     width: x,
            //     height: y
            // }
        };

        this.state.tests.forEach((test) => {
            const display = test.elm.currentStyle ? test.elm.currentStyle.display :
                window.getComputedStyle(test.elm, null).display;
            ret[test.name] = (display !== 'none');
        });
        ret.fullscreen = Boolean(this.isFullscreen());
        ret.viewport = {
            w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        };
        return ret;
    }

    /**
     * @method getCurrentState
     * @description Get cuurent responsive state
     * @returns {Object} Booleans for small, large, xlarge, and fullscreen
     */
    getCurrentState() {
        const screen = Object.keys(this.getState()).filter((state) => {
            const currentScreen = this.getState()[state];
            return currentScreen;
        });
        // there will only be one screen
        return screen[0];
    }

    onResize() {
        const state = this.getState();

        console.info(state);

        this.listeners.forEach((listener) => {
            try {
                listener(state);
            } catch (error) {
                console.error(error);
            }
        });
    }

    /**
     * @method addResizeListener
     * @description Add a listener to window.resize events
     * @param {Function} fn Callback function
     * @param {number} [debounceTimeout] Optional debounce timeout length
     */
    addResizeListener(fn, debounceTimeout) {
        this.listeners.push(fn);
        const dto = (debounceTimeout || DEFAULTS.DEBOUNCE_LENGTH).toString();

        if (!this.addedDebounceTimeouts[dto]) {
            window.addEventListener(
                EVENTS.RESIZE,
                debounce(this.onResize.bind(this), Number(dto))
            );
            this.addedDebounceTimeouts[dto] = true;
        }
    }

    /**
     * @method removeResizeListener
     * @description Remove a registered listener to window.resize events
     * @param {Function} fn Callback function
     */
    removeResizeListener(fn) {
        this.listeners = this.listeners.filter((listener) => {
            const test = listener !== fn;
            return test;
        });
    }

    /**
     * @method isRetina
     * @description Test for retina display
     * @returns {Boolean}
     */
    isRetina() {
        console.log(this);
        return window.devicePixelRatio && window.devicePixelRatio > 1;
    }

    /**
     * @method isFullscreen
     * @description Test for fullscreen mode
     * @returns {FullscreenElement} DOM Element
     */
    isFullscreen() {
        console.log(this);
        return document.fullscreenElement ||
               document.webkitFullscreenElement ||
               document.mozFullScreenElement ||
               document.msFullscreenElement;
    }
}

export default Screen;
