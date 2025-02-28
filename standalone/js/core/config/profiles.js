/**
 * Profiles Configuration
 * Centralizes all profile-related configurations and constants
 */

// Profile Categories
export const ProfileCategory = {
    CLOSED: 'closed',
    OPEN: 'open'
};

// Profile Types
export const ProfileType = {
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
export const RequiredDimensions = {
    [ProfileType.ROUND_TUBE]: ['diameter', 'thickness', 'length'],
    [ProfileType.SQUARE_TUBE]: ['width', 'thickness', 'length'],
    [ProfileType.RECTANGULAR_TUBE]: ['width', 'height', 'thickness', 'length'],
    [ProfileType.ANGLE]: ['width', 'height', 'thickness', 'length'],
    [ProfileType.CHANNEL]: ['width', 'height', 'thickness', 'length', 'flange_width'],
    [ProfileType.I_BEAM]: ['width', 'height', 'web_thickness', 'flange_thickness', 'length']
};

// Optional dimensions that can be specified
export const OptionalDimensions = {
    [ProfileType.ROUND_TUBE]: ['outer_radius'],
    [ProfileType.SQUARE_TUBE]: ['outer_radius', 'inner_radius'],
    [ProfileType.RECTANGULAR_TUBE]: ['outer_radius', 'inner_radius'],
    [ProfileType.ANGLE]: ['inner_radius', 'toe_radius'],
    [ProfileType.CHANNEL]: ['root_radius', 'toe_radius'],
    [ProfileType.I_BEAM]: ['root_radius', 'toe_radius', 'k_dimension']
};

// Dimension validation rules
export const DimensionValidation = {
    length: {
        min: 1,       // Minimum length in mm
        max: 1000000, // Maximum length in mm (1000m)
        required: true
    },
    thickness: {
        min: 0.1,     // Minimum thickness in mm
        max: 100,     // Maximum thickness in mm
        required: true
    },
    diameter: {
        min: 1,       // Minimum diameter in mm
        max: 1000,    // Maximum diameter in mm
        required: true
    },
    width: {
        min: 1,       // Minimum width in mm
        max: 1000,    // Maximum width in mm
        required: true
    },
    height: {
        min: 1,       // Minimum height in mm
        max: 2000,    // Maximum height in mm
        required: true
    },
    flange_width: {
        min: 1,       // Minimum flange width in mm
        max: 500,     // Maximum flange width in mm
        required: true
    },
    web_thickness: {
        min: 0.1,     // Minimum web thickness in mm
        max: 100,     // Maximum web thickness in mm
        required: true
    },
    flange_thickness: {
        min: 0.1,     // Minimum flange thickness in mm
        max: 100,     // Maximum flange thickness in mm
        required: true
    },
    outer_radius: {
        min: 0,       // Minimum outer radius in mm
        max: 100,     // Maximum outer radius in mm
        required: false
    },
    inner_radius: {
        min: 0,       // Minimum inner radius in mm
        max: 50,      // Maximum inner radius in mm
        required: false
    },
    toe_radius: {
        min: 0,       // Minimum toe radius in mm
        max: 50,      // Maximum toe radius in mm
        required: false
    },
    root_radius: {
        min: 0,       // Minimum root radius in mm
        max: 50,      // Maximum root radius in mm
        required: false
    },
    k_dimension: {
        min: 0,       // Minimum k-dimension in mm
        max: 100,     // Maximum k-dimension in mm
        required: false
    }
};

// Profile-specific validation rules
export const ProfileValidation = {
    [ProfileType.ROUND_TUBE]: {
        rules: [
            {
                check: (dimensions) => dimensions.thickness < dimensions.diameter / 2,
                message: 'Thickness must be less than radius'
            }
        ]
    },
    [ProfileType.SQUARE_TUBE]: {
        rules: [
            {
                check: (dimensions) => dimensions.thickness < dimensions.width / 2,
                message: 'Thickness must be less than half of width'
            }
        ]
    },
    [ProfileType.RECTANGULAR_TUBE]: {
        rules: [
            {
                check: (dimensions) => dimensions.thickness < Math.min(dimensions.width, dimensions.height) / 2,
                message: 'Thickness must be less than half of the smallest dimension'
            }
        ]
    },
    [ProfileType.ANGLE]: {
        rules: [
            {
                check: (dimensions) => dimensions.thickness < Math.min(dimensions.width, dimensions.height),
                message: 'Thickness must be less than width and height'
            }
        ]
    }
};

// Profile metadata
export const ProfileMetadata = {
    [ProfileType.ROUND_TUBE]: {
        category: ProfileCategory.CLOSED,
        name: 'Round Tube',
        description: 'Circular hollow section',
        commonUses: ['structural members', 'fluid transport', 'mechanical applications'],
        standards: ['EN 10210', 'EN 10219', 'ASTM A500']
    },
    [ProfileType.SQUARE_TUBE]: {
        category: ProfileCategory.CLOSED,
        name: 'Square Tube',
        description: 'Square hollow section',
        commonUses: ['structural columns', 'beams', 'framing'],
        standards: ['EN 10210', 'EN 10219', 'ASTM A500']
    },
    [ProfileType.RECTANGULAR_TUBE]: {
        category: ProfileCategory.CLOSED,
        name: 'Rectangular Tube',
        description: 'Rectangular hollow section',
        commonUses: ['structural beams', 'framing', 'support members'],
        standards: ['EN 10210', 'EN 10219', 'ASTM A500']
    },
    [ProfileType.ANGLE]: {
        category: ProfileCategory.OPEN,
        name: 'Angle',
        description: 'L-shaped profile',
        commonUses: ['brackets', 'bracing', 'framing'],
        standards: ['EN 10056', 'ASTM A36']
    },
    [ProfileType.CHANNEL]: {
        category: ProfileCategory.OPEN,
        name: 'Channel',
        description: 'C-shaped profile',
        commonUses: ['purlins', 'rails', 'framing'],
        standards: ['EN 10279', 'ASTM A36']
    },
    [ProfileType.I_BEAM]: {
        category: ProfileCategory.OPEN,
        name: 'I-Beam',
        description: 'I-shaped profile',
        commonUses: ['main beams', 'columns', 'structural support'],
        standards: ['EN 10034', 'ASTM A36']
    }
}; 