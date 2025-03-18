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

        // Debug mode
        this.debugMode = CONFIG.game.debug.showEntityInfo || false;
    }

    /**
     * Initialize scene data
     *
     * @param {Object} data - Scene initialization data
     */
    init(data) {
        console.log("GameScene init method called");

        // Get references to shared systems
        this.eventSystem = this.game.registry.get('events') || new EventSystem();
        this.dataManager = this.game.registry.get('dataManager');

        // Add Phaser compatibility to event system
        this.eventSystem.addPhaserCompatibility();

        // Initialize systems
        this.camera = new Camera(this);
        this.renderer = new Renderer(this);
        this.inputManager = new InputManager(this);
        this.dialog = new Dialog(this);

        // Set initial zone
        this.currentZoneId = data.zoneId || CONFIG.game.world.defaultZone;

        // Set up events for this scene
        this.events = this.eventSystem;

        // Debug data loading
        if (this.dataManager) {
            console.log("Data manager zones:", Object.keys(this.dataManager.zones));
            this.dataManager.logDataCaches();
        } else {
            console.error("DataManager not available!");
        }
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
        console.log("GameScene create method called");

        // Setup key capture to prevent browser default actions
        this.input.keyboard.addCapture([
            Phaser.Input.Keyboard.KeyCodes.W,
            Phaser.Input.Keyboard.KeyCodes.A,
            Phaser.Input.Keyboard.KeyCodes.S,
            Phaser.Input.Keyboard.KeyCodes.D,
            Phaser.Input.Keyboard.KeyCodes.E
        ]);

        console.log("Keyboard capture set up for WASD+E");

        // Set up event listeners
        this.setupEventListeners();

        // Load the initial zone
        if (!this.loadZone(this.currentZoneId)) {
            // If we can't load the requested zone, create a default zone
            console.log("Creating default zone because requested zone wasn't found");
            this.createDefaultZone();
        }

        // Create player
        this.createPlayer();

        // Set up camera to follow player
        this.camera.follow(this.player);

        // Only set bounds if grid exists
        if (this.grid) {
            this.camera.setBoundsToGrid(this.grid);
        } else {
            // Set default bounds
            this.camera.setBounds(0, 0, 800, 600);
        }

        // Add debug key to toggle debug mode
        this.input.keyboard.on('keydown-B', () => {
            this.debugMode = !this.debugMode;
            console.log(`Debug mode ${this.debugMode ? 'enabled' : 'disabled'}`);
        });

        // Log that scene is ready
        console.log("GameScene ready - press WASD to move, E to interact");
    }

    /**
     * Create a default zone when no zone could be loaded
     */
    createDefaultZone() {
        // Create a default zone config
        const defaultZoneConfig = {
            id: 'default',
            displayName: 'Default Zone',
            width: 20,
            height: 15,
            defaultTile: 'grass'
        };

        // Create a new zone with default config
        this.currentZone = new Zone(this, defaultZoneConfig);
        this.currentZoneId = 'default';

        // Get grid reference
        this.grid = this.currentZone.grid;

        console.log("Created default zone:", this.currentZone);
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        console.log("Setting up event listeners, events object:", this.events);

        // Make sure events are initialized
        if (!this.events || typeof this.events.on !== 'function') {
            console.error("Events system not properly initialized");
            return;
        }

        try {
            // Listen for dialog events
            this.events.on(CONSTANTS.EVENTS.DIALOG_START, data => {
                // Pause game during dialog
                this.gameState = CONSTANTS.GAME_STATES.DIALOG;
                console.log("Game state changed to DIALOG");
            });

            this.events.on(CONSTANTS.EVENTS.DIALOG_END, data => {
                // Resume game after dialog
                this.gameState = CONSTANTS.GAME_STATES.PLAYING;
                console.log("Game state changed to PLAYING");
            });

            // Zone change events
            this.events.on(CONSTANTS.EVENTS.ZONE_CHANGE, data => {
                this.changeZone(data.targetZone, data.targetX, data.targetY);
            });

            // Player move events for debugging
            this.events.on(CONSTANTS.EVENTS.PLAYER_MOVE, data => {
                if (this.debugMode) {
                    console.log("Player moved:", data);
                }
            });
        } catch (error) {
            console.error("Error setting up event listeners:", error);
        }
    }

    /**
     * Load a zone
     *
     * @param {string} zoneId - ID of the zone to load
     * @returns {boolean} Whether the zone was successfully loaded
     */
    loadZone(zoneId) {
        console.log("Attempting to load zone:", zoneId);

        // Get zone data
        const zoneData = this.dataManager ? this.dataManager.getZone(zoneId) : null;

        if (!zoneData) {
            console.error(`Zone not found: ${zoneId}`);
            return false;
        }

        console.log("Found zone data:", zoneData);

        // Create zone
        try {
            this.currentZone = new Zone(this, zoneData);
            this.currentZoneId = zoneId;

            // Get grid reference
            this.grid = this.currentZone.grid;

            // Clear entities and transfer from zone
            this.entities = [];
            this.entities.push(...this.currentZone.entities);

            // Update camera bounds if camera and grid exist
            if (this.camera && this.grid) {
                this.camera.setBoundsToGrid(this.grid);
            }

            // Emit zone loaded event
            if (this.events && typeof this.events.emit === 'function') {
                this.events.emit('zone-loaded', {
                    zoneId: zoneId,
                    zone: this.currentZone
                });
            }

            console.log("Zone loaded successfully:", this.currentZoneId);
            return true;
        } catch (error) {
            console.error("Error creating zone:", error);
            return false;
        }
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

        console.log("Player created:", this.player);
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
        console.log(`Changing zone to ${zoneId} at position (${targetX}, ${targetY})`);

        // Store current player data
        const playerData = this.player ? this.player.serialize() : null;

        // Load the new zone
        if (!this.loadZone(zoneId)) {
            console.error(`Failed to change to zone: ${zoneId}`);
            return;
        }

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
        if (this.events && typeof this.events.emit === 'function') {
            this.events.emit(CONSTANTS.EVENTS.ZONE_CHANGE, {
                zoneId: zoneId,
                player: this.player
            });
        }
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
        // Always update input manager
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
            // Handle player input
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
        // Only render if we have a grid
        if (this.grid) {
            // Render the current state
            this.renderer.render(this.grid, this.entities, this.camera);
        }
    }
}