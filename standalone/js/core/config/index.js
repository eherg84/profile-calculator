/**
 * Central Configuration Manager
 * Coordinates all configuration modules and provides a single point of access
 */

import * as MaterialConfig from './materials.js';
import * as ProfileConfig from './profiles.js';
import * as UIConfig from './ui.js';

class ConfigManager {
    constructor() {
        // Initialize configuration state
        this.configs = {
            material: MaterialConfig,
            profile: ProfileConfig,
            ui: UIConfig
        };
        
        // Cache for computed/derived configurations
        this.cache = new Map();
    }

    /**
     * Get a specific configuration module
     * @param {string} module Module name ('material', 'profile', or 'ui')
     * @returns {Object} Configuration module
     */
    getConfig(module) {
        return this.configs[module];
    }

    /**
     * Get material configuration
     * @returns {Object} Material configuration
     */
    getMaterialConfig() {
        return this.configs.material;
    }

    /**
     * Get profile configuration
     * @returns {Object} Profile configuration
     */
    getProfileConfig() {
        return this.configs.profile;
    }

    /**
     * Get UI configuration
     * @returns {Object} UI configuration
     */
    getUIConfig() {
        return this.configs.ui;
    }

    /**
     * Get combined validation rules for a profile type
     * @param {string} profileType Profile type
     * @returns {Object} Combined validation rules
     */
    getProfileValidation(profileType) {
        const cacheKey = `profile_validation_${profileType}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const { RequiredDimensions, OptionalDimensions, DimensionValidation, ProfileValidation } = this.configs.profile;

        const validation = {
            required: RequiredDimensions[profileType] || [],
            optional: OptionalDimensions[profileType] || [],
            dimensions: DimensionValidation,
            rules: ProfileValidation[profileType]?.rules || []
        };

        this.cache.set(cacheKey, validation);
        return validation;
    }

    /**
     * Get material properties with validation rules
     * @param {string} materialType Material type
     * @param {string} grade Material grade
     * @returns {Object} Material properties and validation
     */
    getMaterialProperties(materialType, grade) {
        const cacheKey = `material_properties_${materialType}_${grade}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const { DefaultProperties, PropertyValidation } = this.configs.material;
        
        const properties = {
            defaults: DefaultProperties[materialType]?.[grade] || null,
            validation: PropertyValidation
        };

        this.cache.set(cacheKey, properties);
        return properties;
    }

    /**
     * Get theme configuration
     * @param {string} theme Theme name
     * @returns {Object} Theme configuration
     */
    getThemeConfig(theme) {
        const cacheKey = `theme_${theme}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const themeConfig = this.configs.ui.ThemeConfig[theme];
        if (themeConfig) {
            this.cache.set(cacheKey, themeConfig);
        }
        return themeConfig;
    }

    /**
     * Clear configuration cache
     */
    clearCache() {
        this.cache.clear();
    }
}

// Create and export singleton instance
const configManager = new ConfigManager();
export default configManager;

// Re-export all configuration types for convenience
export {
    MaterialConfig,
    ProfileConfig,
    UIConfig
}; 