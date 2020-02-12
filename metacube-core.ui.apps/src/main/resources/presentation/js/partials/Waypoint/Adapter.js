/**
 * Adapter singleton for waypoints
 */
import { EVENTS } from 'Constants';
import {
    debounce,
    isScrolledToTop,
    isStickyElement,
    dimensions
} from 'utils';

let previousWaypoint = { ID: '' };

const ATTRIBUTES = {
    WAYPOINT_OFFSET: 'data-waypoint-offset'
};

/**
 * Adapter
 * The adapter is responsible for the scroll event handling
 * and triggering the callback for the corresponding waypoint
 */
class Adapter {
    constructor() {
        this.waypoints = [];
        this.pageElements = null;
        this.offsetOption = null;

        this.init();
    }

    init() {
        this.cacheDOM();
        this.attachEvents();
    }

    /**
     * Cache DOM
     */
    cacheDOM() {
        this.offsetElements = document.querySelectorAll(`[${ATTRIBUTES.WAYPOINT_OFFSET}]`);
    }

    /**
     * Adds waypoint to the list of waypoints
     */
    addWaypoint(waypoint) {
        this.waypoints.push(waypoint);
    }

    /**
     * Set offsetOption
     */
    setOffset(offsetOption) {
        this.offsetOption = offsetOption;
    }

    /**
     * Attaches events
     */
    attachEvents() {
        window.addEventListener(EVENTS.SCROLL, debounce(this.onScroll.bind(this), 10));
    }

    /**
     * The scroll handler
     * Finds the current waypoint and triggers the callback if
     * previous waypoint is not the same as current waypoint.
     * If the user scrolls up past the first waypoint (is made sure by
     * checking the previousWaypoint), and there is only a total of one
     * waypoint, execute the callback of first waypoint.
     * If currentWaypoint is undefined, then there are no waypoints currently
     * active, execute callback if available.
     */
    onScroll() {
        const currentWaypoint = this.findTriggeredWaypoint();
        if (currentWaypoint &&
            currentWaypoint.callback &&
            previousWaypoint.ID !== currentWaypoint.ID) {
            currentWaypoint.callback();
            previousWaypoint = Object.assign({}, currentWaypoint);
        } else if (this.waypoints.length === 1 && !currentWaypoint && previousWaypoint.callback) {
            previousWaypoint.callback();
            delete previousWaypoint.callback;
            delete previousWaypoint.ID;
        } else if (!currentWaypoint && previousWaypoint.inactiveCallback) {
            previousWaypoint.inactiveCallback();
            delete previousWaypoint.callback;
            delete previousWaypoint.ID;
        }
    }

    /**
     * Determines if there are any offsetElements that are sticky and if so
     * retrieves the height of the element to provide an offset to the waypoints
     * @return {number}
     */
    getOffset() {
        let offset = 0;

        [].slice.call(this.offsetElements).forEach((elem) => {
            if (isStickyElement(elem)) {
                offset = this.offsetOption() || dimensions.getHeight(elem);
            }
        });
        return offset;
    }

    /**
     * Filters out the waypoints that is scrolled past the viewport,
     * sorts them by getBoundingClientRect().top,
     * and gets the last one, aka the one closes to top of screen.
     */
    findTriggeredWaypoint() {
        return this.waypoints
            .filter(waypoint => (isScrolledToTop(waypoint.element, this.getOffset())))
            .sort((a, b) => (
                a.element.getBoundingClientRect().top - b.element.getBoundingClientRect().top
            ))
            .pop();
    }
}


export default new Adapter();
