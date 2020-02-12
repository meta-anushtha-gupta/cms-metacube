package com.metacube.cms.core.aem.utils;


import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.commons.Externalizer;
import com.day.cq.commons.jcr.JcrConstants;
import com.metacube.cms.core.aem.CMSAEMConstants;

/**
 * Util functions to create content paths
 * 
 * @author 
 *
 */
public class CMSContentPathUtil {

	private static final Logger log = LoggerFactory.getLogger(CMSContentPathUtil.class);
	
    private static final String HTML_EXT = CMSAEMConstants.HTML_EXT;

    private static final String CONTENT_ROOT = "/content";
	
    private static String DEFAULT_DAM_PATH = CMSContentPathUtil.addToContentPath(CMSAEMConstants.ROOT_CONTENT_CONTEXT,
			CMSAEMConstants.DEFAULT_DAM_CONTEXT);
	private static final String DAM_ROOT = DEFAULT_DAM_PATH;



	/**
	 * Create base site content path
	 */
	public static String createContentSiteBasePath(String siteBase, String country, String lang) {

		return addToContentPath(siteBase, lang + "_" + country);
	}

	/**
	 * Create base dam path
	 */
	public static String createDAMBasePath(String damBase, String country, String lang) {

		return addToContentPath(damBase, lang + "_" + country);
	}




	/**
	 * Add to given path
	 * 
	 * @param basePath
	 * @param addTo
	 * @return
	 */
	public static String addToContentPath(String basePath, String addTo) {

		if (basePath != null && (!basePath.startsWith("/") && !basePath.startsWith("http://") && !basePath.startsWith("https://"))) {
			basePath = "/" + basePath;
		}

		return (basePath != null && addTo != null && !basePath.endsWith("/") && !addTo.startsWith("/"))
				? basePath + "/" + addTo : basePath + addTo;
	}
	
	
	public static String addToContentPath(String basePath, String...addTos) {

		if (basePath != null && (!basePath.startsWith("/") && !basePath.startsWith("http://") && !basePath.startsWith("https://"))) {
			basePath = "/" + basePath;
		}

		String appendPath="";
		for(String addTo:addTos)
		{
			appendPath= (addTo != null && !appendPath.endsWith("/") && !addTo.startsWith("/"))
				? appendPath + "/" + addTo : appendPath + addTo;
		}
		
		return (basePath != null && appendPath != null && !basePath.endsWith("/") && !appendPath.startsWith("/"))
				? basePath + "/" + appendPath : basePath + appendPath;
	}

	/**
	 * Create external link using externalizer
	 * 
	 * @param resolver
	 * @param externalizer
	 * @param externalizerContext
	 * @param resourcePath
	 * @return
	 */
	public static String getExternalLink(ResourceResolver resolver, Externalizer externalizer,
			String externalizerContext, String resourcePath) {

		try {
			return externalizer.externalLink(resolver, externalizerContext, resourcePath) + ".html";
		} catch (Exception e) {
			log.error("Error while external Link.External Context:" + externalizerContext, e);
		}
		return null;
	}

	/**
	 * Method to add html extension to content path
	 * @param contentPath
	 * @return
	 */
	public static String addHTMLToContentPath(String path) {
		String href = null;
		if (StringUtils.isNotEmpty(path)) {
			if (path.startsWith(CONTENT_ROOT) && !path.startsWith(DAM_ROOT)
					&& !(path.endsWith(HTML_EXT) || path.contains(HTML_EXT))) {
				if (path.contains("?")) {
					href = StringUtils.substringBefore(path, "?") + CMSAEMConstants.HTML_EXT
							+ path.substring(path.indexOf("?"), path.length());
				} else if (path.contains("#")) {
					href = StringUtils.substringBefore(path, "#") + CMSAEMConstants.HTML_EXT
							+ path.substring(path.indexOf("#"), path.length());
				} else {
					if (path.endsWith(JcrConstants.JCR_CONTENT)) {
						path = StringUtils.substringBefore(path, "/" + JcrConstants.JCR_CONTENT);
					}
					href = path + CMSAEMConstants.HTML_EXT;
				}
			} else {
				href = path;
			}
		}
		return href;
	}

	
	/**
	* Utility to convert content path to editorial path
	* @param contentPath content path
	* @return editorial path
	*/
	public static String toEditorialPath(String contentPath) {
		return "/editor.html" + addHTMLToContentPath(contentPath) + "?wcmmode=edit";
	}
	
	

}