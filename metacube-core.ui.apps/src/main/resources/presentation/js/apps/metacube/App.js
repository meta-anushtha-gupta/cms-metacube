// Util dependencies
import moduleLoader from 'utils/moduleLoader';

// Local dependencies
import ModuleMap from './config/ModuleMap';

/**
 * The top-level controller for the app responsible for
 * loading other controllers and views.
 */
export default class App {
    /**
     * Initialize all global JS components
     * @returns {void}
     */
    constructor() {
        this.modules = moduleLoader.loadModules(ModuleMap);
    }
}
