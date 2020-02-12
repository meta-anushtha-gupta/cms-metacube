// Library dependencies
import isEqual from 'lodash.isequal';

// Local dependencies
import StateProxy from './StateProxy';

/**
 * @class Observable
 * @description Class for attaching observers and notifying them of state changes to a model.
 *
 * The class is intended to be used as a super class to a Model in an MVC pattern
 */
export default class Observable {
    /**
     * @constructor On instantiation, create a collection to attach observers to
     * @param initialState {Object} The initial state to set
     */
    constructor(initialState = {}) {
        // a collection of observers to notify when changes occur
        this.observers = [];
        // State object to proxy and observe changes for
        this.state = new StateProxy(initialState, this.onChange.bind(this));
    }

    /**
     * @method attach
     * @description Adds an observer to the observer collection
     * @param observer {Observer} The observer to notify on change
     */
    attach(observer) {
        this.observers.push(observer);
    }

    /**
     * @method detach
     * @description Removes an observer to the observer collection
     * @param observer {Observer} The observer to remove from collection
     */
    detach(observer) {
        this.observers.splice(this.observers.indexOf(observer), 1);
    }

    /**
     * @method destroy
     * @description Clears collection of observers
     */
    destroy() {
        this.observers = [];
    }

    /**
     * @method onChange
     * @description On `state` change events, checks if the new state does
     * not equal the previous state. If the new state has updated, iterates
     * over the collection of observers and calls their `onUpdate` method to
     * notify them of a state change
     * @param prevState {Object} State object before change event
     * @param newState {Object} State object after change event
     */
    onChange(prevState, newState) {
        if (!isEqual(prevState, newState)) {
            Object.keys(this.observers).forEach((observer) => {
                if (Object.prototype.hasOwnProperty.call(this.observers, observer)) {
                    this.observers[observer].onUpdate(prevState, newState);
                }
            });
        }
    }
}
