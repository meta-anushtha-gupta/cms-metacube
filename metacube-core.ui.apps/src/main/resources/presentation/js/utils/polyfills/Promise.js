import Promise from 'promise';

/**
 * A polyfill to support Promise if it is not native to the browser
 */
export default () => {
    if (!window.Promise) {
        window.Promise = Promise;
    }
};
