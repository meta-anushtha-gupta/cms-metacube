// Library dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @class ViewMoreComponent
 * @description A component for creating and displaying a ViewMore view.
 * Requires child ViewMoreItem components which will be parsed to perform the view more logic.
 * @param {Object} config - Configuration Data
 */
class ViewMoreComponent extends Component {
    /**
     * @constructor
     * @description On instantiation, sets the function aliases and default component state
     * @param props
     * @param context
     */
    constructor(props, context) {
        super(props, context);

        this.renderViewMoreItem = this.renderViewMoreItem.bind(this);
        this.renderCTA = this.renderCTA.bind(this);

        this.state = {
            currentVisibleSections: props.config.initialSections
        };
    }

    /**
     * @method componentDidMount
     * @description React lifecycle method afte component is mounted.
     * Validates the view more item children.
     */
    componentDidMount() {
        this.validateViewMoreItems();
    }

    /**
     * @method componentDidUpdate
     * @description React component update lifecycle method.
     * If the # of child node changes, set the currentVisibleSections state property to the lesser
     * of new child count and initialSections config. This is so that if the # of new child nodes
     * is less than initialSections, the loadMore CTA can be hidden, and vice versa.
     */
    componentDidUpdate(prevProps) {
        const {
            children: {
                length: childCount
            },
            config: {
                initialSections
            }
        } = this.props;


        if (prevProps.children.length !== childCount) {
            this.setState({
                currentVisibleSections: Math.min(childCount, initialSections)
            });
        }
    }

    /**
     * @method validateViewMoreItems
     * @description Iterates through the component children and validates that each is a
     * ViewMoreItem component
     */
    validateViewMoreItems() {
        React.Children.forEach(this.props.children, (child) => {
            if (!this.validateViewMoreItem(child)) {
                console.warn('All children of a ViewMore must be a ViewMoreItem component.');
            }
        });
    }

    /**
     * @method validateViewMoreItems
     * @description Validates that the child component is a ViewMoreItem component
     * @param {Object} child - ViewMoreItem component
     * @return {Boolean} True if the child type is ViewMoreItem
     */
    validateViewMoreItem(child) {
        return child.type && child.type.displayName === 'ViewMoreItemComponent';
    }

    /**
     * @method renderViewMoreItem
     * @description Renders the ViewMoreItem component
     */
    renderViewMoreItem(viewMoreItem, index) {
        if (!this.validateViewMoreItem(viewMoreItem)) {
            return null;
        }

        if (this.state.currentVisibleSections > index) {
            return viewMoreItem;
        }

        return null;
    }

    /**
     * @method onClick
     * @description Click handler for the view more CTA. This sets the state property
     * currentVisibleSections with additional more sections count
     * @param {Boolean} loadMore - true if should load more, false to show less
     */
    onClick(loadMore) {
        const {
            config: {
                initialSections,
                moreSections
            }
        } = this.props;
        const { currentVisibleSections } = this.state;
        const newVisibleSections = loadMore ? currentVisibleSections + moreSections : initialSections;

        this.setState({
            currentVisibleSections: newVisibleSections
        });
    }

    /**
     * @method renderCTA
     * @description Renders the CTA. Also has logic to show the appropriate label based on the
     * remaining number of items to display.
     * @param {Boolean} loadMore - true if should load more, false to show less
     */
    renderCTA(loadMore) {
        const {
            children: {
                length: childCount
            },
            config: {
                disableViewLess,
                initialSections,
                moreSections,
                labels
            }
        } = this.props;

        if ((childCount <= initialSections) || (!loadMore && disableViewLess)) {
            return null;
        }

        let ctaLabel = labels.viewLess;

        if (loadMore) {
            // If there are only less than the configured moreSection items left, show View All label,
            // else show View More
            ctaLabel = ((childCount - this.state.currentVisibleSections) > moreSections) ?
                labels.viewMore : labels.viewAll;
        }

        return (
            <div className="view-more-cta__container">
                <button
                    className="view-more-cta view-more-cta--visible"
                    onClick={this.onClick.bind(this, loadMore)}
                    data-analytics-trigger="cta">
                    <span data-view-more-label>
                        {ctaLabel}
                    </span>
                    <span className="icon-mb"></span>
                </button>
            </div>
        );
    }

    /**
     * @method renderSections
     * @description Renders a div element with React children inside
     * @return {XML}
     */
    renderSections() {
        return (
            <div className="view-more__sections">
                {React.Children.map(this.props.children, this.renderViewMoreItem)}
            </div>
        );
    }

    /**
     * @method renderUL
     * @description Renders a ul element with React children inside
     * @return {XML}
     */
    renderUL() {
        return (
            <ul className="view-more__sections">
                {React.Children.map(this.props.children, this.renderViewMoreItem)}
            </ul>
        );
    }

    /**
     * @method render
     * @description Renders ViewMore element
     * @return {XML}
     */
    render() {
        const { config } = this.props;
        const loadMore = this.props.children.length > this.state.currentVisibleSections;

        return (
            <div className="view-more">
                {config.displayUL ? this.renderUL() : this.renderSections()}
                {this.renderCTA(loadMore)}
            </div>
        );
    }
}

/**
 * @property propTypes
 * @description Property types for component
 * @type {{config: *}}
 */
ViewMoreComponent.propTypes = {
    config: PropTypes.object
};


/**
 * @property defaultProps
 * @description Default properties for component
 * @type {{
 *   config: {
 *     disableViewLess,
 *     displayUL,
 *     initialSections,
 *     labels: {
 *       viewMore,
 *       viewLess,
 *       viewAll
 *     }
 *   }
 * }}
 */
ViewMoreComponent.defaultProps = {
    config: {
        disableViewLess: true,
        displayUL: false,
        initialSections: 3,
        labels: {
            viewMore: 'View More',
            viewLess: 'View Less',
            viewAll: 'View All'
        },
        moreSections: 2
    }
};

export default ViewMoreComponent;
