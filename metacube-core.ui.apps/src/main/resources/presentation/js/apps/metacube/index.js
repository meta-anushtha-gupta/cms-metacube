// Util dependencies
import domState from 'utils/domState';

// Local dependencies
import App from './App';

/**
 * The only purpose of this file is to bootstrap the App module.
 * All work to be done with loading modules and any logic to perform
 * requests or update the DOM should be done their or in a specific
 * module.
 */
domState.onReady(() => new App());
