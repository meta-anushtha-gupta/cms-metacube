/**
 * @class Observer
 * @description An abstract class for an observer object.
 *
 * This class is intended to be used in conjunction with an Observable model
 */
export default class Observer {
    /**
     * @abstract onUpdate
     * @description Callback method to be applied on an
     * Observable model's state change
     * @param prevState {Object} The previous state before a change event
     * @param newState {Object} The updated state after the change event
     */
    onUpdate() {
        return this;
    }
}
