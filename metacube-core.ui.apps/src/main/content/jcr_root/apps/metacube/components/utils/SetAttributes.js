
"use strict";

/**
 * Set request attributes for all passed params
 * 
 * @usage <sly data-sly-use.attrs="${ '/apps/metacube/components/utils/SetAttributes.js' @ foo = 1, bar = 2 }" />
 * 
 * @param all name/value pairs to set in the request scope
 */
use(function () {
    var i;
    for (i in this) {
        request.setAttribute(i, this[i]);
    }
});