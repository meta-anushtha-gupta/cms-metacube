package com.metacube.cms.core.wcmusepojo;


import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.metacube.cms.core.aem.CMSAEMConstants;


public class Redirect extends Link {

	private static final Logger log = LoggerFactory.getLogger(Redirect.class);

	private boolean failure = false;

	@Override
	public void activate() {

		super.activate();
		String redirectTarget = getHref();
		String currentPagePath = (getCurrentPage() != null) ? getCurrentPage().getPath() + CMSAEMConstants.HTML_EXT : "";
		if (getWcmMode().isDisabled()) { // preview/publish mode
			/*if (StringUtils.isEmpty(redirectTarget)) {// redirect target not set
				redirectTarget = getFallbackRedirectTarget();
			}*/
			if (StringUtils.isNotEmpty(redirectTarget) &&!redirectTarget.equals(currentPagePath)) {
				try {
					getResponse().setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY);
					getResponse().setHeader("Location", redirectTarget);
				} catch (Exception e) {
					log.error("Error" +e);
					getResponse().setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
					failure = true;
				}
			}
		}
	}

	public boolean isFailure() {
		return failure;
	}

}