import { screen } from 'utils';
import SatelliteApi from './SatelliteApi';

/**
 * Module for setting up a analytics api factory
 * and exposes methods to fire beacons with the corresponding analytics provider
 */
export default class AnalyticsApi {
    /**
     * @constructor
     * @description Sets up the analytics provider and instantiates the
     * corresponding wrapping api.
     * @param {String} type - The type of the analytics provider you want to use
     * in setting up the api
     */
    constructor(type) {
        switch (type) {
        case 'satellite': {
            if (typeof _satellite === 'undefined') {
                throw new Error('AnalyticsApi Error: _satellite not defined. Will not instantiate SatelliteApi.');
            }

            this.api = new SatelliteApi(_satellite);
            break;
        }
        default: {
            console.error('No analytics type defined');
        }
        }
    }

    /**
     * @method
     * @description log a beacon event
     * @param {String} eventName - the name of the beacon
     * @param {Object} eventData - the event data
     */
    logEvent(eventName, eventData) {
        this.api.logEvent(eventName, eventData);
    }

    logScreenSize() {
        this.logEvent('screenSize', {
            screenSize: screen.getCurrentState()
        });
        console.info('screenSize', screen.getCurrentState());
    }
}
