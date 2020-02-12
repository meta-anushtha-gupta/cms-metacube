// Util dependencies
import domState from 'utils/domState';

// Local dependencies
import App from './App';

/**
 * The only purpose of this file is to bootstrap the MBCore app
 * to the `window` whenever the page has finished loading.
 * All work to be done with loading modules and any logic to perform
 * requests or update the DOM should be done their or in a specific
 * module.
 */
domState.onReady(() => {
    // Attach MBPlatform to the window
    window.MBPlatform = new App();
});
