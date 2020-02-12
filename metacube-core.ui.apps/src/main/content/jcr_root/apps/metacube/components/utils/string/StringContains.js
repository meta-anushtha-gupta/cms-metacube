"use strict";

/**
 * Helper JS Use-api script to determine whether string A (str) contains string B (strFragment)
 *
 * @usage <sly data-sly-use.strContains="${ '/apps/mb-nafta/components/utils/string/StringContains.js' @ str = string, strFragment = fragment }" />
 *
 * @param str - the string to search on
 * @param strFragment - the string fragment to search for
 */
use(function () {
    try{
        if (this.str && this.strFragment){
            return {
                str: this.str,
                strFragment: this.strFragment,
                match: this.str.indexOf(this.strFragment) !== -1
            }
        }
    } catch (e) {
        //console.error("ERROR: " + e);
    }
});
