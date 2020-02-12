'use strict'

use(function () {
	var log = Packages.com.mb.oneweb.core.utils.JSUtil.logger;

try{
if (this.param) {
    if(resource.getResourceResolver().getResource(this.param)){
		return true;
    }
return false;
}
}
catch (e) {
log.error("ERROR: " + e);
    }
});