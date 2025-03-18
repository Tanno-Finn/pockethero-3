/**
 * NPC Entity class
 * Represents a non-player character in the game
 */
class NPC extends Entity {
    /**
     * Create a new NPC entity
     *
     * @param {Object} scene - The scene this NPC belongs to
     * @param {Object} config - NPC configuration
     */
    constructor(scene, config) {
        // Set default NPC properties
        const npcConfig = {
            type: CONSTANTS.ENTITY_TYPES.NPC,
            displayName: 'NPC',
            color: '#FF0000', // Red
            shape: CONSTANTS.SHAPES.CIRCLE,
            size: 0.8,
            interactable: true,
            tags: ['npc', 'character'],
            ...config
        };

        super(scene, npcConfig);

        // NPC-specific properties
        this.dialog = config.dialog || 'Hello!';
        this.movement = config.movement || null; // null for static NPCs
        this.movementPattern = config.movementPattern || [];
        this.currentPatternIndex = 0;
        this.moveTimer = null;
        this.moveCooldown = 0;

        // Initialize movement if configured
        if (this.movement === 'patrol' && this.movementPattern.length > 0) {
            this.startPatrol();
        } else if (this.movement === 'random') {
            this.startRandomMovement();
        }
    }

    /**
     * Update the NPC
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

        // AI behavior updates would go here
    }

    /**
     * Start patrol movement pattern
     */
    startPatrol() {
        if (this.movementPattern.length === 0) return;

        // Clear any existing timer
        if (this.moveTimer) {
            clearTimeout(this.moveTimer);
        }

        // Set up recurring movement
        this.moveTimer = setTimeout(() => {
            this.moveInPattern();
        }, 2000); // Move every 2 seconds
    }

    /**
     * Move according to the patrol pattern
     */
    moveInPattern() {
        if (this.movementPattern.length === 0) return;

        // Get the next direction
        const direction = this.movementPattern[this.currentPatternIndex];

        // Move in that direction
        this.moveInDirection(direction);

        // Advance to next pattern step
        this.currentPatternIndex = (this.currentPatternIndex + 1) % this.movementPattern.length;

        // Schedule next movement
        this.moveTimer = setTimeout(() => {
            this.moveInPattern();
        }, 2000);
    }

    /**
     * Start random movement
     */
    startRandomMovement() {
        // Clear any existing timer
        if (this.moveTimer) {
            clearTimeout(this.moveTimer);
        }

        // Set up recurring random movement
        this.moveTimer = setTimeout(() => {
            this.moveRandomly();
        }, MathUtils.randomInt(2000, 5000)); // Move every 2-5 seconds
    }

    /**
     * Move in a random direction
     */
    moveRandomly() {
        // Don't move if on cooldown
        if (this.moveCooldown > 0) {
            this.moveTimer = setTimeout(() => {
                this.moveRandomly();
            }, 500);
            return;
        }

        // Select a random direction
        const directions = Object.values(CONSTANTS.DIRECTIONS);
        const direction = directions[MathUtils.randomInt(0, directions.length - 1)];

        // Move in that direction
        const moved = this.moveInDirection(direction);

        // Set cooldown
        if (moved) {
            this.moveCooldown = 1000; // 1 second cooldown after successful move
        }

        // Schedule next movement
        this.moveTimer = setTimeout(() => {
            this.moveRandomly();
        }, MathUtils.randomInt(2000, 5000));
    }

    /**
     * Handle interaction with this NPC
     *
     * @param {Entity} interactor - Entity initiating the interaction
     * @returns {boolean} Whether the interaction was handled
     */
    onInteract(interactor) {
        // Only respond to player interactions
        if (interactor.type !== CONSTANTS.ENTITY_TYPES.PLAYER) {
            return false;
        }

        // Show dialog
        if (this.dialog) {
            const dialogContent = typeof this.dialog === 'string'
                ? this.dialog
                : (this.dialog.text || 'Hello!');

            const dialogSpeaker = typeof this.dialog === 'object' && this.dialog.speaker
                ? this.dialog.speaker
                : this.displayName;

            this.scene.showDialog({
                content: dialogContent,
                speaker: dialogSpeaker,
                waitForInput: true
            });

            return true;
        }

        return false;
    }

    /**
     * Stop all movement
     */
    stopMovement() {
        if (this.moveTimer) {
            clearTimeout(this.moveTimer);
            this.moveTimer = null;
        }

        this.movement = null;
    }

    /**
     * Serialize NPC for saving
     *
     * @returns {Object} Serialized NPC data
     */
    serialize() {
        const data = super.serialize();

        // Add NPC-specific properties
        data.dialog = this.dialog;
        data.movement = this.movement;
        data.movementPattern = [...this.movementPattern];

        return data;
    }
}