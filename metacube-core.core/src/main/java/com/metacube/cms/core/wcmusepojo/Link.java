package com.metacube.cms.core.wcmusepojo;


import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;
import com.metacube.cms.core.aem.CMSAEMConstants;
import com.metacube.cms.core.aem.utils.CMSContentPathUtil;

public class Link extends WCMUsePojo {

    private static final Logger log = LoggerFactory.getLogger(Link.class);

    protected static final String HTTP_PROTOCOL = "http://";
    protected static final String HTTPS_PROTOCOL = "https://";

    private static final String CONTENT_ROOT = "/content";
    private static final String DAM_ROOT = "/content/dam";


    private boolean external = false;
    private boolean asset = false;
    private String href;

    @Override
    public void activate() {

        String path = get("path", String.class);
        log.debug("incoming path: " + path);
        if (StringUtils.isNotEmpty(path)) {
            if (path.startsWith(CONTENT_ROOT) && !path.startsWith(DAM_ROOT)
                    && !(path.endsWith(CMSAEMConstants.HTML_EXT) || path.contains(CMSAEMConstants.HTML_EXT))) {
                href = CMSContentPathUtil.addHTMLToContentPath(path) ;
                log.debug("processed path by addHTMLToContentPath: " + path);
            }
            else {
                external = (path.startsWith(HTTP_PROTOCOL) || path.startsWith(HTTPS_PROTOCOL) || !(path.endsWith(CMSAEMConstants.HTML_EXT))) ;
                asset = path.startsWith(DAM_ROOT);
                href = path;
                log.debug("processed path by else: " + path);
            }
        }
    }

    public String getHref() {

        return href;
    }

    public boolean isExternal() {

        return external;
    }

    public boolean isAsset() {

        return asset;
    }
}