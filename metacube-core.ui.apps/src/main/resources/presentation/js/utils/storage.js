/**
 * API for interfacing and making CRUD actions with Storage.
 *
 * The intent of this API is to normalize how data is saved to storage
 * and enhance the management of the data stored with additional meta data.
 * (eg. app version, last saved date, expiration date, etc)
 *
 * To interface with the api, please see the exported method at the bottom of the file,
 * with the associate documentation for each method
 */

/**
 * @method hasStorageEnabled
 * @description Determines if a storage types is available to save to
 * @param type {String} Storage type (eg: localStorage || sessionStorage)
 * @return {boolean} Indicator for is the storage type is available
 */
function hasStorageEnabled(type) {
    try {
        const storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * @method getItem
 * @description Adapter method for interfacing with a storage type's getter method
 * @param storageLocation {String} Storage type to get data from
 * @param key {String} Key of data to get
 * @return {*} Stored data if available
 */
function getItem(storageLocation, key) {
    return hasStorageEnabled(storageLocation) && window[storageLocation].getItem(key);
}

/**
 * @method setItem
 * @description Adapter method for interfacing with a storage type's setter method
 * @param storageLocation {String} Storage type to set data to
 * @param key {String} Key for data to set
 * @param value {String} Value of data to set
 * @return {*} Stored data if available
 */
function setItem(storageLocation, key, value) {
    return hasStorageEnabled(storageLocation) && window[storageLocation].setItem(key, value);
}

/**
 * @method removeItem
 * @description Adapter method for interfacing with a storage type's delete method
 * @param storageLocation {String} Storage type to remove data from
 * @param key {String} Key of data to remove
 * @return {boolean}
 */
function removeItem(storageLocation, key) {
    return hasStorageEnabled(storageLocation) && window[storageLocation].removeItem(key);
}

/**
 * @method create
 * @description Creates a data object to store in storage, along with meta data related
 * to the stored data's expiration, lastSaved date and the version of the app the data
 * was saved from
 * @param storageLocation {String} Location to store the data
 * @param key {String} Key value to assign the data to in storage
 * @param value {Object} Data object to save in storage
 * @param [expiration] {Date} Optional date that the data should expire
 */
function create(storageLocation, key, value, expiration) {
    const dataToSet = {
        data: value,
        expiration: expiration && (new Date(expiration)).toUTCString(),
        lastSaved: new Date().toUTCString(),
        version: window.metacube.appVersion
    };

    setItem(storageLocation, key, JSON.stringify(dataToSet));
}

/**
 * @method read
 * @description Retrieves data from storage a validates that the data has not expired
 * nor is invalid from an application update. If truthy the data will be returned,
 * otherwise the data will be removed from storage
 * @param storageLocation {String} The storage location to retrieve data from
 * @param key {String} The key of the data to retrieve
 * @return {*|null} Data fetched from storage
 */
function read(storageLocation, key) {
    let obj = getItem(storageLocation, key);

    if (obj) {
        // its not null
        obj = JSON.parse(obj);

        // see if its within the date range.
        const expiration = obj.expires && (new Date(obj.expires)).getTime();
        const now = Date.now();

        if (obj.version !== window.metacube.appVersion ||
            (expiration && now > expiration)) {
            // the data is NOT within the version and date range
            obj.data = null;
            removeItem(storageLocation, key);
        }
    }

    return obj && obj.data;
}

/**
 * @method updateExpiration
 * @description Updates an expiration date from the current time based on the difference
 * from when a date was set to expire and the last time it was saved.
 * @param expiration {Date} The date currently set to expire
 * @param lastSaved {Date} The date from when the current expiration was saved
 * @return {Date} Updated expiration date
 */
function updateExpiration(expiration, lastSaved) {
    const now = new Date();
    const expDate = new Date(expiration);
    const savedDate = new Date(lastSaved);
    const diff = expDate.getTime() - savedDate.getTime();

    return now.setDate(now.getTime() + diff);
}

/**
 * @method update
 * @description Updates an object in storage with a new set of data along with
 * updating the expiration, lastSaved and version meta data
 * @param storageLocation {String} The storage location to update data from
 * @param key {String} Key of data to update
 * @param data {Object} Object to update data with
 */
function update(storageLocation, key, data) {
    const initData = getItem(storageLocation, key);
    const newData = {
        ...initData.data,
        ...data
    };
    const {
        expiration,
        lastSaved
    } = initData;

    const dataToSave = {
        data: newData,
        version: window.metacube.appVersion,
        expiration: expiration && updateExpiration(expiration, lastSaved),
        lastSaved: new Date().toUTCString()
    };

    setItem(storageLocation, key, JSON.stringify(dataToSave));
}

/**
 * Export public api methods for interfacing with CRUD method
 */
export default {
    sessionStorage: {
        create: create.bind(null, 'sessionStorage'),
        read: read.bind(null, 'sessionStorage'),
        update: update.bind(null, 'sessionStorage'),
        delete: removeItem.bind(null, 'sessionStorage')
    },
    localStorage: {
        create: create.bind(null, 'localStorage'),
        read: read.bind(null, 'localStorage'),
        update: update.bind(null, 'localStorage'),
        delete: removeItem.bind(null, 'localStorage')
    }
};
