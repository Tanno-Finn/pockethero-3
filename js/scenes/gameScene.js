/**
 * Game Scene
 * Main gameplay scene
 */
class GameScene extends Phaser.Scene {
    /**
     * Create the game scene
     */
    constructor() {
        super({
            key: CONSTANTS.SCENES.GAME
        });

        // Entity storage
        this.entities = [];
        this.player = null;

        // Current zone
        this.currentZone = null;
        this.currentZoneId = '';

        // System references
        this.grid = null;
        this.camera = null;
        this.renderer = null;
        this.inputManager = null;
        this.dialog = null;

        // State
        this.gameState = CONSTANTS.GAME_STATES.PLAYING;
    }

    /**
     * Initialize scene data
     *
     * @param {Object} data - Scene initialization data
     */
    init(data) {
        // Get references to shared systems
        this.events = this.game.registry.get('events') || new EventSystem();
        this.dataManager = this.game.registry.get('dataManager');

        // Initialize systems
        this.camera = new Camera(this);
        this.renderer = new Renderer(this);
        this.inputManager = new InputManager(this);
        this.dialog = new Dialog(this);

        // Set initial zone
        this.currentZoneId = data.zoneId || CONFIG.game.world.defaultZone;
    }

    /**
     * Preload game assets
     */
    preload() {
        // No assets to preload for this prototype
    }

    /**
     * Create the game scene
     */
    create() {
        // Set up event listeners
        this.setupEventListeners();

        // Load the initial zone
        this.loadZone(this.currentZoneId);

        // Create player
        this.createPlayer();

        // Set up camera to follow player
        this.camera.follow(this.player);
        this.camera.setBoundsToGrid(this.grid);
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for dialog events
        this.events.on(CONSTANTS.EVENTS.DIALOG_START, data => {
            // Pause game during dialog
            this.gameState = CONSTANTS.GAME_STATES.DIALOG;
        });

        this.events.on(CONSTANTS.EVENTS.DIALOG_END, data => {
            // Resume game after dialog
            this.gameState = CONSTANTS.GAME_STATES.PLAYING;
        });

        // Zone change events
        this.events.on(CONSTANTS.EVENTS.ZONE_CHANGE, data => {
            this.changeZone(data.targetZone, data.targetX, data.targetY);
        });
    }

    /**
     * Load a zone
     *
     * @param {string} zoneId - ID of the zone to load
     */
    loadZone(zoneId) {
        // Get zone data
        const zoneData = this.dataManager.getZone(zoneId);

        if (!zoneData) {
            console.error(`Zone not found: ${zoneId}`);
            return;
        }

        // Create zone
        this.currentZone = new Zone(this, zoneData);
        this.currentZoneId = zoneId;

        // Get grid reference
        this.grid = this.currentZone.grid;

        // Clear entities and transfer from zone
        this.entities = [];
        this.entities.push(...this.currentZone.entities);

        // Update camera bounds
        this.camera.setBoundsToGrid(this.grid);

        // Emit zone loaded event
        this.events.emit('zone-loaded', {
            zoneId: zoneId,
            zone: this.currentZone
        });
    }

    /**
     * Create the player character
     */
    createPlayer() {
        // Create player at default position
        this.player = new Player(this, {
            x: 1,
            y: 1,
            direction: CONSTANTS.DIRECTIONS.SOUTH
        });

        // Add to entities
        this.entities.push(this.player);
    }

    /**
     * Set the player reference
     *
     * @param {Player} player - Player entity
     */
    setPlayer(player) {
        this.player = player;
    }

    /**
     * Change to a different zone
     *
     * @param {string} zoneId - Target zone ID
     * @param {number} targetX - Target X position
     * @param {number} targetY - Target Y position
     */
    changeZone(zoneId, targetX, targetY) {
        // Store current player data
        const playerData = this.player ? this.player.serialize() : null;

        // Load the new zone
        this.loadZone(zoneId);

        // Restore player at target position
        if (playerData) {
            // Remove current player from entities
            this.removeEntity(this.player);

            // Create new player at target position
            this.player = new Player(this, {
                ...playerData,
                x: targetX,
                y: targetY
            });

            // Add to entities
            this.entities.push(this.player);

            // Update camera
            this.camera.follow(this.player);
        }

        // Emit zone change event
        this.events.emit(CONSTANTS.EVENTS.ZONE_CHANGE, {
            zoneId: zoneId,
            player: this.player
        });
    }

    /**
     * Get an entity at a specific position
     *
     * @param {number} x - Grid X position
     * @param {number} y - Grid Y position
     * @returns {Entity|null} Entity at position or null if none
     */
    getEntityAt(x, y) {
        return this.entities.find(entity =>
            entity.position.x === x && entity.position.y === y
        ) || null;
    }

    /**
     * Get all entities at a specific position
     *
     * @param {number} x - Grid X position
     * @param {number} y - Grid Y position
     * @returns {Array} Array of entities at position
     */
    getEntitiesAt(x, y) {
        return this.entities.filter(entity =>
            entity.position.x === x && entity.position.y === y
        );
    }

    /**
     * Get an entity by ID
     *
     * @param {string} id - Entity ID
     * @returns {Entity|null} Entity with ID or null if not found
     */
    getEntityById(id) {
        return this.entities.find(entity => entity.id === id) || null;
    }

    /**
     * Add an entity to the scene
     *
     * @param {Entity} entity - Entity to add
     */
    addEntity(entity) {
        this.entities.push(entity);
    }

    /**
     * Remove an entity from the scene
     *
     * @param {Entity|string} entityOrId - Entity or entity ID to remove
     * @returns {Entity|null} Removed entity or null if not found
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
     * Show a dialog
     *
     * @param {Object} options - Dialog options
     */
    showDialog(options) {
        this.dialog.show(options);
    }

    /**
     * Update game state
     *
     * @param {number} time - Current time
     * @param {number} delta - Time since last update
     */
    update(time, delta) {
        // Update input manager
        this.inputManager.update();

        // Update based on game state
        switch (this.gameState) {
            case CONSTANTS.GAME_STATES.PLAYING:
                this.updatePlaying(time, delta);
                break;

            case CONSTANTS.GAME_STATES.DIALOG:
                this.updateDialog(time, delta);
                break;

            case CONSTANTS.GAME_STATES.PAUSED:
                // Do nothing while paused
                break;
        }

        // Always update the renderer
        this.updateRenderer(time, delta);
    }

    /**
     * Update playing state
     *
     * @param {number} time - Current time
     * @param {number} delta - Time since last update
     */
    updatePlaying(time, delta) {
        // Process input
        if (this.player) {
            this.player.handleInput(this.inputManager);
        }

        // Update all entities
        for (const entity of this.entities) {
            if (entity.update) {
                entity.update(time, delta);
            }
        }

        // Update camera
        this.camera.update(delta);
    }

    /**
     * Update dialog state
     *
     * @param {number} time - Current time
     * @param {number} delta - Time since last update
     */
    updateDialog(time, delta) {
        // Check for dialog input
        if (this.inputManager.wasKeyJustPressed(CONSTANTS.KEYS.INTERACT)) {
            this.dialog.handleInput();
        }
    }

    /**
     * Update renderer
     *
     * @param {number} time - Current time
     * @param {number} delta - Time since last update
     */
    updateRenderer(time, delta) {
        // Render the current state
        this.renderer.render(this.grid, this.entities, this.camera);
    }
}