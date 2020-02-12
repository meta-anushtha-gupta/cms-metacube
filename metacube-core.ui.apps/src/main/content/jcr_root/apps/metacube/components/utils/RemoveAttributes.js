
"use strict";

/**
 * Utility for specific attributes form request by name
 * 
 * @usage <sly data-sly-use.attrs="${ '/apps/metacube/components/utils/RemoveAttributes.js' @ names = ['foo', 'bar'] }" />
 * 
 * @param names of attributes to be removed from request scope
 */
use(function () {
    var i, l;
    for (i = 0, l = this.names.length; i < l; i += 1) {
        request.removeAttribute(this.names[i]);
    }
});
