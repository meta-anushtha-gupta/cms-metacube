
"use strict";

/**
 * Image helper
 * 
 * @usage <sly data-sly-use.image="${ '/apps/metacube/components/utils/image.js' @ imagePath='image', rPath=(optional) }" />
 * 
 * @param imagePath relative path to image resource node
 */
use(["/libs/wcm/foundation/components/utils/AuthoringUtils.js",
     "/libs/sightly/js/3rd-party/q.js"], function (AuthoringUtils, Q) {

	var image = {};

    var imagePath = this.imagePath;
	var contentPath = this.rPath ? this.rPath : granite.resource.path;
	
    var imageDefer = Q.defer();
    granite.resource.resolve(contentPath + '/' + imagePath).then(function (imageResource) {
        if (imageResource.properties["fileReference"]) {
        	image.path = imageResource.properties["fileReference"];
        	imageDefer.resolve(true);
        } else {
        	granite.resource.resolve(contentPath + '/' + imagePath + "/file").then(function (localImage) {
            	image.path = localImage.path;
            	imageDefer.resolve(true);
            }, function () {
            	imageDefer.resolve(false);
            });
        }
    }, function () {
    	imageDefer.resolve(false);
    });
    
    image.hasContent = imageDefer.promise;
	
	return image;
    
});
