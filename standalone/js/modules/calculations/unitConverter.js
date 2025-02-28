/**
 * Unit Converter for Standalone Application
 * Handles unit conversions for dimensions and weights
 */

// Unit Types
const UnitType = {
    LENGTH: 'length',
    WEIGHT: 'weight',
    AREA: 'area',
    VOLUME: 'volume'
};

// Unit Systems
const UnitSystem = {
    METRIC: 'metric',
    IMPERIAL: 'imperial'
};

// Conversion factors (to base units: mm for length, kg for weight)
const ConversionFactors = {
    length: {
        mm: 1,
        cm: 10,
        m: 1000,
        in: 25.4,
        ft: 304.8
    },
    weight: {
        kg: 1,
        g: 0.001,
        lb: 0.45359237,
        oz: 0.028349523125
    },
    area: {
        mm2: 1,
        cm2: 100,
        m2: 1000000,
        in2: 645.16,
        ft2: 92903.04
    },
    volume: {
        mm3: 1,
        cm3: 1000,
        m3: 1000000000,
        in3: 16387.064,
        ft3: 28316846.592
    }
};

class UnitConverter {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.currentSystem = UnitSystem.METRIC;
    }

    /**
     * Set the current unit system
     * @param {string} system Unit system to use
     */
    setUnitSystem(system) {
        if (!Object.values(UnitSystem).includes(system)) {
            throw new Error(`Invalid unit system: ${system}`);
        }
        this.currentSystem = system;
        this.eventBus.emit('units:systemChanged', { system });
    }

    /**
     * Convert a value from one unit to another
     * @param {number} value Value to convert
     * @param {string} fromUnit Unit to convert from
     * @param {string} toUnit Unit to convert to
     * @param {string} type Type of unit (length, weight, area, volume)
     * @returns {number} Converted value
     */
    convert(value, fromUnit, toUnit, type) {
        if (!Object.values(UnitType).includes(type)) {
            throw new Error(`Invalid unit type: ${type}`);
        }

        const factors = ConversionFactors[type];
        if (!factors[fromUnit] || !factors[toUnit]) {
            throw new Error(`Invalid unit conversion: ${fromUnit} to ${toUnit}`);
        }

        // Convert to base unit first, then to target unit
        const baseValue = value * factors[fromUnit];
        return baseValue / factors[toUnit];
    }

    /**
     * Convert dimensions object from one unit to another
     * @param {Object} dimensions Dimensions object
     * @param {string} fromUnit Unit to convert from
     * @param {string} toUnit Unit to convert to
     * @returns {Object} Converted dimensions
     */
    convertDimensions(dimensions, fromUnit, toUnit) {
        const result = {};
        for (const [key, value] of Object.entries(dimensions)) {
            if (typeof value === 'number') {
                result[key] = this.convert(value, fromUnit, toUnit, UnitType.LENGTH);
            } else {
                result[key] = value;
            }
        }
        return result;
    }

    /**
     * Format a value with its unit
     * @param {number} value Value to format
     * @param {string} unit Unit of the value
     * @param {number} precision Number of decimal places
     * @returns {string} Formatted value with unit
     */
    formatWithUnit(value, unit, precision = 2) {
        return `${value.toFixed(precision)} ${unit}`;
    }

    /**
     * Get the default unit for a type in the current system
     * @param {string} type Unit type
     * @returns {string} Default unit
     */
    getDefaultUnit(type) {
        const defaults = {
            [UnitSystem.METRIC]: {
                [UnitType.LENGTH]: 'mm',
                [UnitType.WEIGHT]: 'kg',
                [UnitType.AREA]: 'mm2',
                [UnitType.VOLUME]: 'mm3'
            },
            [UnitSystem.IMPERIAL]: {
                [UnitType.LENGTH]: 'in',
                [UnitType.WEIGHT]: 'lb',
                [UnitType.AREA]: 'in2',
                [UnitType.VOLUME]: 'in3'
            }
        };

        return defaults[this.currentSystem][type];
    }

    /**
     * Get available units for a type
     * @param {string} type Unit type
     * @returns {string[]} Array of available units
     */
    getAvailableUnits(type) {
        return Object.keys(ConversionFactors[type] || {});
    }
}

export { UnitConverter, UnitType, UnitSystem }; 