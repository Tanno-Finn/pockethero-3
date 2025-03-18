/**
 * Event System
 * Handles event dispatching and listening
 */
class EventSystem {
    /**
     * Create a new event system
     */
    constructor() {
        this.listeners = {};
        this.logs = [];
        this.maxLogs = 100;
        this.debug = CONFIG.game.debug.logEvents;
    }

    /**
     * Subscribe to an event
     *
     * @param {string} eventType - Event type to listen for
     * @param {Function} callback - Function to call when event is emitted
     * @returns {Function} Unsubscribe function
     */
    subscribe(eventType, callback) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }

        this.listeners[eventType].push(callback);

        // Return a function to unsubscribe
        return () => this.unsubscribe(eventType, callback);
    }

    /**
     * Unsubscribe from an event
     *
     * @param {string} eventType - Event type to unsubscribe from
     * @param {Function} callback - Function to remove
     */
    unsubscribe(eventType, callback) {
        if (!this.listeners[eventType]) {
            return;
        }

        const index = this.listeners[eventType].indexOf(callback);
        if (index !== -1) {
            this.listeners[eventType].splice(index, 1);
        }
    }

    /**
     * Emit an event
     *
     * @param {string} eventType - Event type to emit
     * @param {Object} data - Data to pass to listeners
     */
    emit(eventType, data = {}) {
        // Log the event
        if (this.debug) {
            this.logEvent(eventType, data);
        }

        // If no listeners, just return
        if (!this.listeners[eventType]) {
            return;
        }

        // Call all listeners
        this.listeners[eventType].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for ${eventType}:`, error);
            }
        });
    }

    /**
     * Log an event for debugging
     *
     * @param {string} eventType - Event type
     * @param {Object} data - Event data
     */
    logEvent(eventType, data) {
        const logEntry = {
            time: Date.now(),
            type: eventType,
            data: data
        };

        this.logs.push(logEntry);

        // Limit the log size
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Output to console
        console.log(`Event: ${eventType}`, data);
    }

    /**
     * Get the event log
     *
     * @returns {Array} Array of logged events
     */
    getLogs() {
        return [...this.logs];
    }

    /**
     * Clear the event log
     */
    clearLogs() {
        this.logs = [];
    }

    /**
     * Check if an event type has any listeners
     *
     * @param {string} eventType - Event type to check
     * @returns {boolean} Whether the event has listeners
     */
    hasListeners(eventType) {
        return this.listeners[eventType] && this.listeners[eventType].length > 0;
    }

    /**
     * Get the number of listeners for an event type
     *
     * @param {string} eventType - Event type to check
     * @returns {number} Number of listeners
     */
    listenerCount(eventType) {
        return this.listeners[eventType] ? this.listeners[eventType].length : 0;
    }
}