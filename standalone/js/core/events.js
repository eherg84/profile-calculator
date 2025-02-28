/**
 * Event System for Standalone Application
 * Provides a simple pub/sub mechanism for component communication
 */
class EventBus {
    constructor() {
        this.events = new Map();
        this.debugMode = false;
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Event handler
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
        
        if (this.debugMode) {
            console.log(`Event: Subscribed to "${event}"`);
        }

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Event handler to remove
     */
    off(event, callback) {
        if (this.events.has(event)) {
            this.events.get(event).delete(callback);
            if (this.debugMode) {
                console.log(`Event: Unsubscribed from "${event}"`);
            }
        }
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        if (this.events.has(event)) {
            if (this.debugMode) {
                console.log(`Event: Emitting "${event}"`, data);
            }
            this.events.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event handler for "${event}":`, error);
                }
            });
        }
    }

    /**
     * Enable or disable debug mode
     * @param {boolean} enabled - Whether to enable debug mode
     */
    setDebug(enabled) {
        this.debugMode = enabled;
    }

    /**
     * Clear all event subscriptions
     */
    clear() {
        this.events.clear();
        if (this.debugMode) {
            console.log('Event: Cleared all subscriptions');
        }
    }
}

// Create and export singleton instance
const eventBus = new EventBus();
export default eventBus;

// Export event names constants
export const Events = {
    // File related events
    FILE_LOADED: 'file:loaded',
    FILE_LOAD_ERROR: 'file:loadError',
    
    // Data processing events
    DATA_PROCESSED: 'data:processed',
    DATA_ERROR: 'data:error',
    
    // UI events
    UI_UPDATED: 'ui:updated',
    UI_ERROR: 'ui:error',
    
    // Store events
    STORE_UPDATED: 'store:updated',
    STORE_ERROR: 'store:error'
}; 