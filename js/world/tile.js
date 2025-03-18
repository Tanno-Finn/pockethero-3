/**
 * Tile class
 * Represents a single tile in the grid
 */
class Tile {
    /**
     * Create a new tile
     *
     * @param {Object} config - Tile configuration
     */
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.type = config.type || CONSTANTS.TILE_TYPES.GRASS;
        this.properties = config.properties || {};
        this.tags = config.tags || [];

        // Set default properties based on type
        this.setDefaultPropertiesByType();
    }

    /**
     * Set default properties based on tile type
     */
    setDefaultPropertiesByType() {
        // Set default visual properties based on type
        switch (this.type) {
            case CONSTANTS.TILE_TYPES.GRASS:
                this.color = this.properties.color || '#7CFC00'; // Light green
                this.tags = this.tags.concat(['passable', 'natural']);
                break;

            case CONSTANTS.TILE_TYPES.FOREST:
                this.color = this.properties.color || '#228B22'; // Forest green
                this.tags = this.tags.concat(['passable', 'natural', 'slow']);
                break;

            case CONSTANTS.TILE_TYPES.WATER:
                this.color = this.properties.color || '#1E90FF'; // Dodger blue
                this.tags = this.tags.concat(['blocking', 'natural', 'water']);
                break;

            case CONSTANTS.TILE_TYPES.ROCK:
                this.color = this.properties.color || '#A9A9A9'; // Dark gray
                this.tags = this.tags.concat(['blocking', 'natural']);
                break;

            case CONSTANTS.TILE_TYPES.TELEPORTER:
                this.color = this.properties.color || '#800080'; // Purple
                this.tags = this.tags.concat(['passable', 'teleporter']);
                break;

            default:
                this.color = this.properties.color || '#FFFFFF'; // White
                // No default tags for unknown types
                break;
        }
    }

    /**
     * Check if this tile has a specific tag
     *
     * @param {string} tag - Tag to check
     * @returns {boolean} Whether the tile has the tag
     */
    hasTag(tag) {
        return this.tags.includes(tag);
    }

    /**
     * Add a tag to this tile
     *
     * @param {string} tag - Tag to add
     */
    addTag(tag) {
        if (!this.hasTag(tag)) {
            this.tags.push(tag);
        }
    }

    /**
     * Remove a tag from this tile
     *
     * @param {string} tag - Tag to remove
     */
    removeTag(tag) {
        const index = this.tags.indexOf(tag);
        if (index !== -1) {
            this.tags.splice(index, 1);
        }
    }

    /**
     * Get a property value
     *
     * @param {string} key - Property key
     * @param {*} defaultValue - Default value if property doesn't exist
     * @returns {*} Property value or default
     */
    getProperty(key, defaultValue) {
        return this.properties.hasOwnProperty(key) ? this.properties[key] : defaultValue;
    }

    /**
     * Set a property value
     *
     * @param {string} key - Property key
     * @param {*} value - Property value
     */
    setProperty(key, value) {
        this.properties[key] = value;
    }

    /**
     * Generate a serializable representation of this tile
     *
     * @returns {Object} Serialized tile data
     */
    serialize() {
        return {
            x: this.x,
            y: this.y,
            type: this.type,
            properties: {...this.properties},
            tags: [...this.tags]
        };
    }
}