import BaseProcessor from './baseProcessor.js';

/**
 * BPF File Processor
 * Processes BPF (Building Project File) files and creates component structures
 */
class BPFProcessor extends BaseProcessor {
    constructor(eventBus, componentStore, materialStore) {
        super(eventBus);
        this.componentStore = componentStore;
        this.materialStore = materialStore;
    }

    /**
     * Process a BPF file
     * @param {Object} data File data object
     * @returns {Object|null} Processing result or null if failed
     */
    process(data) {
        if (!this.validateInput(data)) {
            return null;
        }

        try {
            this.updateProgress(0, 100, 'Starting BPF file processing');
            
            // Parse BPF JSON content
            let bpfData;
            try {
                bpfData = JSON.parse(data.content);
            } catch (error) {
                this.addError('Invalid JSON format in BPF file');
                return null;
            }

            if (!this._validateBPFStructure(bpfData)) {
                return null;
            }

            this.updateProgress(20, 100, 'Processing project information');

            // Process project information
            const projectInfo = {
                name: bpfData.project.name,
                description: bpfData.project.description,
                created: bpfData.project.created,
                modified: bpfData.project.modified,
                version: bpfData.project.version
            };

            this.updateProgress(30, 100, 'Processing materials');

            // Process materials
            for (const material of bpfData.materials || []) {
                const materialData = {
                    id: material.id,
                    name: material.name,
                    type: material.type,
                    grade: material.grade,
                    properties: material.properties || {}
                };

                try {
                    this.materialStore.addMaterial(materialData);
                } catch (error) {
                    this.addWarning(`Failed to add material: ${error.message}`, materialData);
                }
            }

            this.updateProgress(50, 100, 'Processing components');

            // Process components
            const componentMap = new Map();
            const components = bpfData.components || [];

            // First pass: Create all components
            for (const component of components) {
                const componentData = {
                    id: component.id,
                    type: component.type,
                    name: component.name,
                    material: component.materialId,
                    profile: component.profile,
                    dimensions: component.dimensions || {},
                    quantity: component.quantity || 1,
                    weight: component.weight || 0,
                    metadata: component.properties || {},
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

            // Second pass: Establish component relationships
            for (const component of components) {
                if (!component.children || !Array.isArray(component.children)) {
                    continue;
                }

                const parent = componentMap.get(component.id);
                if (!parent) continue;

                for (const childId of component.children) {
                    const child = componentMap.get(childId);
                    if (child) {
                        try {
                            this.componentStore.addChildToComponent(parent.id, child.id);
                        } catch (error) {
                            this.addWarning(`Failed to establish parent-child relationship: ${error.message}`, {
                                parentId: parent.id,
                                childId: child.id
                            });
                        }
                    }
                }
            }

            this.updateProgress(100, 100, 'BPF processing complete');

            return {
                project: projectInfo,
                components: Array.from(componentMap.values()),
                materials: this.materialStore.getAllMaterials()
            };

        } catch (error) {
            this.addError('Failed to process BPF file', { error: error.message });
            return null;
        }
    }

    /**
     * Validate BPF file input
     * @param {Object} data File data object
     * @returns {boolean} True if valid
     */
    validateInput(data) {
        if (!super.validateInput(data)) {
            return false;
        }

        if (!data.content) {
            this.addError('BPF file content is required');
            return false;
        }

        if (!data.filename) {
            this.addError('BPF filename is required');
            return false;
        }

        return true;
    }

    /**
     * Validate BPF file structure
     * @private
     * @param {Object} data Parsed BPF data
     * @returns {boolean} True if valid
     */
    _validateBPFStructure(data) {
        if (!data.project) {
            this.addError('Missing project information in BPF file');
            return false;
        }

        if (!data.project.name) {
            this.addError('Missing project name in BPF file');
            return false;
        }

        if (!data.components || !Array.isArray(data.components)) {
            this.addError('Missing or invalid components array in BPF file');
            return false;
        }

        // Validate required component fields
        for (const component of data.components) {
            if (!component.id) {
                this.addError('Component missing required id field');
                return false;
            }

            if (!component.type) {
                this.addError(`Component ${component.id} missing required type field`);
                return false;
            }

            if (!component.name) {
                this.addError(`Component ${component.id} missing required name field`);
                return false;
            }
        }

        return true;
    }
}

export default BPFProcessor; 