// Library dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Platform dependencies
import { noop } from 'utils';

// Local dependencies
import Carousel from './../views/Carousel';
import CarouselTypes from './../constants/carouselTypes';

/**
 * @class CarouselComponent
 * @description Component for displaying an instance of a Carousel
 * This component utilizes a Carousel View and wraps it with a React
 * component so that other components can be inserted into the carousel
 * within a React App
 * @param children {Array} The carousel slides
 * @param startIndex {Number} Index of active slide
 * @param type {String} one of CarouselTypes
 * @param infinite {Boolean} If should go to first slide after the last one
 * @param indicators {Boolean} If should display carousel 'dots' or indicators
 * @param navEnabledSmall {Boolean} If should display nav on small screen
 * @param labelPrev {String} Localized text for "Previous"
 * @param labelNext {String} Localized text for "Next"
 * @param theme {String} css modifier theme
 * @param onSlideCallback {Function} A callback which is called when active slide changes
 */
class CarouselComponent extends Component {
    constructor(props, context) {
        super(props, context);

        // stores an instance of Carousel
        this.carousel = null;
    }

    /**
     * @method componentDidMount
     * @description When the component mounts, creates a carousel instance
     */
    componentDidMount() {
        this.createCarousel();
    }

    /**
     * @method componentWillUnmount
     * @description When the component unmounts, destroys the carousel instance
     */
    componentWillUnmount() {
        this.destroyCarousel();
    }

    /**
     * @method componentDidUpdate
     * @description When the component updates, update the active slide
     * @param prevProps {Object} Props before state change
     */
    componentDidUpdate(prevProps) {
        if (prevProps.startIndex !== this.props.startIndex) {
            this.carousel.setActiveSlide(this.props.startIndex, prevProps.startIndex);
        }
    }

    /**
     * @method createCarousel
     * @description Instantiates a Carousel instance and appends it to the DOM
     */
    createCarousel() {
        this.carousel = new Carousel([].slice.call(this.refs.carouselContent.children), {
            startIndex: this.props.startIndex,
            type: this.props.type,
            infinite: this.props.infinite,
            indicators: this.props.indicators,
            navEnabledSmall: this.props.navEnabledSmall,
            labels: {
                prev: this.props.labelPrev,
                next: this.props.labelNext
            },
            theme: this.props.theme,
            onSlideCallback: this.props.onSlideCallback
        });

        this.refs.carouselContent.appendChild(this.carousel.render());
    }

    /**
     * @method destroyCarousel
     * @description Destroys the carousel instance and unmounts the carouselContent
     */
    destroyCarousel() {
        this.carousel.destroy();
    }

    /**
     * @method render
     * @description Renders the carousel content so that it is part of the react lifecycle
     * @return {*}
     */
    render() {
        return (
            <div ref="carouselContent">
                {this.props.children}
            </div>
        );
    }
}

/**
 * @property propTypes
 * @description Defined properties for component
 * @type {{children, startIndex, type, infinite, indicators, navEnabledSmall,
 * labelPrev, labelNext, theme, onSlideCallback}}
 */
CarouselComponent.propTypes = {
    children: PropTypes.array.isRequired,
    startIndex: PropTypes.number,
    type: PropTypes.string,
    infinite: PropTypes.bool,
    indicators: PropTypes.bool,
    navEnabledSmall: PropTypes.bool,
    labelPrev: PropTypes.string,
    labelNext: PropTypes.string,
    theme: PropTypes.string,
    onSlideCallback: PropTypes.func
};

/**
 * @property defaultProps
 * @description Default properties for component
 * @type {{startIndex: number, type: string, infinite: bool, indicators: bool,
 * navEnabledSmall: bool, labelPrev: string, labelNext: string, theme: string,
 * onSlideCallback: func}}
 */
CarouselComponent.defaultProps = {
    startIndex: 0,
    type: CarouselTypes.OVERLAY,
    infinite: false,
    indicators: false,
    navEnabledSmall: false,
    labelPrev: 'Previous',
    labelNext: 'Next',
    theme: '',
    onSlideCallback: noop
};

// export CarouselComponent
export default CarouselComponent;
