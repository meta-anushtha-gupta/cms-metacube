// Util dependencies
import Proxy from 'utils/Proxy';

/**
 * Factory for building a Proxy object for proxying setter/getter methods
 * and applying a callback property values have changed via `set`
 */
export default class StateProxy {
    /**
     * @constructor
     * @param state {Object} The object to proxy setter/getters for
     * @param callbackHandler {Function} Callback method to be applied when a property is set
     * @return {Proxy}
     */
    constructor(state, callbackHandler) {
        return StateProxy.buildProxy('', state, callbackHandler);
    }

    /**
     *
     * @param prefix {String} Prefix to apply to a new property (this is internal ONLY)
     * @param targetObj {Object} The base object to proxy properties for
     * @param handler {Function} The callback handler to call when properties are set
     * @return {Proxy}
     */
    static buildProxy(prefix, targetObj, handler) {
        return new Proxy(targetObj, {
            set(target, property, value) {
                const prevState = Object.assign({}, target);

                target[property] = value;
                handler(prevState, target);

                return true;
            },
            get(target, property) {
                // return a new proxy if possible, add to prefix
                const out = target[property];
                if (out instanceof Object) {
                    return StateProxy.buildProxy(`${prefix}${property}`, out, handler);
                }

                return out;  // primitive, ignore
            },
        });
    }
}
