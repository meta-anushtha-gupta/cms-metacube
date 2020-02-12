"use strict";

/**
 * Helper JS Use-api script to determine whether string A (str) contains string B (strFragment)
 *
 * @usage <sly data-sly-use.strInsert="${ '/apps/metacube/components/utils/string/StringContains.js' @ str = string, strFragment = fragment }" />
 *
 * @param str - the string to search on
 * @param strFragment - the string fragment to search for
 * @param index - the position where the string fragment to be inserted
 */
use(function () {
    try{
        if (this.str && this.strFragment && this.index){
            return {
                str: this.str,
                strFragment: this.strFragment,
                index: this.index,
                result: this.str.substring(0, this.index) + this.strFragment + this.str.substring(this.index)
            }
        }
    } catch (e) {
        //console.error("ERROR: " + e);
    }
});
