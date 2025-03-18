/**
 * Math utility functions
 * Math-related utility functions for the game
 */

const MathUtils = {
    /**
     * Generate a random integer between min and max (inclusive)
     *
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer between min and max
     */
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Generate a random float between min and max
     *
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random float between min and max
     */
    randomFloat: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Clamp a value between min and max
     *
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     */
    clamp: function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Calculate Manhattan distance between two grid positions
     *
     * @param {number} x1 - First position x coordinate
     * @param {number} y1 - First position y coordinate
     * @param {number} x2 - Second position x coordinate
     * @param {number} y2 - Second position y coordinate
     * @returns {number} Manhattan distance
     */
    manhattanDistance: function(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    },

    /**
     * Calculate Euclidean distance between two positions
     *
     * @param {number} x1 - First position x coordinate
     * @param {number} y1 - First position y coordinate
     * @param {number} x2 - Second position x coordinate
     * @param {number} y2 - Second position y coordinate
     * @returns {number} Euclidean distance
     */
    distance: function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },

    /**
     * Linear interpolation between two values
     *
     * @param {number} a - First value
     * @param {number} b - Second value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} Interpolated value
     */
    lerp: function(a, b, t) {
        return a + (b - a) * t;
    },

    /**
     * Check if a point is inside a rectangle
     *
     * @param {number} px - Point x coordinate
     * @param {number} py - Point y coordinate
     * @param {number} rx - Rectangle top-left x coordinate
     * @param {number} ry - Rectangle top-left y coordinate
     * @param {number} rw - Rectangle width
     * @param {number} rh - Rectangle height
     * @returns {boolean} True if point is inside rectangle
     */
    pointInRect: function(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    },

    /**
     * Check if two rectangles overlap
     *
     * @param {number} x1 - First rectangle x
     * @param {number} y1 - First rectangle y
     * @param {number} w1 - First rectangle width
     * @param {number} h1 - First rectangle height
     * @param {number} x2 - Second rectangle x
     * @param {number} y2 - Second rectangle y
     * @param {number} w2 - Second rectangle width
     * @param {number} h2 - Second rectangle height
     * @returns {boolean} True if rectangles overlap
     */
    rectOverlap: function(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    }
};