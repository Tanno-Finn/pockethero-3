/**
 * Base Entity class
 * Parent class for all game entities (player, NPCs, items, etc.)
 */
class Entity {
    /**
     * Create a new Entity
     *
     * @param {Object} scene - The scene this entity belongs to
     * @param {Object} config - Entity configuration
     */
    constructor(scene, config) {
        this.scene = scene;
        this.id = config.id || Helpers.generateId();
        this.type = config.type || 'entity';
        this.displayName = config.displayName || 'Entity';

        // Position and movement
        this.position = {
            x: config.x || 0,
            y: config.y || 0
        };
        this.direction = config.direction || CONSTANTS.DIRECTIONS.SOUTH;
        this.moving = false;

        // Visual properties
        this.color = config.color || '#FFFFFF';
        this.shape = config.shape || CONSTANTS.SHAPES.RECTANGLE;
        this.size = config.size || 1; // Size relative to tile (0-1)

        // Properties and tags
        this.properties = config.properties || {};
        this.tags = config.tags || [];

        // Interaction properties
        this.interactable = config.interactable !== undefined ? config.interactable : false;
        this.interactionDirections = config.interactionDirections || [
            CONSTANTS.DIRECTIONS.NORTH,
            CONSTANTS.DIRECTIONS.EAST,
            CONSTANTS.DIRECTIONS.SOUTH,
            CONSTANTS.DIRECTIONS.WEST
        ];

        // Initialize the entity
        this.init();
    }

    /**
     * Initialize the entity
     * Override in child classes for specific initialization
     */
    init() {
        // Default implementation does nothing
    }

    /**
     * Update the entity
     * Called every game tick
     *
     * @param {number} time - Current time
     * @param {number} delta - Time since last update
     */
    update(time, delta) {
        // Default implementation does nothing
    }

    /**
     * Move the entity to a new position
     *
     * @param {number} x - New x position
     * @param {number} y - New y position
     * @returns {boolean} Whether the move was successful
     */
    moveTo(x, y) {
        // Check if the move is valid
        if (!this.canMoveTo(x, y)) {
            return false;
        }

        // Update the position
        this.position.x = x;
        this.position.y = y;

        return true;
    }

    /**
     * Check if the entity can move to a position
     *
     * @param {number} x - Target x position
     * @param {number} y - Target y position
     * @returns {boolean} Whether the move is valid
     */
    canMoveTo(x, y) {
        // Get the grid from the scene
        const grid = this.scene.grid;

        // Check if the position is within bounds
        if (!grid.isInBounds(x, y)) {
            return false;
        }

        // Check if the tile is passable for this entity
        const tile = grid.getTileAt(x, y);
        if (!tile || !this.canPassTile(tile)) {
            return false;
        }

        // Check if there's another entity blocking the way
        const blockingEntity = this.scene.getEntityAt(x, y);
        if (blockingEntity && Helpers.hasTag(blockingEntity, CONSTANTS.TAGS.BLOCKING)) {
            return false;
        }

        return true;
    }

    /**
     * Check if the entity can pass a specific tile
     *
     * @param {Object} tile - The tile to check
     * @returns {boolean} Whether the entity can pass the tile
     */
    canPassTile(tile) {
        // By default, check if the tile has the 'passable' tag
        return Helpers.hasTag(tile, CONSTANTS.TAGS.PASSABLE);
    }

    /**
     * Set the direction of the entity
     *
     * @param {string} direction - The new direction
     */
    setDirection(direction) {
        if (Object.values(CONSTANTS.DIRECTIONS).includes(direction)) {
            this.direction = direction;
        }
    }

    /**
     * Move in a direction
     *
     * @param {string} direction - Direction to move
     * @returns {boolean} Whether the move was successful
     */
    moveInDirection(direction) {
        // Set the direction
        this.setDirection(direction);

        // Calculate the new position
        let newX = this.position.x;
        let newY = this.position.y;

        switch (direction) {
            case CONSTANTS.DIRECTIONS.NORTH:
                newY -= 1;
                break;
            case CONSTANTS.DIRECTIONS.EAST:
                newX += 1;
                break;
            case CONSTANTS.DIRECTIONS.SOUTH:
                newY += 1;
                break;
            case CONSTANTS.DIRECTIONS.WEST:
                newX -= 1;
                break;
        }

        // Attempt to move
        return this.moveTo(newX, newY);
    }

    /**
     * Check if the entity can be interacted with from a direction
     *
     * @param {string} direction - Direction to check
     * @returns {boolean} Whether interaction is possible
     */
    canInteractFrom(direction) {
        if (!this.interactable) {
            return false;
        }

        return this.interactionDirections.includes(direction);
    }

    /**
     * Handle interaction with this entity
     *
     * @param {Entity} interactor - Entity initiating the interaction
     * @returns {boolean} Whether the interaction was handled
     */
    onInteract(interactor) {
        // Default implementation does nothing
        return false;
    }

    /**
     * Check if this entity has a specific tag
     *
     * @param {string} tag - Tag to check
     * @returns {boolean} Whether the entity has the tag
     */
    hasTag(tag) {
        return this.tags.includes(tag);
    }

    /**
     * Add a tag to this entity
     *
     * @param {string} tag - Tag to add
     */
    addTag(tag) {
        if (!this.hasTag(tag)) {
            this.tags.push(tag);
        }
    }

    /**
     * Remove a tag from this entity
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
     * Get the screen position of this entity
     *
     * @returns {Object} {x, y} position on screen
     */
    getScreenPosition() {
        return Helpers.gridToScreen(this.position.x, this.position.y);
    }

    /**
     * Generate a serializable representation of this entity
     *
     * @returns {Object} Serialized entity data
     */
    serialize() {
        return {
            id: this.id,
            type: this.type,
            displayName: this.displayName,
            x: this.position.x,
            y: this.position.y,
            direction: this.direction,
            color: this.color,
            shape: this.shape,
            size: this.size,
            properties: {...this.properties},
            tags: [...this.tags],
            interactable: this.interactable,
            interactionDirections: [...this.interactionDirections]
        };
    }
}