/**
 * Material Store for Standalone Application
 * Manages materials, grades, and material-related calculations
 */

import {
    MaterialType,
    GradeCategory,
    DefaultProperties,
    PropertyValidation,
    GradeValidation,
    MaterialMetadata
} from '../config/materials.js';

class Material {
    constructor(data) {
        this.id = data.id || crypto.randomUUID();
        this.type = data.type || MaterialType.OTHER;
        this.name = data.name || '';
        this.grade = data.grade || '';
        this.category = data.category || GradeCategory.COMMERCIAL;
        this.properties = {
            density: data.properties?.density || 0,
            yieldStrength: data.properties?.yieldStrength || 0,
            tensileStrength: data.properties?.tensileStrength || 0,
            elasticModulus: data.properties?.elasticModulus || 0,
            ...data.properties
        };
        this.metadata = data.metadata || {};
        this.validation = {
            isValid: true,
            errors: []
        };
    }

    validate() {
        this.validation.errors = [];

        if (!this.name) {
            this.validation.errors.push('Name is required');
        }
        if (!this.type) {
            this.validation.errors.push('Material type is required');
        }
        if (!this.grade) {
            this.validation.errors.push('Grade is required');
        }

        // Validate grade format
        if (this.grade) {
            if (this.grade.length < GradeValidation.minLength || 
                this.grade.length > GradeValidation.maxLength) {
                this.validation.errors.push(`Grade must be between ${GradeValidation.minLength} and ${GradeValidation.maxLength} characters`);
            }
            if (!GradeValidation.pattern.test(this.grade)) {
                this.validation.errors.push('Grade contains invalid characters');
            }
        }

        // Validate properties
        for (const [prop, rules] of Object.entries(PropertyValidation)) {
            const value = this.properties[prop];
            if (rules.required && !value) {
                this.validation.errors.push(`${prop} is required`);
            }
            if (value) {
                if (value < rules.min) {
                    this.validation.errors.push(`${prop} must be at least ${rules.min}`);
                }
                if (value > rules.max) {
                    this.validation.errors.push(`${prop} must be no more than ${rules.max}`);
                }
            }
        }

        this.validation.isValid = this.validation.errors.length === 0;
        return this.validation.isValid;
    }

    calculateWeight(volume) {
        return volume * this.properties.density;
    }
}

class MaterialStore {
    constructor(eventBus) {
        this.materials = new Map();
        this.eventBus = eventBus;
        this.gradesByType = new Map();
        this.initializeDefaultGrades();
    }

    initializeDefaultGrades() {
        // Initialize grades from DefaultProperties configuration
        for (const [type, grades] of Object.entries(DefaultProperties)) {
            this.gradesByType.set(type, new Set(Object.keys(grades)));
        }
    }

    /**
     * Create a new material
     * @param {Object} data Material data
     * @returns {Material} Created material
     */
    createMaterial(data) {
        // If grade exists in DefaultProperties, use those default values
        if (data.type && data.grade && DefaultProperties[data.type]?.[data.grade]) {
            const defaults = DefaultProperties[data.type][data.grade];
            data.properties = {
                ...defaults,
                ...data.properties // Allow overriding defaults
            };
        }

        const material = new Material(data);
        if (material.validate()) {
            this.materials.set(material.id, material);
            this.eventBus.emit('material:created', { material });
            return material;
        } else {
            this.eventBus.emit('material:error', {
                type: 'validation',
                errors: material.validation.errors
            });
            return null;
        }
    }

    /**
     * Get a material by ID
     * @param {string} id Material ID
     * @returns {Material|null} Material or null if not found
     */
    getMaterial(id) {
        return this.materials.get(id) || null;
    }

    /**
     * Update a material
     * @param {string} id Material ID
     * @param {Object} updates Update data
     * @returns {Material|null} Updated material or null if failed
     */
    updateMaterial(id, updates) {
        const material = this.materials.get(id);
        if (!material) {
            this.eventBus.emit('material:error', {
                type: 'notFound',
                id
            });
            return null;
        }

        Object.assign(material, updates);
        if (material.validate()) {
            this.eventBus.emit('material:updated', { material });
            return material;
        } else {
            this.eventBus.emit('material:error', {
                type: 'validation',
                errors: material.validation.errors
            });
            return null;
        }
    }

    /**
     * Delete a material
     * @param {string} id Material ID
     * @returns {boolean} Success status
     */
    deleteMaterial(id) {
        const material = this.materials.get(id);
        if (!material) return false;

        this.materials.delete(id);
        this.eventBus.emit('material:deleted', { id });
        return true;
    }

    /**
     * Get all materials
     * @returns {Material[]} Array of all materials
     */
    getAllMaterials() {
        return Array.from(this.materials.values());
    }

    /**
     * Get materials by type
     * @param {string} type Material type
     * @returns {Material[]} Array of materials of specified type
     */
    getMaterialsByType(type) {
        return this.getAllMaterials().filter(m => m.type === type);
    }

    /**
     * Get available grades for a material type
     * @param {string} type Material type
     * @returns {Set<string>} Set of available grades
     */
    getGradesForType(type) {
        return this.gradesByType.get(type) || new Set();
    }

    /**
     * Add a new grade for a material type
     * @param {string} type Material type
     * @param {string} grade Grade designation
     */
    addGrade(type, grade) {
        if (!this.gradesByType.has(type)) {
            this.gradesByType.set(type, new Set());
        }
        this.gradesByType.get(type).add(grade);
        this.eventBus.emit('material:gradeAdded', { type, grade });
    }

    /**
     * Remove a grade from a material type
     * @param {string} type Material type
     * @param {string} grade Grade designation
     */
    removeGrade(type, grade) {
        if (this.gradesByType.has(type)) {
            this.gradesByType.get(type).delete(grade);
            this.eventBus.emit('material:gradeRemoved', { type, grade });
        }
    }

    /**
     * Clear all materials and grades
     */
    clear() {
        this.materials.clear();
        this.gradesByType.clear();
        this.initializeDefaultGrades();
        this.eventBus.emit('material:cleared');
    }

    /**
     * Get metadata for a material type
     * @param {string} type Material type
     * @returns {Object} Material metadata
     */
    getMaterialMetadata(type) {
        return MaterialMetadata[type] || MaterialMetadata[MaterialType.OTHER];
    }

    /**
     * Get default properties for a material grade
     * @param {string} type Material type
     * @param {string} grade Material grade
     * @returns {Object|null} Default properties or null if not found
     */
    getDefaultProperties(type, grade) {
        return DefaultProperties[type]?.[grade] || null;
    }
}

export { MaterialStore, Material, MaterialType, GradeCategory }; 