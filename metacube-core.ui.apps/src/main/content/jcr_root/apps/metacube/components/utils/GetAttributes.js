
"use strict";

/**
 * Return list of request attribute values by name.
 * 
 * @usage <sly data-sly-use.attrs="${ '/apps/metacube/components/utils/GetAttributes.js' @ names = ['foo', 'bar'] }" />
 * 
 * @param names list of request attribute names to return
 */
use(function () {
    var o = {}, i, l, name;
    for (i = 0, l = this.names.length; i < l; i += 1) {
        name = this.names[i];
        o[name] = request.getAttribute(name);
    }
    return o;
});