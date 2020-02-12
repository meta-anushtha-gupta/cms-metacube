/**
 * Utility for dynamically loading modules from the DOM
 */

/**
 * @const ATTRIBUTES
 * @description Collection of attributes to interface with
 * @type {{LOADER: string, LOADED: string}}
 */
const ATTRIBUTES = {
    LOADER: 'data-load-module',
    LOADED: 'data-module-loaded'
};

/**
 * @method loadModules
 * @param moduleMap {Object} Mapping of modules to load with keys named as module name
 * @return {Array} Collection of loaded module instances
 */
function loadModules(moduleMap) {
    const modules = [];

    Object.keys(moduleMap).forEach((moduleName) => {
        const attribute = `[${ATTRIBUTES.LOADER}='${moduleName}']`;

        Array.prototype.forEach.call(document.querySelectorAll(attribute), (element) => {
            if (
                element &&
                element.attributes[ATTRIBUTES.LOADED] !== 'true'
                && Object.prototype.hasOwnProperty.call(moduleMap, moduleName)
            ) {
                element.setAttribute(ATTRIBUTES.LOADED, 'true');
                modules.push(new moduleMap[moduleName](element));
            } else {
                console.warn(`Could not find reference for module named ${moduleName}`);
            }
        });
    });

    return modules;
}

/**
 * Export public api methods
 */
export default {
    loadModules
};
