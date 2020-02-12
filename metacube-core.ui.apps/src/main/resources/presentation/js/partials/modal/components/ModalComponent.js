// Library dependencies
import { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// Platform dependencies
import { noop } from 'utils';

// Local dependencies
import Modal from './../views/Modal';

/**
 * @const MODAL_CONTAINER
 * @description Attribute of the Modal content container DOM element
 * @type {string}
 */
const MODAL_CONTAINER = 'data-modal-content';

/**
 * @class ModalComponent
 * @description Component for displaying an instance of a Modal
 * This component utilizes a Modal View and wraps it with a React
 * component so that other components can be inserted into the modal
 * within a React App
 * @param children {Element} The inner contents of the modal
 * @param beforeOpen {Function} A callback which is called before modal
 * @param afterOpen {Function} A callback which is called after modal
 * @param beforeClose {Function} A callback which is called before modal
 * @param theme {String} Theme to apply to the modal styling
 * @param size {String} Size to apply to the modal styling
 * @param sizeSmall {String} Optional size to apply to small screen
 * (if set overrides the 'size' property)
 * @param sizeLarge {String} Optional size to apply to large screen
 * (if set overrides the 'size' property)
 * @param disableSmall {Boolean} Indicator to disable the modal on small screens
 */
class ModalComponent extends Component {
    /**
     * @static THEMES
     * @description Optional theme configuration types
     * @type {Modal.THEMES}
     */
    static THEMES = {
        ...Modal.THEMES
    };

    /**
     * @static SIZES
     * @description Optional size configuration types
     * @type {Modal.SIZES}
     */
    static SIZES = {
        ...Modal.SIZES
    };

    constructor(props, context) {
        super(props, context);

        // stores an instance of Modal
        this.modal = null;
    }

    /**
     * @method componentDidMount
     * @description When the component mounts, creates a modal instance
     */
    componentDidMount() {
        this.createModal();
    }

    /**
     * @method componentWillUnmount
     * @description When the component unmounts, destroys the modal instance
     */
    componentWillUnmount() {
        this.destroyModal();
    }

    /**
     * @method componentDidUpdate
     * @description When the component updates, check if the modal is active, if yes, render child
     * components
     */
    componentDidUpdate(prevProps) {
        if (prevProps.children !== this.props.children && this.modal.getActiveState()) {
            this.renderChildren();
        }
    }

    /**
     * @method createModal
     * @description Creates a Modal instance and applies its properties
     */
    createModal() {
        this.modal = new Modal(undefined, {
            modalContent: undefined,
            callbacks: {
                beforeOpen: this.beforeOpen.bind(this),
                afterOpen: this.afterOpen.bind(this),
                beforeClose: this.beforeClose.bind(this)
            },
            theme: this.props.theme,
            size: this.props.size,
            sizeSmall: this.props.sizeSmall,
            sizeLarge: this.props.sizeLarge,
            disableSmall: this.props.disableSmall,
            dataAnalyticContainer: this.props.dataAnalyticContainer
        });
    }

    /**
     * @method destroyModal
     * @description Destroys the modal instance and unmounts the modalContent
     */
    destroyModal() {
        this.modal.destroy();
    }

    /**
     * @method getModalContainer
     * @description Retrieves the modal container DOM node
     * @return {Element}
     */
    getModalContainer() {
        return document.querySelector(`[${MODAL_CONTAINER}]`);
    }

    /**
     * @method open
     * @description Calls a method to open the modal instance
     */
    open() {
        this.modal.open();
    }

    /**
     * @method close
     * @description Calls a method to close the modal instance
     */
    close() {
        this.modal.close();
    }

    /**
     * @method beforeOpen
     * @description Callback to call the beforeOpen props callback before the modal opens
     */
    beforeOpen() {
        this.props.beforeOpen();
    }

    /**
     * @method afterOpen
     * @description Callback to render the children to the Modal DOM container
     * then calls the afterOpen prop callback
     */
    afterOpen() {
        this.renderChildren();
        this.props.afterOpen();
    }

    /**
     * @method beforeClose
     * @description Callback to call the beforeClose prop callback
     * then removes the children to the Modal DOM container
     */
    beforeClose() {
        this.props.beforeClose();

        if (this.getModalContainer()) {
            ReactDOM.unmountComponentAtNode(
                this.getModalContainer()
            );
        }
    }

    /**
     * @method renderChildren
     * @description Renders the child components to the Modal DOM container
     */
    renderChildren() {
        ReactDOM.render(
            this.props.children,
            this.getModalContainer()
        );
    }

    /**
     * @method scrollToElement
     * @description Calls the scrollToElement method of Modal
     * @param {HTMLElement} Element to scroll
     */
    scrollToElement(element) {
        this.modal.scrollToElement(element);
    }

    /**
     * @method render
     * @description Renders a null reference of the component
     * @return {null}
     */
    render() {
        return null;
    }
}

/**
 * @property propTypes
 * @description Defined properties for component
 * @type {{children, beforeOpen, afterOpen, beforeClose, theme, size, disableSmall}}
 */
ModalComponent.propTypes = {
    children: PropTypes.element.isRequired,
    beforeOpen: PropTypes.func,
    afterOpen: PropTypes.func,
    beforeClose: PropTypes.func,
    theme: PropTypes.string,
    size: PropTypes.string,
    sizeSmall: PropTypes.string,
    sizeLarge: PropTypes.string,
    disableSmall: PropTypes.bool,
    dataAnalyticContainer: PropTypes.string,
};

/**
 * @property defaultProps
 * @description Default properties for component
 * @type {{beforeOpen: *, afterOpen: *, beforeClose: *, theme: (*), size: (*)}}
 */
ModalComponent.defaultProps = {
    beforeOpen: noop,
    afterOpen: noop,
    beforeClose: noop,
    theme: Modal.THEMES.DEFAULT,
    size: Modal.SIZES.DEFAULT
};

// export ModalComponent
export default ModalComponent;
