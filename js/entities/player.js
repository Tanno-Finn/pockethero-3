/**
 * Player entity class
 * Represents the player character controlled by the user
 */
class Player extends Entity {
    /**
     * Create a new Player entity
     *
     * @param {Object} scene - The scene this player belongs to
     * @param {Object} config - Player configuration
     */
    constructor(scene, config) {
        // Set default player properties
        const playerConfig = {
            type: CONSTANTS.ENTITY_TYPES.PLAYER,
            displayName: 'Player',
            color: '#0000FF', // Blue
            shape: CONSTANTS.SHAPES.CIRCLE,
            size: 0.8,
            tags: ['player', 'character'],
            ...config
        };

        super(scene, playerConfig);

        // Player-specific properties
        this.moveSpeed = CONFIG.game.player.moveSpeed;
        this.interactionDistance = CONFIG.game.player.interactionDistance;
        this.inventory = [];

        // Input movement cooldown
        this.moveCooldown = 0;
        this.moveCooldownDuration = 200; // ms between moves

        // Debug mode
        this.debug = CONFIG.game.debug.showEntityInfo;

        console.log("Player initialized with properties:", {
            position: this.position,
            direction: this.direction,
            moveSpeed: this.moveSpeed,
            cooldownDuration: this.moveCooldownDuration
        });
    }

    /**
     * Initialize the player
     */
    init() {
        super.init();
        // Register with the scene
        this.scene.setPlayer(this);
    }

    /**
     * Update the player
     *
     * @param {number} time - Current time
     * @param {number} delta - Time since last update
     */
    update(time, delta) {
        super.update(time, delta);

        // Movement cooldown
        if (this.moveCooldown > 0) {
            this.moveCooldown -= delta;
        }
    }

    /**
     * Handle player input
     *
     * @param {Object} input - Input manager reference
     */
    handleInput(input) {
        // Only process input if cooldown is finished
        if (this.moveCooldown <= 0) {
            // Log key states for debugging
            if (this.debug) {
                console.log("Checking player input:");
                input.logKeyStates();
            }

            let moved = false;

            // Check all movement keys
            if (input.isKeyDown(CONSTANTS.KEYS.UP)) {
                console.log("Up key detected, moving north");
                moved = this.move(CONSTANTS.DIRECTIONS.NORTH);
            } else if (input.isKeyDown(CONSTANTS.KEYS.RIGHT)) {
                console.log("Right key detected, moving east");
                moved = this.move(CONSTANTS.DIRECTIONS.EAST);
            } else if (input.isKeyDown(CONSTANTS.KEYS.DOWN)) {
                console.log("Down key detected, moving south");
                moved = this.move(CONSTANTS.DIRECTIONS.SOUTH);
            } else if (input.isKeyDown(CONSTANTS.KEYS.LEFT)) {
                console.log("Left key detected, moving west");
                moved = this.move(CONSTANTS.DIRECTIONS.WEST);
            }

            // Check for interaction
            if (input.isKeyDown(CONSTANTS.KEYS.INTERACT)) {
                console.log("Interact key detected");
                this.interact();
            }

            // Log movement result
            if (this.debug && !moved) {
                console.log("No movement occurred - cooldown:", this.moveCooldown);
            }
        } else if (this.debug) {
            console.log("Player movement on cooldown:", this.moveCooldown);
        }
    }

    /**
     * Move the player in a direction
     *
     * @param {string} direction - Direction to move
     * @returns {boolean} Whether the move was successful
     */
    move(direction) {
        // Set direction even if we can't move
        this.setDirection(direction);

        // Attempt to move
        const moved = this.moveInDirection(direction);

        if (moved) {
            console.log(`Player moved ${direction} to position:`, this.position);

            // Reset cooldown
            this.moveCooldown = this.moveCooldownDuration;

            // Emit move event
            this.scene.events.emit(CONSTANTS.EVENTS.PLAYER_MOVE, {
                player: this,
                position: {...this.position},
                direction: this.direction
            });

            // Check for teleporters
            this.checkTeleporter();
        } else {
            console.log(`Player could not move ${direction} from position:`, this.position);
        }

        return moved;
    }

    /**
     * Check if the player is on a teleporter and handle teleportation
     */
    checkTeleporter() {
        const tile = this.scene.grid.getTileAt(this.position.x, this.position.y);

        if (tile && tile.type === CONSTANTS.TILE_TYPES.TELEPORTER) {
            // Extract teleporter data
            const targetZone = tile.properties.targetZone;
            const targetX = tile.properties.targetX;
            const targetY = tile.properties.targetY;

            console.log("Player on teleporter, destination:", {
                zone: targetZone,
                x: targetX,
                y: targetY
            });

            // Trigger zone change
            if (targetZone && targetX !== undefined && targetY !== undefined) {
                this.scene.changeZone(targetZone, targetX, targetY);
            }
        }
    }

    /**
     * Interact with entities in front of the player
     *
     * @returns {boolean} Whether an interaction occurred
     */
    interact() {
        // Get position in front of player
        const frontPos = Helpers.getPositionInFront(this);

        console.log(`Checking for interaction at position:`, frontPos);

        // Get entity at that position
        const entity = this.scene.getEntityAt(frontPos.x, frontPos.y);

        // Check if there's an interactable entity
        if (entity && entity.interactable) {
            console.log(`Found interactable entity: ${entity.displayName}`);

            // Get opposite direction (entity is in front, so we're approaching from opposite side)
            const interactDirection = this.getOppositeDirection(this.direction);

            // Check if we can interact from this direction
            if (entity.canInteractFrom(interactDirection)) {
                console.log(`Interacting with ${entity.displayName} from ${interactDirection}`);

                // Trigger the interaction
                const interacted = entity.onInteract(this);

                if (interacted) {
                    console.log(`Interaction successful with ${entity.displayName}`);

                    // Emit interact event
                    this.scene.events.emit(CONSTANTS.EVENTS.PLAYER_INTERACT, {
                        player: this,
                        target: entity,
                        direction: this.direction
                    });

                    return true;
                } else {
                    console.log(`Interaction failed with ${entity.displayName}`);
                }
            } else {
                console.log(`Cannot interact with ${entity.displayName} from ${interactDirection}`);
            }
        } else {
            console.log(`No interactable entity found at ${frontPos.x}, ${frontPos.y}`);
        }

        return false;
    }

    /**
     * Get the opposite direction
     *
     * @param {string} direction - Input direction
     * @returns {string} Opposite direction
     */
    getOppositeDirection(direction) {
        switch (direction) {
            case CONSTANTS.DIRECTIONS.NORTH:
                return CONSTANTS.DIRECTIONS.SOUTH;
            case CONSTANTS.DIRECTIONS.EAST:
                return CONSTANTS.DIRECTIONS.WEST;
            case CONSTANTS.DIRECTIONS.SOUTH:
                return CONSTANTS.DIRECTIONS.NORTH;
            case CONSTANTS.DIRECTIONS.WEST:
                return CONSTANTS.DIRECTIONS.EAST;
            default:
                return direction;
        }
    }

    /**
     * Add an item to the player's inventory
     *
     * @param {Object} item - Item to add
     */
    addToInventory(item) {
        this.inventory.push(item);

        console.log(`Added ${item.displayName} to inventory`);

        // Emit item pickup event
        this.scene.events.emit(CONSTANTS.EVENTS.ITEM_PICKUP, {
            player: this,
            item: item
        });
    }
}