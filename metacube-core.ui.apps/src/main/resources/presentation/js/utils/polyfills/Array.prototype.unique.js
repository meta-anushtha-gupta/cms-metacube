/**
 * A polyfill to get unique values of an array
 * @refer: https://gist.github.com/telekosmos/3b62a31a5c43f40849bb
 */

/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
export default () => {
    if (!Array.prototype.unique) {
        Array.prototype.unique = function unique() {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            return this.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
        };
    }
};
