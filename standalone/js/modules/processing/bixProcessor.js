import BaseProcessor from './baseProcessor.js';

/**
 * BIX File Processor
 * Processes BIX files and creates component structures
 */
class BIXProcessor extends BaseProcessor {
    constructor(eventBus, componentStore, materialStore) {
        super(eventBus);
        this.componentStore = componentStore;
        this.materialStore = materialStore;
    }

    /**
     * Process a BIX file
     * @param {Object} data File data object
     * @returns {Object|null} Processing result or null if failed
     */
    process(data) {
        if (!this.validateInput(data)) {
            return null;
        }

        try {
            this.updateProgress(0, 100, 'Starting BIX file processing');
            
            // Parse BIX XML content
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.content, 'text/xml');
            
            if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
                this.addError('Invalid XML format in BIX file');
                return null;
            }

            this.updateProgress(20, 100, 'Parsing BIX structure');

            // Process materials first
            const materials = xmlDoc.getElementsByTagName('Material');
            this.updateProgress(30, 100, 'Processing materials');
            
            for (const material of materials) {
                const materialData = {
                    id: material.getAttribute('id'),
                    name: material.getAttribute('name'),
                    type: material.getAttribute('type'),
                    grade: material.getAttribute('grade'),
                    properties: this._extractProperties(material)
                };

                try {
                    this.materialStore.addMaterial(materialData);
                } catch (error) {
                    this.addWarning(`Failed to add material: ${error.message}`, materialData);
                }
            }

            this.updateProgress(50, 100, 'Processing components');

            // Process components
            const components = xmlDoc.getElementsByTagName('Component');
            const componentMap = new Map();

            // First pass: Create all components
            for (const component of components) {
                const componentData = {
                    id: component.getAttribute('id'),
                    type: component.getAttribute('type'),
                    name: component.getAttribute('name'),
                    material: component.getAttribute('materialId'),
                    profile: component.getAttribute('profile'),
                    dimensions: this._extractDimensions(component),
                    quantity: parseInt(component.getAttribute('quantity') || '1'),
                    weight: parseFloat(component.getAttribute('weight') || '0'),
                    metadata: this._extractProperties(component),
                    sourceFile: data.filename
                };

                try {
                    const newComponent = this.componentStore.createComponent(componentData);
                    componentMap.set(componentData.id, newComponent);
                } catch (error) {
                    this.addError(`Failed to create component: ${error.message}`, componentData);
                }
            }

            this.updateProgress(75, 100, 'Processing component relationships');

            // Second pass: Establish parent-child relationships
            for (const component of components) {
                const parentId = component.getAttribute('id');
                const parent = componentMap.get(parentId);
                
                if (!parent) continue;

                const children = component.getElementsByTagName('Child');
                for (const child of children) {
                    const childId = child.getAttribute('refId');
                    const childComponent = componentMap.get(childId);
                    
                    if (childComponent) {
                        try {
                            this.componentStore.addChildToComponent(parent.id, childComponent.id);
                        } catch (error) {
                            this.addWarning(`Failed to establish parent-child relationship: ${error.message}`, {
                                parentId,
                                childId
                            });
                        }
                    }
                }
            }

            this.updateProgress(100, 100, 'BIX processing complete');

            return {
                components: Array.from(componentMap.values()),
                materials: this.materialStore.getAllMaterials()
            };

        } catch (error) {
            this.addError('Failed to process BIX file', { error: error.message });
            return null;
        }
    }

    /**
     * Validate BIX file input
     * @param {Object} data File data object
     * @returns {boolean} True if valid
     */
    validateInput(data) {
        if (!super.validateInput(data)) {
            return false;
        }

        if (!data.content) {
            this.addError('BIX file content is required');
            return false;
        }

        if (!data.filename) {
            this.addError('BIX filename is required');
            return false;
        }

        return true;
    }

    /**
     * Extract properties from an XML element
     * @private
     * @param {Element} element XML element
     * @returns {Object} Extracted properties
     */
    _extractProperties(element) {
        const properties = {};
        const propertyElements = element.getElementsByTagName('Property');
        
        for (const prop of propertyElements) {
            const key = prop.getAttribute('name');
            const value = prop.getAttribute('value');
            if (key && value) {
                properties[key] = value;
            }
        }

        return properties;
    }

    /**
     * Extract dimensions from a component element
     * @private
     * @param {Element} element Component element
     * @returns {Object} Extracted dimensions
     */
    _extractDimensions(element) {
        const dimensions = {};
        const dimensionElements = element.getElementsByTagName('Dimension');
        
        for (const dim of dimensionElements) {
            const key = dim.getAttribute('type');
            const value = parseFloat(dim.getAttribute('value'));
            if (key && !isNaN(value)) {
                dimensions[key] = value;
            }
        }

        return dimensions;
    }
}

export default BIXProcessor; 