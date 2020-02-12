// Utils dependencies
import importPolyfills from 'utils/polyfills';

/**
 * The top-level controller for the MB JS platform page.
 * This app for loading other platform modules and plugin apps.
 */
export default class App {
    /**
     * @constructor
     * @description Initialize all global JS components and call `loadModules`
     * to initialize all unique JS components
     * @returns {void}
     */
    constructor() {
        importPolyfills();
        this.loadApps();
    }

    /**
     * @method loadPageModules
     * @description Iterates through the apps array and dynamically
     * requires each matching app with require.ensure
     *
     * Note: when creating an app a new entry will need to be added
     * to the switch statement to create a js chunk
     *
     * @return {App}
     */
    loadApps() {
        require.ensure([], (require) => { require('../metacube'); }, 'app.metacube');
        return this;
    }
}
