import { UnitConverter, UnitType, UnitSystem } from '../js/modules/calculations/unitConverter.js';

describe('UnitConverter', () => {
    let converter;
    let mockEventBus;

    beforeEach(() => {
        mockEventBus = {
            emit: jest.fn()
        };
        converter = new UnitConverter(mockEventBus);
    });

    describe('Unit System', () => {
        test('should initialize with metric system', () => {
            expect(converter.currentSystem).toBe(UnitSystem.METRIC);
        });

        test('should change unit system', () => {
            converter.setUnitSystem(UnitSystem.IMPERIAL);
            expect(converter.currentSystem).toBe(UnitSystem.IMPERIAL);
            expect(mockEventBus.emit).toHaveBeenCalledWith('units:systemChanged', { system: UnitSystem.IMPERIAL });
        });

        test('should throw error for invalid unit system', () => {
            expect(() => converter.setUnitSystem('invalid')).toThrow('Invalid unit system: invalid');
        });
    });

    describe('Unit Conversion', () => {
        test('should convert length units correctly', () => {
            expect(converter.convert(1000, 'mm', 'm', UnitType.LENGTH)).toBe(1);
            expect(converter.convert(1, 'm', 'mm', UnitType.LENGTH)).toBe(1000);
            expect(converter.convert(1, 'in', 'mm', UnitType.LENGTH)).toBe(25.4);
        });

        test('should convert weight units correctly', () => {
            expect(converter.convert(1, 'kg', 'g', UnitType.WEIGHT)).toBe(1000);
            expect(converter.convert(1, 'lb', 'kg', UnitType.WEIGHT)).toBeCloseTo(0.45359237);
            expect(converter.convert(16, 'oz', 'lb', UnitType.WEIGHT)).toBe(1);
        });

        test('should convert area units correctly', () => {
            expect(converter.convert(1, 'm2', 'cm2', UnitType.AREA)).toBe(10000);
            expect(converter.convert(1, 'in2', 'mm2', UnitType.AREA)).toBeCloseTo(645.16);
        });

        test('should convert volume units correctly', () => {
            expect(converter.convert(1, 'm3', 'cm3', UnitType.VOLUME)).toBe(1000000);
            expect(converter.convert(1, 'ft3', 'in3', UnitType.VOLUME)).toBeCloseTo(1728);
        });

        test('should throw error for invalid unit type', () => {
            expect(() => converter.convert(1, 'mm', 'm', 'invalid')).toThrow('Invalid unit type: invalid');
        });

        test('should throw error for invalid unit conversion', () => {
            expect(() => converter.convert(1, 'invalid', 'm', UnitType.LENGTH)).toThrow('Invalid unit conversion: invalid to m');
        });
    });

    describe('Dimension Conversion', () => {
        test('should convert all numeric dimensions', () => {
            const dimensions = {
                width: 100,
                height: 200,
                thickness: 5,
                length: 1000
            };
            const converted = converter.convertDimensions(dimensions, 'mm', 'cm');
            expect(converted).toEqual({
                width: 10,
                height: 20,
                thickness: 0.5,
                length: 100
            });
        });

        test('should handle non-numeric values', () => {
            const dimensions = {
                width: 100,
                height: 'unknown',
                thickness: 5
            };
            const converted = converter.convertDimensions(dimensions, 'mm', 'cm');
            expect(converted).toEqual({
                width: 10,
                height: 'unknown',
                thickness: 0.5
            });
        });
    });

    describe('Unit Formatting', () => {
        test('should format value with unit', () => {
            expect(converter.formatWithUnit(10.1234, 'mm')).toBe('10.12 mm');
            expect(converter.formatWithUnit(10.1234, 'mm', 3)).toBe('10.123 mm');
        });
    });

    describe('Default Units', () => {
        test('should return correct default units for metric system', () => {
            expect(converter.getDefaultUnit(UnitType.LENGTH)).toBe('mm');
            expect(converter.getDefaultUnit(UnitType.WEIGHT)).toBe('kg');
        });

        test('should return correct default units for imperial system', () => {
            converter.setUnitSystem(UnitSystem.IMPERIAL);
            expect(converter.getDefaultUnit(UnitType.LENGTH)).toBe('in');
            expect(converter.getDefaultUnit(UnitType.WEIGHT)).toBe('lb');
        });
    });

    describe('Available Units', () => {
        test('should return all available units for a type', () => {
            expect(converter.getAvailableUnits(UnitType.LENGTH)).toEqual(['mm', 'cm', 'm', 'in', 'ft']);
            expect(converter.getAvailableUnits(UnitType.WEIGHT)).toEqual(['kg', 'g', 'lb', 'oz']);
        });

        test('should return empty array for invalid type', () => {
            expect(converter.getAvailableUnits('invalid')).toEqual([]);
        });
    });
}); 