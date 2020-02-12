import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { renderer, noop } from 'utils';

import Accordion from './../views/Accordion';
import { getAccordionItems } from './../api/accordionParser';

/**
 * @class AccordionComponent
 * @description React wrapper component for Accordion
 * @param disableSmall {boolean} Disables accordion on small
 * @param disableLarge {boolean} Disables accordion on large
 * @param expandAll {boolean} Expand all by default
 * @param expandMultiple {boolean} Ability to open multiple items at once
 * @param theme {string|Array} Adds class name accordion--theme (single or comma separated list)
 * @param themeSmall {string} same as theme for small devices only
 * @param themeLarge {string} same as theme for large devices only
 * @param accordionName {string} Will be used when generating unique identifier for each accordion
 * item
 * @param onBeforeOpen {function} Before open callback
 * @param onAfterOpen {function} After open callback
 * @param onBeforeClose {function} Before close callback
 * @param onAfterClose {function} After close callback
 * @param labelCollapse {string} Collapse label
 * @param labelExpand {string} Expand label
 */
class AccordionComponent extends Component {
    constructor(props, context) {
        super(props, context);

        this.accordion = null;
    }

    /**
     * @method componentDidMount
     * @description When component mounts, and it has children, create accordion
     */
    componentDidMount() {
        if (this.props.children) {
            this.createAccordion();
        }
    }

    /**
     * @method componentDidUpdate
     * @description When component updates, destroy existing accordion and create new instance
     */
    componentDidUpdate(prevProps) {
        if (!prevProps.children.length && this.props.children.length) {
            this.destroyAccordion();
            this.createAccordion();
        }
    }

    /**
     * @method componentWillUnmount
     * @description Destroy accordion when component unmounts
     */
    componentWillUnmount() {
        this.destroyAccordion();
    }

    /**
     * @method createAccordion
     * @description Queries for data-accordion-item, and uses the items to create a new instance of
     * accordion
     */
    createAccordion() {
        const accordionItems = getAccordionItems(this.accordionContainer);

        if (accordionItems) {
            this.accordion = new Accordion(accordionItems, {
                disableSmall: this.props.disableSmall,
                disableLarge: this.props.disableLarge,
                expandAll: this.props.expandAll,
                expandMultiple: this.props.expandMultiple,
                theme: this.props.theme,
                themeSmall: this.props.themeSmall,
                themeLarge: this.props.themeLarge,
                accordionName: this.props.accordionName,
                onBeforeOpen: this.props.onBeforeOpen,
                onAfterOpen: this.props.onAfterOpen,
                onBeforeClose: this.props.onBeforeClose,
                onAfterClose: this.props.onAfterClose,
                classList: this.props.className && this.props.className.split('') || [],
                labelCollapse: this.props.labelCollapse,
                labelExpand: this.props.labelExpand
            });

            renderer.insert(this.accordion.render(), this.accordionContainer);
        }
    }

    /**
     * @method destroyAccordion
     * @description Destroys the current instance of accordion
     */
    destroyAccordion() {
        if (this.accordion) {
            this.accordion.destroy();
        }
    }

    collapseAllItems() {
        if (this.accordion) {
            this.accordion.collapseAllItems();
        }
    }

    /**
     * @method render
     * @description Renders accordion component
     */
    render() {
        return (
            <div ref={(accordionContainer) => { this.accordionContainer = accordionContainer; }}
                data-accordion="">
                {this.props.children}
            </div>
        );
    }
}

/**
 * @property propTypes
 * @description Defined properties for component
 * @type {{disableSmall, disableLarge, expandAll, expandMultiple, theme, accordionName,
 * onBeforeOpen, onAfterOpen, onBeforeClose, onAfterClose, labelCollapse, labelExpand,
 * themeSmall, themeLarge}}
 */
AccordionComponent.propTypes = {
    disableSmall: PropTypes.bool,
    disableLarge: PropTypes.bool,
    expandAll: PropTypes.bool,
    expandMultiple: PropTypes.bool,
    theme: PropTypes.string,
    themeSmall: PropTypes.string,
    themeLarge: PropTypes.string,
    accordionName: PropTypes.string,
    onBeforeOpen: PropTypes.func,
    onAfterOpen: PropTypes.func,
    onBeforeClose: PropTypes.func,
    onAfterClose: PropTypes.func,
    labelCollapse: PropTypes.string,
    labelExpand: PropTypes.string
};

/**
 * @property defaultProps
 * @description Default properties for component
 * @type {{disableSmall: bool, disableLarge: bool, expandAll: bool, expandMultiple: bool,
 * theme: string, accordionName: string, onBeforeOpen: func, onAfterOpen: func,
 * onBeforeClose: func, onAfterClose: func, labelCollapse: string, labelExpand: string,
 * themeSamll: string, themeLarge: string}}
 */
AccordionComponent.defaultProps = {
    disableSmall: false,
    disableLarge: false,
    expandAll: false,
    expandMultiple: true,
    theme: '',
    themeSmall: '',
    themeLarge: '',
    accordionName: '',
    labels: {
        collapseAll: 'Collapse All',
        expandAll: 'Expand All'
    },
    onBeforeOpen: noop,
    onAfterOpen: noop,
    onBeforeClose: noop,
    onAfterClose: noop
};

export default AccordionComponent;
