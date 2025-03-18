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
     * @param {Object|Array} tile - Tile data to validate (or array of tiles)
     * @returns {boolean} Whether the tile data is valid
     */
    validateTile: function(tile) {
        Validator.clearErrors();

        // If it's an array, validate each item
        if (Array.isArray(tile)) {
            console.log("Validating array of tiles:", tile.length);
            return tile.every((item, index) => {
                const isValid = Validator.validateTileObject(item);
                if (!isValid) {
                    Validator.addError(`Item at index ${index} is invalid`);
                }
                return isValid;
            });
        }

        // Otherwise validate as single object
        return Validator.validateTileObject(tile);
    },

    /**
     * Validate a single tile object
     *
     * @param {Object} tile - Tile object to validate
     * @returns {boolean} Whether the tile is valid
     */
    validateTileObject: function(tile) {
        // Check required fields
        if (!tile.id) {
            Validator.addError('Tile is missing id');
            return false;
        }

        if (!tile.type) {
            Validator.addError(`Tile ${tile.id} is missing type`);
            return false;
        }

        // Check that tile type is valid
        const validTypes = Object.values(CONSTANTS.TILE_TYPES);
        if (!validTypes.includes(tile.type)) {
            Validator.addError(`Tile ${tile.id} has invalid type: ${tile.type}`);
            return false;
        }

        // Check tags
        if (tile.tags && !Array.isArray(tile.tags)) {
            Validator.addError(`Tile ${tile.id} has invalid tags (not an array)`);
            return false;
        }

        // Check properties
        if (tile.properties && typeof tile.properties !== 'object') {
            Validator.addError(`Tile ${tile.id} has invalid properties (not an object)`);
            return false;
        }

        return true;
    },

    /**
     * Validate an entity definition
     *
     * @param {Object|Array} entity - Entity data to validate (or array of entities)
     * @returns {boolean} Whether the entity data is valid
     */
    validateEntity: function(entity) {
        Validator.clearErrors();

        // If it's an array, validate each item
        if (Array.isArray(entity)) {
            console.log("Validating array of entities:", entity.length);
            return entity.every((item, index) => {
                const isValid = Validator.validateEntityObject(item);
                if (!isValid) {
                    Validator.addError(`Item at index ${index} is invalid`);
                }
                return isValid;
            });
        }

        // Otherwise validate as single object
        return Validator.validateEntityObject(entity);
    },

    /**
     * Validate a single entity object
     *
     * @param {Object} entity - Entity object to validate
     * @returns {boolean} Whether the entity is valid
     */
    validateEntityObject: function(entity) {
        // Check required fields
        if (!entity.id) {
            Validator.addError('Entity is missing id');
            return false;
        }

        if (!entity.type) {
            Validator.addError(`Entity ${entity.id} is missing type`);
            return false;
        }

        // Check that entity type is valid
        const validTypes = Object.values(CONSTANTS.ENTITY_TYPES);
        if (!validTypes.includes(entity.type)) {
            Validator.addError(`Entity ${entity.id} has invalid type: ${entity.type}`);
            return false;
        }

        // Check visual properties
        if (entity.shape && !Object.values(CONSTANTS.SHAPES).includes(entity.shape)) {
            Validator.addError(`Entity ${entity.id} has invalid shape: ${entity.shape}`);
            return false;
        }

        // Check tags
        if (entity.tags && !Array.isArray(entity.tags)) {
            Validator.addError(`Entity ${entity.id} has invalid tags (not an array)`);
            return false;
        }

        // Check properties
        if (entity.properties && typeof entity.properties !== 'object') {
            Validator.addError(`Entity ${entity.id} has invalid properties (not an object)`);
            return false;
        }

        // Type-specific validation
        if (entity.type === CONSTANTS.ENTITY_TYPES.NPC) {
            if (entity.dialog && typeof entity.dialog !== 'string' && typeof entity.dialog !== 'object') {
                Validator.addError(`NPC ${entity.id} has invalid dialog (not a string or object)`);
                return false;
            }
        }

        if (entity.type === CONSTANTS.ENTITY_TYPES.ITEM) {
            if (entity.interactable !== undefined && typeof entity.interactable !== 'boolean') {
                Validator.addError(`Item ${entity.id} has invalid interactable property (not a boolean)`);
                return false;
            }
        }

        return true;
    },

    /**
     * Validate a zone definition
     *
     * @param {Object|Array} zone - Zone data to validate (or array of zones)
     * @returns {boolean} Whether the zone data is valid
     */
    validateZone: function(zone) {
        Validator.clearErrors();

        // If it's an array, validate each item
        if (Array.isArray(zone)) {
            console.log("Validating array of zones:", zone.length);
            return zone.every((item, index) => {
                const isValid = Validator.validateZoneObject(item);
                if (!isValid) {
                    Validator.addError(`Item at index ${index} is invalid`);
                }
                return isValid;
            });
        }

        // Otherwise validate as single object
        return Validator.validateZoneObject(zone);
    },

    /**
     * Validate a single zone object
     *
     * @param {Object} zone - Zone object to validate
     * @returns {boolean} Whether the zone is valid
     */
    validateZoneObject: function(zone) {
        // Check required fields
        if (!zone.id) {
            Validator.addError('Zone is missing id');
            return false;
        }

        // Check dimensions
        if (zone.width === undefined || typeof zone.width !== 'number' || zone.width <= 0) {
            Validator.addError(`Zone ${zone.id} has invalid width`);
            return false;
        }

        if (zone.height === undefined || typeof zone.height !== 'number' || zone.height <= 0) {
            Validator.addError(`Zone ${zone.id} has invalid height`);
            return false;
        }

        // Check defaultTile
        if (!zone.defaultTile) {
            Validator.addError(`Zone ${zone.id} is missing defaultTile`);
            return false;
        }

        // Check tiles
        if (zone.tiles && !Array.isArray(zone.tiles)) {
            Validator.addError(`Zone ${zone.id} has invalid tiles (not an array)`);
            return false;
        }

        if (zone.tiles) {
            for (let i = 0; i < zone.tiles.length; i++) {
                const tile = zone.tiles[i];

                if (tile.x === undefined || typeof tile.x !== 'number') {
                    Validator.addError(`Zone ${zone.id} has tile with invalid x at index ${i}`);
                    return false;
                }

                if (tile.y === undefined || typeof tile.y !== 'number') {
                    Validator.addError(`Zone ${zone.id} has tile with invalid y at index ${i}`);
                    return false;
                }

                if (!tile.type) {
                    Validator.addError(`Zone ${zone.id} has tile without type at index ${i}`);
                    return false;
                }
            }
        }

        // Check entities
        if (zone.entities && !Array.isArray(zone.entities)) {
            Validator.addError(`Zone ${zone.id} has invalid entities (not an array)`);
            return false;
        }

        if (zone.entities) {
            for (let i = 0; i < zone.entities.length; i++) {
                const entity = zone.entities[i];

                if (entity.x === undefined || typeof entity.x !== 'number') {
                    Validator.addError(`Zone ${zone.id} has entity with invalid x at index ${i}`);
                    return false;
                }

                if (entity.y === undefined || typeof entity.y !== 'number') {
                    Validator.addError(`Zone ${zone.id} has entity with invalid y at index ${i}`);
                    return false;
                }

                if (!entity.type) {
                    Validator.addError(`Zone ${zone.id} has entity without type at index ${i}`);
                    return false;
                }
            }
        }

        // Check teleporters
        if (zone.teleporters && !Array.isArray(zone.teleporters)) {
            Validator.addError(`Zone ${zone.id} has invalid teleporters (not an array)`);
            return false;
        }

        if (zone.teleporters) {
            for (let i = 0; i < zone.teleporters.length; i++) {
                const teleporter = zone.teleporters[i];

                if (teleporter.x === undefined || typeof teleporter.x !== 'number') {
                    Validator.addError(`Zone ${zone.id} has teleporter with invalid x at index ${i}`);
                    return false;
                }

                if (teleporter.y === undefined || typeof teleporter.y !== 'number') {
                    Validator.addError(`Zone ${zone.id} has teleporter with invalid y at index ${i}`);
                    return false;
                }

                if (!teleporter.targetZone) {
                    Validator.addError(`Zone ${zone.id} has teleporter without targetZone at index ${i}`);
                    return false;
                }

                if (teleporter.targetX === undefined || typeof teleporter.targetX !== 'number') {
                    Validator.addError(`Zone ${zone.id} has teleporter with invalid targetX at index ${i}`);
                    return false;
                }

                if (teleporter.targetY === undefined || typeof teleporter.targetY !== 'number') {
                    Validator.addError(`Zone ${zone.id} has teleporter with invalid targetY at index ${i}`);
                    return false;
                }
            }
        }

        return true;
    },

    /**
     * Validate an interaction definition
     *
     * @param {Object|Array} interaction - Interaction data to validate (or array of interactions)
     * @returns {boolean} Whether the interaction data is valid
     */
    validateInteraction: function(interaction) {
        Validator.clearErrors();

        // If it's an array, validate each item
        if (Array.isArray(interaction)) {
            console.log("Validating array of interactions:", interaction.length);
            return interaction.every((item, index) => {
                const isValid = Validator.validateInteractionObject(item);
                if (!isValid) {
                    Validator.addError(`Item at index ${index} is invalid`);
                }
                return isValid;
            });
        }

        // Otherwise validate as single object
        return Validator.validateInteractionObject(interaction);
    },

    /**
     * Validate a single interaction object
     *
     * @param {Object} interaction - Interaction object to validate
     * @returns {boolean} Whether the interaction is valid
     */
    validateInteractionObject: function(interaction) {
        // Check required fields
        if (!interaction.id) {
            Validator.addError('Interaction is missing id');
            return false;
        }

        // Check requiredTags
        if (interaction.requiredTags && !Array.isArray(interaction.requiredTags)) {
            Validator.addError(`Interaction ${interaction.id} has invalid requiredTags (not an array)`);
            return false;
        }

        // Check directions
        if (interaction.directions) {
            if (!Array.isArray(interaction.directions)) {
                Validator.addError(`Interaction ${interaction.id} has invalid directions (not an array)`);
                return false;
            }

            const validDirections = Object.values(CONSTANTS.DIRECTIONS);
            for (const direction of interaction.directions) {
                if (!validDirections.includes(direction)) {
                    Validator.addError(`Interaction ${interaction.id} has invalid direction: ${direction}`);
                    return false;
                }
            }
        }

        // Check eventType
        if (!interaction.eventType) {
            Validator.addError(`Interaction ${interaction.id} is missing eventType`);
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
        Validator.clearErrors();

        switch (schemaType) {
            case 'tile':
                return Validator.validateTile(data);

            case 'entity':
                return Validator.validateEntity(data);

            case 'zone':
                return Validator.validateZone(data);

            case 'interaction':
                return Validator.validateInteraction(data);

            default:
                Validator.addError(`Unknown schema type: ${schemaType}`);
                return false;
        }
    }
};