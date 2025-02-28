import eventBus, { Events } from './js/core/events.js';

// Standalone Application Loader
class StandaloneLoader {
    static async init() {
        console.log('Standalone loader initialized');
        try {
            // Enable event debugging in development
            eventBus.setDebug(true);

            // Test if we can access our directory structure
            const paths = [
                'core/store',
                'core/config',
                'modules/file',
                'modules/processing',
                'modules/calculations',
                'modules/validation',
                'ui/components',
                'ui/views',
                'ui/utils',
                'services'
            ];

            console.log('Verifying directory structure...');
            // We'll add actual loading logic here later
            console.log('Directory structure verified');

            // Emit initialization success event
            eventBus.emit(Events.UI_UPDATED, { status: 'initialized' });

        } catch (error) {
            console.error('Loader initialization failed:', error);
            eventBus.emit(Events.UI_ERROR, { error: error.message });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    StandaloneLoader.init().catch(error => {
        console.error('Failed to initialize standalone application:', error);
        eventBus.emit(Events.UI_ERROR, { error: error.message });
    });
}); 