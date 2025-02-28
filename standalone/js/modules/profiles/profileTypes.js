/**
 * Profile Types Module
 * Defines standard profile types and their properties
 */

// Profile Categories
const ProfileCategory = {
    CLOSED: 'closed',
    OPEN: 'open'
};

// Profile Types
const ProfileType = {
    // Closed Profiles
    ROUND_TUBE: 'round_tube',
    SQUARE_TUBE: 'square_tube',
    RECTANGULAR_TUBE: 'rectangular_tube',
    
    // Open Profiles
    ANGLE: 'angle',
    CHANNEL: 'channel',
    I_BEAM: 'i_beam'
};

// Required dimensions for each profile type
const RequiredDimensions = {
    [ProfileType.ROUND_TUBE]: ['diameter', 'thickness', 'length'],
    [ProfileType.SQUARE_TUBE]: ['width', 'thickness', 'length'],
    [ProfileType.RECTANGULAR_TUBE]: ['width', 'height', 'thickness', 'length'],
    [ProfileType.ANGLE]: ['width', 'height', 'thickness', 'length'],
    [ProfileType.CHANNEL]: ['width', 'height', 'thickness', 'length', 'flange_width'],
    [ProfileType.I_BEAM]: ['width', 'height', 'web_thickness', 'flange_thickness', 'length']
};

// Optional dimensions that can be specified
const OptionalDimensions = {
    [ProfileType.ROUND_TUBE]: ['outer_radius'],
    [ProfileType.SQUARE_TUBE]: ['outer_radius', 'inner_radius'],
    [ProfileType.RECTANGULAR_TUBE]: ['outer_radius', 'inner_radius'],
    [ProfileType.ANGLE]: ['inner_radius', 'toe_radius'],
    [ProfileType.CHANNEL]: ['root_radius', 'toe_radius'],
    [ProfileType.I_BEAM]: ['root_radius', 'toe_radius', 'k_dimension']
};

// Profile type metadata
const ProfileMetadata = {
    [ProfileType.ROUND_TUBE]: {
        category: ProfileCategory.CLOSED,
        name: 'Round Tube',
        description: 'Circular hollow section',
        commonUses: ['structural members', 'fluid transport', 'mechanical applications']
    },
    [ProfileType.SQUARE_TUBE]: {
        category: ProfileCategory.CLOSED,
        name: 'Square Tube',
        description: 'Square hollow section',
        commonUses: ['structural columns', 'beams', 'framing']
    },
    [ProfileType.RECTANGULAR_TUBE]: {
        category: ProfileCategory.CLOSED,
        name: 'Rectangular Tube',
        description: 'Rectangular hollow section',
        commonUses: ['structural beams', 'framing', 'support members']
    },
    [ProfileType.ANGLE]: {
        category: ProfileCategory.OPEN,
        name: 'Angle',
        description: 'L-shaped profile',
        commonUses: ['brackets', 'bracing', 'framing']
    },
    [ProfileType.CHANNEL]: {
        category: ProfileCategory.OPEN,
        name: 'Channel',
        description: 'C-shaped profile',
        commonUses: ['purlins', 'rails', 'framing']
    },
    [ProfileType.I_BEAM]: {
        category: ProfileCategory.OPEN,
        name: 'I-Beam',
        description: 'I-shaped profile',
        commonUses: ['main beams', 'columns', 'structural support']
    }
};

class ProfileValidator {
    /**
     * Validate dimensions for a profile type
     * @param {string} type Profile type
     * @param {Object} dimensions Dimensions object
     * @returns {Object} Validation result
     */
    static validateDimensions(type, dimensions) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };

        // Check if profile type exists
        if (!ProfileType[type]) {
            result.isValid = false;
            result.errors.push(`Invalid profile type: ${type}`);
            return result;
        }

        // Check required dimensions
        const required = RequiredDimensions[type];
        for (const dim of required) {
            if (!(dim in dimensions)) {
                result.isValid = false;
                result.errors.push(`Missing required dimension: ${dim}`);
            } else if (typeof dimensions[dim] !== 'number' || dimensions[dim] <= 0) {
                result.isValid = false;
                result.errors.push(`Invalid value for ${dim}: must be a positive number`);
            }
        }

        // Check optional dimensions
        const optional = OptionalDimensions[type];
        for (const dim of optional) {
            if (dim in dimensions) {
                if (typeof dimensions[dim] !== 'number' || dimensions[dim] < 0) {
                    result.warnings.push(`Invalid value for optional dimension ${dim}: must be a non-negative number`);
                }
            }
        }

        // Profile-specific validations
        switch (type) {
            case ProfileType.ROUND_TUBE:
                if (dimensions.thickness >= dimensions.diameter / 2) {
                    result.isValid = false;
                    result.errors.push('Thickness must be less than radius');
                }
                break;

            case ProfileType.SQUARE_TUBE:
            case ProfileType.RECTANGULAR_TUBE:
                if (dimensions.thickness >= Math.min(dimensions.width, dimensions.height) / 2) {
                    result.isValid = false;
                    result.errors.push('Thickness must be less than half of the smallest dimension');
                }
                break;

            case ProfileType.ANGLE:
                if (dimensions.thickness >= Math.min(dimensions.width, dimensions.height)) {
                    result.isValid = false;
                    result.errors.push('Thickness must be less than width and height');
                }
                break;
        }

        return result;
    }

    /**
     * Get dimension limits for a profile type
     * @param {string} type Profile type
     * @returns {Object} Dimension limits
     */
    static getDimensionLimits(type) {
        const commonLimits = {
            length: { min: 1, max: 1000000 }, // 1mm to 1000m
            thickness: { min: 0.1, max: 100 }  // 0.1mm to 100mm
        };

        const specificLimits = {
            [ProfileType.ROUND_TUBE]: {
                diameter: { min: 1, max: 1000 },
                ...commonLimits
            },
            [ProfileType.SQUARE_TUBE]: {
                width: { min: 1, max: 1000 },
                ...commonLimits
            },
            [ProfileType.RECTANGULAR_TUBE]: {
                width: { min: 1, max: 1000 },
                height: { min: 1, max: 1000 },
                ...commonLimits
            },
            [ProfileType.ANGLE]: {
                width: { min: 1, max: 1000 },
                height: { min: 1, max: 1000 },
                ...commonLimits
            },
            [ProfileType.CHANNEL]: {
                width: { min: 1, max: 1000 },
                height: { min: 1, max: 1000 },
                flange_width: { min: 1, max: 500 },
                ...commonLimits
            },
            [ProfileType.I_BEAM]: {
                width: { min: 1, max: 1000 },
                height: { min: 1, max: 2000 },
                web_thickness: { min: 0.1, max: 100 },
                flange_thickness: { min: 0.1, max: 100 },
                ...commonLimits
            }
        };

        return specificLimits[type] || {};
    }
}

export {
    ProfileType,
    ProfileCategory,
    RequiredDimensions,
    OptionalDimensions,
    ProfileMetadata,
    ProfileValidator
}; 