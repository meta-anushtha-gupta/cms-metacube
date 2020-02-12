// Library dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ViewMoreItemComponent extends Component {
    /**
     * @property {string} displayName
     * @description Display name of the component. This will be used when any component needs to
     * validate the type.
     */
    static displayName = 'ViewMoreItemComponent';

    render() {
        return (
            React.cloneElement(this.props.children, {
                id: this.props.id
            })
        );
    }
}

ViewMoreItemComponent.propTypes = {
    children: PropTypes.element,
    id: PropTypes.string.isRequired
};

export default ViewMoreItemComponent;
