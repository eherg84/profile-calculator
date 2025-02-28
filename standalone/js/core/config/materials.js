/**
 * Materials Configuration
 * Centralizes all material-related configurations and constants
 */

// Material Types
export const MaterialType = {
    STEEL: 'steel',
    ALUMINUM: 'aluminum',
    STAINLESS_STEEL: 'stainless_steel',
    OTHER: 'other'
};

// Grade Categories
export const GradeCategory = {
    STRUCTURAL: 'structural',
    COMMERCIAL: 'commercial',
    SPECIALTY: 'specialty'
};

// Default material properties by type and grade
export const DefaultProperties = {
    [MaterialType.STEEL]: {
        'A36': {
            density: 7850, // kg/m³
            yieldStrength: 250, // MPa
            tensileStrength: 400, // MPa
            elasticModulus: 200000 // MPa
        },
        'A572-50': {
            density: 7850,
            yieldStrength: 345,
            tensileStrength: 450,
            elasticModulus: 200000
        },
        'A992': {
            density: 7850,
            yieldStrength: 345,
            tensileStrength: 450,
            elasticModulus: 200000
        },
        'A500': {
            density: 7850,
            yieldStrength: 315,
            tensileStrength: 400,
            elasticModulus: 200000
        }
    },
    [MaterialType.ALUMINUM]: {
        '6061-T6': {
            density: 2700,
            yieldStrength: 240,
            tensileStrength: 290,
            elasticModulus: 68900
        },
        '6063-T6': {
            density: 2700,
            yieldStrength: 170,
            tensileStrength: 205,
            elasticModulus: 68900
        },
        '5052-H32': {
            density: 2680,
            yieldStrength: 195,
            tensileStrength: 230,
            elasticModulus: 70300
        },
        '3003-H14': {
            density: 2730,
            yieldStrength: 145,
            tensileStrength: 150,
            elasticModulus: 68900
        }
    },
    [MaterialType.STAINLESS_STEEL]: {
        '304': {
            density: 8000,
            yieldStrength: 205,
            tensileStrength: 515,
            elasticModulus: 193000
        },
        '316': {
            density: 8000,
            yieldStrength: 205,
            tensileStrength: 515,
            elasticModulus: 193000
        },
        '316L': {
            density: 8000,
            yieldStrength: 170,
            tensileStrength: 485,
            elasticModulus: 193000
        },
        '430': {
            density: 7750,
            yieldStrength: 205,
            tensileStrength: 450,
            elasticModulus: 200000
        }
    }
};

// Material property validation rules
export const PropertyValidation = {
    density: {
        min: 1000,    // Minimum density in kg/m³
        max: 20000,   // Maximum density in kg/m³
        required: true
    },
    yieldStrength: {
        min: 50,      // Minimum yield strength in MPa
        max: 2000,    // Maximum yield strength in MPa
        required: true
    },
    tensileStrength: {
        min: 100,     // Minimum tensile strength in MPa
        max: 2500,    // Maximum tensile strength in MPa
        required: true
    },
    elasticModulus: {
        min: 50000,   // Minimum elastic modulus in MPa
        max: 300000,  // Maximum elastic modulus in MPa
        required: true
    }
};

// Grade validation rules
export const GradeValidation = {
    minLength: 2,     // Minimum grade designation length
    maxLength: 20,    // Maximum grade designation length
    pattern: /^[A-Z0-9\-]+$/i  // Allowed characters in grade designation
};

// Material metadata
export const MaterialMetadata = {
    [MaterialType.STEEL]: {
        name: 'Steel',
        description: 'Carbon and low-alloy steels for structural applications',
        standards: ['ASTM', 'EN'],
        commonApplications: ['structural members', 'beams', 'columns']
    },
    [MaterialType.ALUMINUM]: {
        name: 'Aluminum',
        description: 'Aluminum alloys for lightweight structural applications',
        standards: ['AA', 'EN'],
        commonApplications: ['lightweight structures', 'non-corrosive applications']
    },
    [MaterialType.STAINLESS_STEEL]: {
        name: 'Stainless Steel',
        description: 'Corrosion-resistant steel alloys',
        standards: ['ASTM', 'EN'],
        commonApplications: ['corrosive environments', 'architectural applications']
    },
    [MaterialType.OTHER]: {
        name: 'Other',
        description: 'Other material types',
        standards: [],
        commonApplications: ['special applications']
    }
}; 