
"use strict";

/**
 * Helper JS Use-api script to get the child count of given node
 * 
 * @usage <sly data-sly-use.ctas="${ '/apps/metacube/components/utils/GetChildCount.js' @ nodeName='media-container' }" />
 * 
 * @param nodeName name of node whose children count need to be calculated  
 */
use(["/libs/wcm/foundation/components/utils/AuthoringUtils.js"], function (AuthoringUtils) {

    return Packages.com.mb.metacube.core.utils.SlingResourceUtil.getChildrenCountRelative(resource, this.nodeName);

});
