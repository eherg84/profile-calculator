/**
 * Component Store for Standalone Application
 * Manages component data and relationships
 */

// Component Types
const ComponentType = {
    PROFILE: 'profile',
    ASSEMBLY: 'assembly',
    PART: 'part'
};

// Component Interface
class Component {
    constructor(data) {
        this.id = data.id || crypto.randomUUID();
        this.type = data.type || ComponentType.PART;
        this.name = data.name || '';
        this.material = data.material || null;
        this.profile = data.profile || null;
        this.dimensions = data.dimensions || {};
        this.quantity = data.quantity || 1;
        this.weight = data.weight || 0;
        this.parent = data.parent || null;
        this.children = new Set(data.children || []);
        this.metadata = data.metadata || {};
        this.sourceFile = data.sourceFile || null;
        this.validation = {
            isValid: true,
            errors: []
        };
    }

    addChild(childId) {
        this.children.add(childId);
    }

    removeChild(childId) {
        this.children.delete(childId);
    }

    validate() {
        this.validation.errors = [];
        
        // Basic validation
        if (!this.name) {
            this.validation.errors.push('Name is required');
        }
        if (!this.material) {
            this.validation.errors.push('Material is required');
        }
        if (!this.profile) {
            this.validation.errors.push('Profile is required');
        }
        if (this.quantity < 1) {
            this.validation.errors.push('Quantity must be at least 1');
        }

        this.validation.isValid = this.validation.errors.length === 0;
        return this.validation.isValid;
    }
}

class ComponentStore {
    constructor(eventBus) {
        this.components = new Map();
        this.eventBus = eventBus;
        this.relationships = new Map(); // parent -> children mapping
    }

    /**
     * Create a new component
     * @param {Object} data Component data
     * @returns {Component} Created component
     */
    createComponent(data) {
        const component = new Component(data);
        if (component.validate()) {
            this.components.set(component.id, component);
            
            // Update relationships
            if (component.parent) {
                const parent = this.components.get(component.parent);
                if (parent) {
                    parent.addChild(component.id);
                }
            }

            this.eventBus.emit('component:created', { component });
            return component;
        } else {
            this.eventBus.emit('component:error', { 
                type: 'validation',
                errors: component.validation.errors 
            });
            return null;
        }
    }

    /**
     * Get a component by ID
     * @param {string} id Component ID
     * @returns {Component|null} Component or null if not found
     */
    getComponent(id) {
        return this.components.get(id) || null;
    }

    /**
     * Update a component
     * @param {string} id Component ID
     * @param {Object} updates Update data
     * @returns {Component|null} Updated component or null if failed
     */
    updateComponent(id, updates) {
        const component = this.components.get(id);
        if (!component) {
            this.eventBus.emit('component:error', {
                type: 'notFound',
                id
            });
            return null;
        }

        Object.assign(component, updates);
        if (component.validate()) {
            this.eventBus.emit('component:updated', { component });
            return component;
        } else {
            this.eventBus.emit('component:error', {
                type: 'validation',
                errors: component.validation.errors
            });
            return null;
        }
    }

    /**
     * Delete a component
     * @param {string} id Component ID
     * @returns {boolean} Success status
     */
    deleteComponent(id) {
        const component = this.components.get(id);
        if (!component) return false;

        // Remove from parent's children
        if (component.parent) {
            const parent = this.components.get(component.parent);
            if (parent) {
                parent.removeChild(id);
            }
        }

        // Remove all children
        component.children.forEach(childId => {
            this.deleteComponent(childId);
        });

        this.components.delete(id);
        this.eventBus.emit('component:deleted', { id });
        return true;
    }

    /**
     * Get all components
     * @returns {Component[]} Array of all components
     */
    getAllComponents() {
        return Array.from(this.components.values());
    }

    /**
     * Get components by type
     * @param {string} type Component type
     * @returns {Component[]} Array of components of specified type
     */
    getComponentsByType(type) {
        return this.getAllComponents().filter(c => c.type === type);
    }

    /**
     * Clear all components
     */
    clear() {
        this.components.clear();
        this.relationships.clear();
        this.eventBus.emit('component:cleared');
    }
}

export { ComponentStore, Component, ComponentType }; 