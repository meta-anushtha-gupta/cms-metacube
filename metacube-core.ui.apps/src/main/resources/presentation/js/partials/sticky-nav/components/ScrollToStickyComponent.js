// Library dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Local dependencies
import ScrollToSticky from './../views/ScrollToSticky';

/**
 * @class ScrollToStickyComponent
 * @description React component for displaying an element as a ScrollToSticky view
 *
 * Note: this is a wrapper to the ScrollToSticky view to interface with React components
 *
 * @param absoluteAtFooter {Boolean} Flag to set the nav as absolute when it reaches the footer
 * @param offsetElement {Element} Element to offset te sticky element from
 * @param disableBorder {Boolean} Flag to disable the border of the sticky element
 */
class ScrollToStickyComponent extends Component {
    /**
     * @constructor
     * @description On instantiation, sets the property references
     * @param props
     * @param context
     */
    constructor(props, context) {
        super(props, context);

        this.scrollToStickyElm = null; // reference to the sticky nav element
        this.scrollToSticky = null;  // reference to the ScrollToSticky instance
    }

    /**
     * @method componentDidMount
     * @description When the component mounts, instantiate a ScrollToSticky view
     */
    componentDidMount() {
        this.scrollToSticky = new ScrollToSticky(
            this.scrollToStickyElm,
            {
                offsetElement: this.props.offsetElement,
                disableBorder: this.props.disableBorder,
                absoluteAtFooter: this.props.absoluteAtFooter
            }
        );
    }

    /**
     * @method componentWillUnmount
     * @description When the component unmounts, destroy the scrollToSticky
     */
    componentWillUnmount() {
        if (this.scrollToSticky) {
            this.scrollToSticky.destroy();
            this.scrollToSticky = null;
        }
    }

    /**
     * @method render
     * @description Renders a ScrollToSticky view
     * @return {XML}
     */
    render() {
        return (
            <div className="sticky-nav"
                 ref={(elm) => { this.scrollToStickyElm = elm; }}>
                <div className="sticky-nav__container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

/**
 * @property defaultProps
 * @description Default properties for component
 * @type {{absoluteAtFooter: boolean, disableBorder: boolean}}
 */
ScrollToStickyComponent.defaultProps = {
    absoluteAtFooter: false,
    disableBorder: false
};

/**
 * @property propTypes
 * @description Property types for component
 * @type {{absoluteAtFooter: *, offsetElement: *, disableBorder: *}}
 */
ScrollToStickyComponent.propTypes = {
    absoluteAtFooter: PropTypes.bool,
    offsetElement: PropTypes.object,
    disableBorder: PropTypes.bool
};

// export React component
export default ScrollToStickyComponent;
