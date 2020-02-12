package com.metacube.cms.core.servlets.editorial;


import java.awt.BasicStroke;
import java.awt.Color;
import java.io.IOException;

import javax.jcr.Item;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.commons.ImageHelper;
import com.day.image.Layer;

/**
 * Image Placeholder Servlet
 *
 */
@Component(service = Servlet.class, property = {
Constants.SERVICE_DESCRIPTION + "=[CAM] - Image Placeholder Servlet",
ServletResolverConstants.SLING_SERVLET_PATHS + "=/bin/metacube/image-placeholder",
ServletResolverConstants.SLING_SERVLET_METHODS + "=GET" })

public class ImagePlaceholderServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = -5188953830116669794L;

    private final String PARAM_IMAGE_URL = "url";
    private final String PARAM_IMAGE_SIZE = "size";
    private final String PARAM_INVERSE = "inverse";
    
    private final int DEFAULT_HEIGHT = 100;
    private final int DEFAULT_WIDTH = 100;
    private final String DEFAULT_PLACEHOLDER = "/etc/designs/default/0.gif";

    @SuppressWarnings("unused")
    private static final Logger logger = LoggerFactory.getLogger(ImagePlaceholderServlet.class);

    /**
     * {@inheritDoc}
     */
    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws ServletException, IOException {

        doExecute(request, response);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws ServletException, IOException {

        doExecute(request, response);
    }

    /**
     * Execute servlet request generically for GET/POST
     *
     * @param request the http request
     * @param response the http response
     */
    private void doExecute(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws ServletException, IOException {

        if (request instanceof SlingHttpServletRequest
                && response instanceof SlingHttpServletResponse) {

            ResourceResolver resourceResolver = request.getResourceResolver();
            
            String imageURL = request.getParameter(PARAM_IMAGE_URL);
            String size = request.getParameter(PARAM_IMAGE_SIZE);
            boolean inverse = StringUtils.isNotEmpty(request.getParameter(PARAM_INVERSE));
            
            Layer imageLayer = null;
            Dimensions dimensions = new Dimensions(size);

            if (imageURL != null) {
                Resource resource = resourceResolver.getResource(imageURL);
                
                if (resource != null) {
                    imageLayer = getImageLayer(resource, dimensions);
                }
                else {
                    Session session = (Session) request.getResourceResolver().adaptTo(Session.class);
                    
                    try {
                        Item imageItem = session.getItem(imageURL);
                        imageLayer = getImageLayer(imageItem, dimensions);
                    }
                    catch (Exception e) {
                        resource = resourceResolver.getResource(DEFAULT_PLACEHOLDER);
                        
                        if (resource != null) {
                            imageLayer = getImageLayer(resource, dimensions);
                        }
                    }
                }
            }
            else {
                imageLayer = createEmptyLayer(dimensions, inverse);
            }
            
            imageLayer.write(imageLayer.getMimeType(), 0.5, response.getOutputStream());
            
            response.flushBuffer();
        }
    }

    private Layer getImageLayer(Resource resource, Dimensions dimensions) {
        Layer imageLayer = ImageHelper.createLayer(resource);
        
        resizeLayer(imageLayer, dimensions);
        
        return imageLayer;
    }

    private Layer getImageLayer(Item itemNode, Dimensions dimensions) throws RepositoryException, IOException {
        Layer imageLayer = ImageHelper.createLayer(itemNode);
        
        resizeLayer(imageLayer, dimensions);
        
        return imageLayer;
    }

    private Layer createEmptyLayer(Dimensions dimensions, boolean inverse) {

        Color bg = inverse ? Color.DARK_GRAY : Color.WHITE;
        Color x = inverse ? Color.WHITE : Color.BLACK;
        Layer bgLayer = null;
        
        if (dimensions != null) {
            bgLayer = new Layer(dimensions.width, dimensions.height, bg);
        }
        else {
            bgLayer = new Layer(DEFAULT_WIDTH, DEFAULT_HEIGHT, bg);
        }
        
        BasicStroke solid = new BasicStroke(1.0f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_MITER);
        
        bgLayer.setStroke(solid);
        bgLayer.setPaint(x);
        bgLayer.drawLine(0, 0, bgLayer.getWidth(), bgLayer.getHeight());
        bgLayer.drawLine(bgLayer.getWidth() - 1, 0, 0, bgLayer.getHeight() - 1);
        
        return bgLayer;
    }

    private Layer resizeLayer(Layer imageLayer, Dimensions dimensions) {

        if ((dimensions != null) && (imageLayer != null) && 
                (imageLayer.getHeight() != dimensions.height || imageLayer.getWidth() != dimensions.width)) {
            
            imageLayer.resize(dimensions.height, dimensions.width);
        }
        
        return imageLayer;
    }

    class Dimensions {

        int height = DEFAULT_HEIGHT;
        int width = DEFAULT_WIDTH;

        public Dimensions(int heigth, int width) {
            this.height = heigth;
            this.width = width;
        }

        public Dimensions(String size) {

            if (size != null) {
                String[] parts = size.toLowerCase().split("x");
                
                if (parts.length == 2) {
                    this.width = Integer.parseInt(parts[0]);
                    this.height = Integer.parseInt(parts[1]);
                }
            }
        }
    }
}
