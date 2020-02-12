/**
 * A polyfill to flatten an array
 * @refer: https://gist.github.com/Integralist/749153aa53fea7168e7e#gistcomment-1457123
 */

/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
export default () => {
    if (!Array.prototype.flatten) {
        Array.prototype.flatten = function flatten() {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            return this.reduce(
                (a, b) => a.concat(Array.isArray(b) ? b.flatten() : b),
                []
            );
        };
    }
};
