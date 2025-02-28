/**
 * Base Processor Class
 * Provides common functionality for all processors
 */

class BaseProcessor {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.errors = [];
        this.warnings = [];
    }

    /**
     * Reset processor state
     */
    reset() {
        this.errors = [];
        this.warnings = [];
    }

    /**
     * Add an error
     * @param {string} message Error message
     * @param {Object} context Additional error context
     */
    addError(message, context = {}) {
        const error = {
            message,
            context,
            timestamp: new Date()
        };
        this.errors.push(error);
        this.eventBus.emit('processor:error', error);
    }

    /**
     * Add a warning
     * @param {string} message Warning message
     * @param {Object} context Additional warning context
     */
    addWarning(message, context = {}) {
        const warning = {
            message,
            context,
            timestamp: new Date()
        };
        this.warnings.push(warning);
        this.eventBus.emit('processor:warning', warning);
    }

    /**
     * Check if processing has errors
     * @returns {boolean} True if there are errors
     */
    hasErrors() {
        return this.errors.length > 0;
    }

    /**
     * Check if processing has warnings
     * @returns {boolean} True if there are warnings
     */
    hasWarnings() {
        return this.warnings.length > 0;
    }

    /**
     * Get all errors
     * @returns {Array} Array of errors
     */
    getErrors() {
        return [...this.errors];
    }

    /**
     * Get all warnings
     * @returns {Array} Array of warnings
     */
    getWarnings() {
        return [...this.warnings];
    }

    /**
     * Track processing progress
     * @param {number} current Current progress value
     * @param {number} total Total progress value
     * @param {string} message Progress message
     */
    updateProgress(current, total, message = '') {
        const progress = {
            current,
            total,
            percentage: Math.round((current / total) * 100),
            message
        };
        this.eventBus.emit('processor:progress', progress);
    }

    /**
     * Validate input data
     * @param {*} data Data to validate
     * @returns {boolean} True if data is valid
     */
    validateInput(data) {
        if (!data) {
            this.addError('Input data is required');
            return false;
        }
        return true;
    }

    /**
     * Process data (to be implemented by child classes)
     * @param {*} data Data to process
     * @returns {*} Processed data
     */
    process(data) {
        throw new Error('process() must be implemented by child class');
    }

    /**
     * Clean up after processing
     */
    cleanup() {
        this.reset();
        this.eventBus.emit('processor:cleanup');
    }
}

export default BaseProcessor; 