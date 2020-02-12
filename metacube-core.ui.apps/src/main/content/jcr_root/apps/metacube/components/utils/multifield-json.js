"use strict";

/**
 * Multifield Helper JS Use-api script (for json-based multifield storage)
 * 
 * @see http://j.mp/29ByR1y [touchui-composite-multifield.js]
 * 
 * @usage <sly data-sly-use.ctas="${
 * '/apps/metacube/components/utils/multifield-json.js' @ mfName='ctas' }" />
 * 
 * @param mfName
 *            node name containing the multifield
 */
use([ "/libs/wcm/foundation/components/utils/AuthoringUtils.js" ], function(
		AuthoringUtils) {

    var parsed = { items: [] }, toParse;
    var log = Packages.com.metcube.cms.core.utils.JSUtil.logger;
    
	try {
		if (this.mfName) {
			toParse = properties.get(this.mfName);

			if (toParse && (typeof toParse !== "undefined")) {
				if (toParse.constructor == Array) {
					toParse.forEach(function(item) {
						var itemParsed = JSON.parse(item);
						parsed.items.push(itemParsed);
					});
				}
				else if (toParse.constructor == String) {
					parsed.items.push(JSON.parse(toParse));
				}
			}
		}
	} catch (e) {
         log.trace("Error while parsing the JSON Multifield [" + this.mfName +"] of resource [" + resource.path + "]: " + e);
	}

	return parsed;

});