
"use strict";

/**
 * Helper JS Use-api script to get the child count of given node
 * 
 * @usage <sly data-sly-use.ctas="${ '/apps/metacube/utility/GetChildCount.js' @ nodeName='jcr:content' }" />
 * 
 * @param nodeName name of node whose children count need to be calculated  
 */
use(["/libs/wcm/foundation/components/utils/AuthoringUtils.js"], function (AuthoringUtils) {
  
    return com.metacube.cms.core.utils.SlingResourceUtil.getChildrenCountRelative(resource, this.nodeName);

});
