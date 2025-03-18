/**
 * Helper utility functions
 * General purpose utility functions for the game
 */

const Helpers = {
    /**
     * Generate a unique ID
     *
     * @returns {string} A unique ID string
     */
    generateId: function() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Deep clone an object
     *
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Check if an entity has a specific tag
     *
     * @param {Object} entity - Entity to check
     * @param {string} tag - Tag to look for
     * @returns {boolean} True if entity has the tag
     */
    hasTag: function(entity, tag) {
        return entity && entity.tags && entity.tags.includes(tag);
    },

    /**
     * Check if all required tags are present
     *
     * @param {Object} entity - Entity to check
     * @param {Array<string>} requiredTags - Array of required tags
     * @returns {boolean} True if all required tags are present
     */
    hasAllTags: function(entity, requiredTags) {
        if (!entity || !entity.tags || !requiredTags) return false;
        return requiredTags.every(tag => entity.tags.includes(tag));
    },

    /**
     * Convert grid coordinates to screen coordinates
     *
     * @param {number} gridX - X position on grid
     * @param {number} gridY - Y position on grid
     * @returns {Object} {x, y} in screen coordinates
     */
    gridToScreen: function(gridX, gridY) {
        return {
            x: gridX * CONSTANTS.TILE_SIZE,
            y: gridY * CONSTANTS.TILE_SIZE
        };
    },

    /**
     * Convert screen coordinates to grid coordinates
     *
     * @param {number} screenX - X position on screen
     * @param {number} screenY - Y position on screen
     * @returns {Object} {x, y} in grid coordinates
     */
    screenToGrid: function(screenX, screenY) {
        return {
            x: Math.floor(screenX / CONSTANTS.TILE_SIZE),
            y: Math.floor(screenY / CONSTANTS.TILE_SIZE)
        };
    },

    /**
     * Get grid direction from two positions
     *
     * @param {Object} fromPos - Starting position {x, y}
     * @param {Object} toPos - Ending position {x, y}
     * @returns {string} Direction constant
     */
    getDirection: function(fromPos, toPos) {
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;

        // Determine the primary direction
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? CONSTANTS.DIRECTIONS.EAST : CONSTANTS.DIRECTIONS.WEST;
        } else {
            return dy > 0 ? CONSTANTS.DIRECTIONS.SOUTH : CONSTANTS.DIRECTIONS.NORTH;
        }
    },

    /**
     * Get the position in front of an entity based on its direction
     *
     * @param {Object} entity - Entity with position and direction
     * @returns {Object} Position {x, y} in front of entity
     */
    getPositionInFront: function(entity) {
        const pos = { x: entity.position.x, y: entity.position.y };

        switch (entity.direction) {
            case CONSTANTS.DIRECTIONS.NORTH:
                pos.y -= 1;
                break;
            case CONSTANTS.DIRECTIONS.EAST:
                pos.x += 1;
                break;
            case CONSTANTS.DIRECTIONS.SOUTH:
                pos.y += 1;
                break;
            case CONSTANTS.DIRECTIONS.WEST:
                pos.x -= 1;
                break;
        }

        return pos;
    },

    /**
     * Debounce a function
     *
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
};