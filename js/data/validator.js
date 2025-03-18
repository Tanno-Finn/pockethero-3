/**
 * Validator
 * Validates data structures against schemas
 */
const Validator = {
    /**
     * Validation errors from the last validation
     */
    errors: [],

    /**
     * Clear validation errors
     */
    clearErrors: function() {
        this.errors = [];
    },

    /**
     * Get validation errors
     *
     * @returns {Array} Array of validation errors
     */
    getErrors: function() {
        return [...this.errors];
    },

    /**
     * Add a validation error
     *
     * @param {string} message - Error message
     */
    addError: function(message) {
        this.errors.push(message);
    },

    /**
     * Validate a tile definition
     *
     * @param {Object} tile - Tile data to validate
     * @returns {boolean} Whether the tile data is valid
     */
    validateTile: function(tile) {
        this.clearErrors();

        // Check required fields
        if (!tile.id) {
            this.addError('Tile is missing id');
            return false;
        }

        if (!tile.type) {
            this.addError(`Tile ${tile.id} is missing type`);
            return false;
        }

        // Check that tile type is valid
        const validTypes = Object.values(CONSTANTS.TILE_TYPES);
        if (!validTypes.includes(tile.type)) {
            this.addError(`Tile ${tile.id} has invalid type: ${tile.type}`);
            return false;
        }

        // Check tags
        if (tile.tags && !Array.isArray(tile.tags)) {
            this.addError(`Tile ${tile.id} has invalid tags (not an array)`);
            return false;
        }

        // Check properties
        if (tile.properties && typeof tile.properties !== 'object') {
            this.addError(`Tile ${tile.id} has invalid properties (not an object)`);
            return false;
        }

        return true;
    },

    /**
     * Validate an entity definition
     *
     * @param {Object} entity - Entity data to validate
     * @returns {boolean} Whether the entity data is valid
     */
    validateEntity: function(entity) {
        this.clearErrors();

        // Check required fields
        if (!entity.id) {
            this.addError('Entity is missing id');
            return false;
        }

        if (!entity.type) {
            this.addError(`Entity ${entity.id} is missing type`);
            return false;
        }

        // Check that entity type is valid
        const validTypes = Object.values(CONSTANTS.ENTITY_TYPES);
        if (!validTypes.includes(entity.type)) {
            this.addError(`Entity ${entity.id} has invalid type: ${entity.type}`);
            return false;
        }

        // Check visual properties
        if (entity.shape && !Object.values(CONSTANTS.SHAPES).includes(entity.shape)) {
            this.addError(`Entity ${entity.id} has invalid shape: ${entity.shape}`);
            return false;
        }

        // Check tags
        if (entity.tags && !Array.isArray(entity.tags)) {
            this.addError(`Entity ${entity.id} has invalid tags (not an array)`);
            return false;
        }

        // Check properties
        if (entity.properties && typeof entity.properties !== 'object') {
            this.addError(`Entity ${entity.id} has invalid properties (not an object)`);
            return false;
        }

        // Type-specific validation
        if (entity.type === CONSTANTS.ENTITY_TYPES.NPC) {
            if (entity.dialog && typeof entity.dialog !== 'string' && typeof entity.dialog !== 'object') {
                this.addError(`NPC ${entity.id} has invalid dialog (not a string or object)`);
                return false;
            }
        }

        if (entity.type === CONSTANTS.ENTITY_TYPES.ITEM) {
            if (entity.interactable !== undefined && typeof entity.interactable !== 'boolean') {
                this.addError(`Item ${entity.id} has invalid interactable property (not a boolean)`);
                return false;
            }
        }

        return true;
    },

    /**
     * Validate a zone definition
     *
     * @param {Object} zone - Zone data to validate
     * @returns {boolean} Whether the zone data is valid
     */
    validateZone: function(zone) {
        this.clearErrors();

        // Check required fields
        if (!zone.id) {
            this.addError('Zone is missing id');
            return false;
        }

        // Check dimensions
        if (zone.width === undefined || typeof zone.width !== 'number' || zone.width <= 0) {
            this.addError(`Zone ${zone.id} has invalid width`);
            return false;
        }

        if (zone.height === undefined || typeof zone.height !== 'number' || zone.height <= 0) {
            this.addError(`Zone ${zone.id} has invalid height`);
            return false;
        }

        // Check defaultTile
        if (!zone.defaultTile) {
            this.addError(`Zone ${zone.id} is missing defaultTile`);
            return false;
        }

        // Check tiles
        if (zone.tiles && !Array.isArray(zone.tiles)) {
            this.addError(`Zone ${zone.id} has invalid tiles (not an array)`);
            return false;
        }

        if (zone.tiles) {
            for (let i = 0; i < zone.tiles.length; i++) {
                const tile = zone.tiles[i];

                if (tile.x === undefined || typeof tile.x !== 'number') {
                    this.addError(`Zone ${zone.id} has tile with invalid x at index ${i}`);
                    return false;
                }

                if (tile.y === undefined || typeof tile.y !== 'number') {
                    this.addError(`Zone ${zone.id} has tile with invalid y at index ${i}`);
                    return false;
                }

                if (!tile.type) {
                    this.addError(`Zone ${zone.id} has tile without type at index ${i}`);
                    return false;
                }
            }
        }

        // Check entities
        if (zone.entities && !Array.isArray(zone.entities)) {
            this.addError(`Zone ${zone.id} has invalid entities (not an array)`);
            return false;
        }

        if (zone.entities) {
            for (let i = 0; i < zone.entities.length; i++) {
                const entity = zone.entities[i];

                if (entity.x === undefined || typeof entity.x !== 'number') {
                    this.addError(`Zone ${zone.id} has entity with invalid x at index ${i}`);
                    return false;
                }

                if (entity.y === undefined || typeof entity.y !== 'number') {
                    this.addError(`Zone ${zone.id} has entity with invalid y at index ${i}`);
                    return false;
                }

                if (!entity.type) {
                    this.addError(`Zone ${zone.id} has entity without type at index ${i}`);
                    return false;
                }
            }
        }

        // Check teleporters
        if (zone.teleporters && !Array.isArray(zone.teleporters)) {
            this.addError(`Zone ${zone.id} has invalid teleporters (not an array)`);
            return false;
        }

        if (zone.teleporters) {
            for (let i = 0; i < zone.teleporters.length; i++) {
                const teleporter = zone.teleporters[i];

                if (teleporter.x === undefined || typeof teleporter.x !== 'number') {
                    this.addError(`Zone ${zone.id} has teleporter with invalid x at index ${i}`);
                    return false;
                }

                if (teleporter.y === undefined || typeof teleporter.y !== 'number') {
                    this.addError(`Zone ${zone.id} has teleporter with invalid y at index ${i}`);
                    return false;
                }

                if (!teleporter.targetZone) {
                    this.addError(`Zone ${zone.id} has teleporter without targetZone at index ${i}`);
                    return false;
                }

                if (teleporter.targetX === undefined || typeof teleporter.targetX !== 'number') {
                    this.addError(`Zone ${zone.id} has teleporter with invalid targetX at index ${i}`);
                    return false;
                }

                if (teleporter.targetY === undefined || typeof teleporter.targetY !== 'number') {
                    this.addError(`Zone ${zone.id} has teleporter with invalid targetY at index ${i}`);
                    return false;
                }
            }
        }

        return true;
    },

    /**
     * Validate an interaction definition
     *
     * @param {Object} interaction - Interaction data to validate
     * @returns {boolean} Whether the interaction data is valid
     */
    validateInteraction: function(interaction) {
        this.clearErrors();

        // Check required fields
        if (!interaction.id) {
            this.addError('Interaction is missing id');
            return false;
        }

        // Check requiredTags
        if (interaction.requiredTags && !Array.isArray(interaction.requiredTags)) {
            this.addError(`Interaction ${interaction.id} has invalid requiredTags (not an array)`);
            return false;
        }

        // Check directions
        if (interaction.directions) {
            if (!Array.isArray(interaction.directions)) {
                this.addError(`Interaction ${interaction.id} has invalid directions (not an array)`);
                return false;
            }

            const validDirections = Object.values(CONSTANTS.DIRECTIONS);
            for (const direction of interaction.directions) {
                if (!validDirections.includes(direction)) {
                    this.addError(`Interaction ${interaction.id} has invalid direction: ${direction}`);
                    return false;
                }
            }
        }

        // Check eventType
        if (!interaction.eventType) {
            this.addError(`Interaction ${interaction.id} is missing eventType`);
            return false;
        }

        return true;
    },

    /**
     * Generic validator for any data type
     *
     * @param {Object} data - Data to validate
     * @param {string} schemaType - Type of schema to validate against
     * @returns {boolean} Whether the data is valid
     */
    validate: function(data, schemaType) {
        this.clearErrors();

        switch (schemaType) {
            case 'tile':
                return this.validateTile(data);

            case 'entity':
                return this.validateEntity(data);

            case 'zone':
                return this.validateZone(data);

            case 'interaction':
                return this.validateInteraction(data);

            default:
                this.addError(`Unknown schema type: ${schemaType}`);
                return false;
        }
    }
};