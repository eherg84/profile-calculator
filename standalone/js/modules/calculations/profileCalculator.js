/**
 * Profile Calculator Module
 * Calculates geometric and physical properties of structural profiles
 */

import { ProfileType } from '../profiles/profileTypes.js';
import { UnitType } from './unitConverter.js';

class ProfileCalculator {
    /**
     * Calculate cross-sectional area
     * @param {string} type Profile type
     * @param {Object} dimensions Profile dimensions
     * @returns {number} Area in square units
     */
    static calculateArea(type, dimensions) {
        switch (type) {
            case ProfileType.ROUND_TUBE: {
                const outerRadius = dimensions.diameter / 2;
                const innerRadius = outerRadius - dimensions.thickness;
                return Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius);
            }

            case ProfileType.SQUARE_TUBE: {
                const outer = dimensions.width * dimensions.width;
                const inner = (dimensions.width - 2 * dimensions.thickness) * (dimensions.width - 2 * dimensions.thickness);
                return outer - inner;
            }

            case ProfileType.RECTANGULAR_TUBE: {
                const outer = dimensions.width * dimensions.height;
                const inner = (dimensions.width - 2 * dimensions.thickness) * (dimensions.height - 2 * dimensions.thickness);
                return outer - inner;
            }

            case ProfileType.ANGLE: {
                return (dimensions.width + dimensions.height - dimensions.thickness) * dimensions.thickness;
            }

            case ProfileType.CHANNEL: {
                return dimensions.height * dimensions.thickness + 
                       2 * dimensions.flange_width * dimensions.thickness;
            }

            case ProfileType.I_BEAM: {
                return dimensions.height * dimensions.web_thickness + 
                       2 * dimensions.width * dimensions.flange_thickness;
            }

            default:
                throw new Error(`Unsupported profile type: ${type}`);
        }
    }

    /**
     * Calculate moment of inertia about x-axis (horizontal)
     * @param {string} type Profile type
     * @param {Object} dimensions Profile dimensions
     * @returns {number} Moment of inertia in units^4
     */
    static calculateMomentOfInertiaX(type, dimensions) {
        switch (type) {
            case ProfileType.ROUND_TUBE: {
                const outerRadius = dimensions.diameter / 2;
                const innerRadius = outerRadius - dimensions.thickness;
                return (Math.PI / 4) * (Math.pow(outerRadius, 4) - Math.pow(innerRadius, 4));
            }

            case ProfileType.SQUARE_TUBE: {
                const outer = Math.pow(dimensions.width, 4) / 12;
                const inner = Math.pow(dimensions.width - 2 * dimensions.thickness, 4) / 12;
                return outer - inner;
            }

            case ProfileType.RECTANGULAR_TUBE: {
                const outer = (dimensions.width * Math.pow(dimensions.height, 3)) / 12;
                const inner = ((dimensions.width - 2 * dimensions.thickness) * 
                             Math.pow(dimensions.height - 2 * dimensions.thickness, 3)) / 12;
                return outer - inner;
            }

            case ProfileType.ANGLE: {
                // About the horizontal axis through the centroid
                const h = dimensions.height;
                const b = dimensions.width;
                const t = dimensions.thickness;
                const A = this.calculateArea(type, dimensions);
                const yc = (h * t * (h/2) + b * t * t/2) / A;
                return (t * Math.pow(h, 3) / 3) + (Math.pow(t, 3) * b / 12) + 
                       (h * t * Math.pow(h/2 - yc, 2)) + (b * t * Math.pow(t/2 - yc, 2));
            }

            case ProfileType.CHANNEL: {
                const h = dimensions.height;
                const b = dimensions.flange_width;
                const t = dimensions.thickness;
                return (t * Math.pow(h, 3) / 12) + 
                       2 * (b * Math.pow(t, 3) / 12 + b * t * Math.pow(h/2, 2));
            }

            case ProfileType.I_BEAM: {
                const h = dimensions.height;
                const b = dimensions.width;
                const tw = dimensions.web_thickness;
                const tf = dimensions.flange_thickness;
                return (tw * Math.pow(h - 2*tf, 3) / 12) + 
                       2 * (b * Math.pow(tf, 3) / 12 + b * tf * Math.pow(h/2 - tf/2, 2));
            }

            default:
                throw new Error(`Unsupported profile type: ${type}`);
        }
    }

    /**
     * Calculate section modulus about x-axis
     * @param {string} type Profile type
     * @param {Object} dimensions Profile dimensions
     * @returns {number} Section modulus in units^3
     */
    static calculateSectionModulusX(type, dimensions) {
        const Ix = this.calculateMomentOfInertiaX(type, dimensions);
        let yMax;

        switch (type) {
            case ProfileType.ROUND_TUBE:
                yMax = dimensions.diameter / 2;
                break;
            case ProfileType.SQUARE_TUBE:
                yMax = dimensions.width / 2;
                break;
            case ProfileType.RECTANGULAR_TUBE:
            case ProfileType.CHANNEL:
            case ProfileType.I_BEAM:
                yMax = dimensions.height / 2;
                break;
            case ProfileType.ANGLE:
                // For angles, use the maximum distance from neutral axis
                const A = this.calculateArea(type, dimensions);
                yMax = Math.max(
                    dimensions.height - (dimensions.height * dimensions.thickness * (dimensions.height/2) + 
                    dimensions.width * dimensions.thickness * dimensions.thickness/2) / A,
                    (dimensions.height * dimensions.thickness * (dimensions.height/2) + 
                    dimensions.width * dimensions.thickness * dimensions.thickness/2) / A
                );
                break;
            default:
                throw new Error(`Unsupported profile type: ${type}`);
        }

        return Ix / yMax;
    }

    /**
     * Calculate weight per unit length
     * @param {string} type Profile type
     * @param {Object} dimensions Profile dimensions
     * @param {number} density Material density
     * @returns {number} Weight per unit length
     */
    static calculateWeightPerLength(type, dimensions, density) {
        const area = this.calculateArea(type, dimensions);
        return area * density;
    }

    /**
     * Calculate radius of gyration
     * @param {string} type Profile type
     * @param {Object} dimensions Profile dimensions
     * @returns {number} Radius of gyration
     */
    static calculateRadiusOfGyration(type, dimensions) {
        const area = this.calculateArea(type, dimensions);
        const Ix = this.calculateMomentOfInertiaX(type, dimensions);
        return Math.sqrt(Ix / area);
    }
}

export default ProfileCalculator; 