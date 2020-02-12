export default class SatelliteApi {
    /**
     * @constructor
     * @description Registers _satellite as the analytics provider and
     * required api methods
     * @param {Object} api - The global object for the analytics provider
     */
    constructor(api) {
        if (!api) {
            throw new Error('Must pass analyics api to constructor');
        }

        if (api !== _satellite) {
            throw new Error('This api requires _satellite');
        }

        this.api = api;
    }

    /**
     * @method
     * @description log a beacon event
     * @param {String} eventName - the name of the beacon
     * @param {Object} eventData - the event data
     */
    logEvent(eventName, eventData) {
        Object.keys(eventData).forEach((eventKey) => {
            this.api.setVar(eventKey, eventData[eventKey]);
        });

        this.track(eventName);
    }

    /**
     * @method
     * @description trigger rule tracking
     * @param {String} itemTrack - the rule category to track
     */
    track(itemTrack) {
        this.api.track(itemTrack);
    }
}
