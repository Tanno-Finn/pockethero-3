/**
 * Zone class
 * Represents a discrete area in the game with its own grid and entities
 */
class Zone {
    /**
     * Create a new zone
     *
     * @param {Object} scene - The scene this zone belongs to
     * @param {Object} config - Zone configuration
     */
    constructor(scene, config) {
        this.scene = scene;
        this.id = config.id || 'unknown';
        this.displayName = config.displayName || 'Unknown Zone';

        // Create the grid for this zone
        this.grid = new Grid(scene, {
            width: config.width || 20,
            height: config.height || 15,
            defaultTileType: config.defaultTile || CONSTANTS.TILE_TYPES.GRASS
        });

        // Entity storage
        this.entities = [];

        // Load zone data if provided
        if (config.tiles) {
            this.grid.loadFromData(config);
        }

        // Load entities if provided
        if (config.entities) {
            this.loadEntities(config.entities);
        }
    }

    /**
     * Load entities from configuration data
     *
     * @param {Array} entitiesData - Array of entity data
     */
    loadEntities(entitiesData) {
        if (!Array.isArray(entitiesData)) {
            console.error('Zone.loadEntities: entitiesData is not an array');
            return;
        }

        entitiesData.forEach(entityData => {
            // Skip entities with missing required fields
            if (entityData.type === undefined ||
                entityData.x === undefined ||
                entityData.y === undefined) {
                console.warn('Zone.loadEntities: Skipping entity with missing data', entityData);
                return;
            }

            // Create the entity based on its type
            let entity;

            switch (entityData.type) {
                case CONSTANTS.ENTITY_TYPES.PLAYER:
                    // Player is typically created separately and not from zone data
                    console.warn('Zone.loadEntities: Player entity should be created separately');
                    break;

                case CONSTANTS.ENTITY_TYPES.NPC:
                    entity = new NPC(this.scene, entityData);
                    break;

                case CONSTANTS.ENTITY_TYPES.ITEM:
                    entity = new Item(this.scene, entityData);
                    break;

                case CONSTANTS.ENTITY_TYPES.FURNITURE:
                    // Furniture might be a separate class, or just use the base Entity
                    entity = new Entity(this.scene, entityData);
                    break;

                default:
                    // For unknown types, create a base entity
                    entity = new Entity(this.scene, entityData);
                    break;
            }

            if (entity) {
                this.addEntity(entity);
            }
        });
    }

    /**
     * Add an entity to this zone
     *
     * @param {Entity} entity - Entity to add
     */
    addEntity(entity) {
        this.entities.push(entity);
    }

    /**
     * Remove an entity from this zone
     *
     * @param {Entity|string} entityOrId - Entity or entity ID to remove
     * @returns {Entity|null} The removed entity or null if not found
     */
    removeEntity(entityOrId) {
        const id = typeof entityOrId === 'string' ? entityOrId : entityOrId.id;
        const index = this.entities.findIndex(e => e.id === id);

        if (index !== -1) {
            const entity = this.entities[index];
            this.entities.splice(index, 1);
            return entity;
        }

        return null;
    }

    /**
     * Get an entity by ID
     *
     * @param {string} id - Entity ID
     * @returns {Entity|null} The entity or null if not found
     */
    getEntityById(id) {
        return this.entities.find(e => e.id === id) || null;
    }

    /**
     * Get all entities at a specific position
     *
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Array} Array of entities at the position
     */
    getEntitiesAt(x, y) {
        return this.entities.filter(e => e.position.x === x && e.position.y === y);
    }

    /**
     * Get the first entity at a specific position
     *
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Entity|null} The entity or null if none found
     */
    getEntityAt(x, y) {
        return this.getEntitiesAt(x, y)[0] || null;
    }

    /**
     * Get all entities of a specific type
     *
     * @param {string} type - Entity type
     * @returns {Array} Array of entities of the type
     */
    getEntitiesByType(type) {
        return this.entities.filter(e => e.type === type);
    }

    /**
     * Get all entities with a specific tag
     *
     * @param {string} tag - Tag to search for
     * @returns {Array} Array of entities with the tag
     */
    getEntitiesByTag(tag) {
        return this.entities.filter(e => e.tags.includes(tag));
    }

    /**
     * Update all entities in the zone
     *
     * @param {number} time - Current time
     * @param {number} delta - Time since last update
     */
    update(time, delta) {
        this.entities.forEach(entity => {
            if (typeof entity.update === 'function') {
                entity.update(time, delta);
            }
        });
    }

    /**
     * Find all teleporters in this zone
     *
     * @returns {Array} Array of teleporter tiles
     */
    getTeleporters() {
        return this.grid.getTilesByType(CONSTANTS.TILE_TYPES.TELEPORTER);
    }

    /**
     * Check if a position is within the zone boundaries
     *
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} Whether the position is in the zone
     */
    isInZone(x, y) {
        return this.grid.isInBounds(x, y);
    }

    /**
     * Generate a serializable representation of this zone
     *
     * @returns {Object} Serialized zone data
     */
    serialize() {
        // Serialize grid tiles that aren't the default type
        const tiles = [];
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const tile = this.grid.getTileAt(x, y);
                if (tile && tile.type !== this.grid.defaultTileType) {
                    tiles.push(tile.serialize());
                }
            }
        }

        return {
            id: this.id,
            displayName: this.displayName,
            width: this.grid.width,
            height: this.grid.height,
            defaultTile: this.grid.defaultTileType,
            tiles: tiles,
            entities: this.entities.map(e => e.serialize())
        };
    }
}