/**
 * Input Manager
 * Handles user input and normalizes it for the game
 */
class InputManager {
    /**
     * Create a new input manager
     *
     * @param {Object} scene - The scene this input manager belongs to
     */
    constructor(scene) {
        this.scene = scene;
        this.keys = {};
        this.keyStates = {};
        this.previousKeyStates = {};
        this.keyCallbacks = {};

        // Debug flag
        this.debug = CONFIG.game.debug.logEvents;

        // Initialize
        this.init();
    }

    /**
     * Initialize the input manager
     */
    init() {
        console.log("Initializing InputManager");

        // Set up Phaser input
        this.setupKeys();

        // Add event listeners for logging key events
        if (this.debug) {
            window.addEventListener('keydown', (e) => {
                console.log(`Key Down: ${e.key} (KeyCode: ${e.keyCode})`);
            });
        }
    }

    /**
     * Set up input key handling
     */
    setupKeys() {
        console.log("Setting up keys in InputManager");

        // Get the keyboard from Phaser
        this.keyboard = this.scene.input.keyboard;

        if (!this.keyboard) {
            console.error("Keyboard not available in scene");
            return;
        }

        // Define key mappings - using KeyCodes to ensure consistent behavior
        const keyMapping = {
            [CONSTANTS.KEYS.UP]: Phaser.Input.Keyboard.KeyCodes.W,
            [CONSTANTS.KEYS.DOWN]: Phaser.Input.Keyboard.KeyCodes.S,
            [CONSTANTS.KEYS.LEFT]: Phaser.Input.Keyboard.KeyCodes.A,
            [CONSTANTS.KEYS.RIGHT]: Phaser.Input.Keyboard.KeyCodes.D,
            [CONSTANTS.KEYS.INTERACT]: Phaser.Input.Keyboard.KeyCodes.E
        };

        // Create key objects and log them
        for (const key in keyMapping) {
            this.keys[key] = this.keyboard.addKey(keyMapping[key]);
            this.keyStates[key] = false;
            this.previousKeyStates[key] = false;

            console.log(`Added key: ${key} (KeyCode: ${keyMapping[key]})`);
        }

        // Setup direct key listeners for proper detection
        this.keyboard.on('keydown', this.handleKeyDown, this);
        this.keyboard.on('keyup', this.handleKeyUp, this);

        console.log("Input keys setup complete");
    }

    /**
     * Handle key down event
     *
     * @param {KeyboardEvent} event - Key event
     */
    handleKeyDown(event) {
        // Convert key code to our key constant
        const key = this.getKeyConstant(event.keyCode);

        if (key) {
            if (this.debug) {
                console.log(`Key down detected: ${key} (KeyCode: ${event.keyCode})`);
            }

            this.keyStates[key] = true;

            // Call any registered callbacks
            if (this.keyCallbacks[key]) {
                this.keyCallbacks[key].forEach(callback => callback('down', key));
            }
        }
    }

    /**
     * Handle key up event
     *
     * @param {KeyboardEvent} event - Key event
     */
    handleKeyUp(event) {
        // Convert key code to our key constant
        const key = this.getKeyConstant(event.keyCode);

        if (key) {
            if (this.debug) {
                console.log(`Key up detected: ${key} (KeyCode: ${event.keyCode})`);
            }

            this.keyStates[key] = false;

            // Call any registered callbacks
            if (this.keyCallbacks[key]) {
                this.keyCallbacks[key].forEach(callback => callback('up', key));
            }
        }
    }

    /**
     * Convert a key code to our key constant
     *
     * @param {number} keyCode - The key code
     * @returns {string|null} Our key constant or null if not mapped
     */
    getKeyConstant(keyCode) {
        // Map key codes to our constants
        const keyCodeMap = {
            87: 'UP',    // W
            83: 'DOWN',  // S
            65: 'LEFT',  // A
            68: 'RIGHT', // D
            69: 'INTERACT' // E
        };

        return keyCodeMap[keyCode] || null;
    }

    /**
     * Check if a key is currently down
     *
     * @param {string} key - Key to check
     * @returns {boolean} Whether the key is down
     */
    isKeyDown(key) {
        // First check our internal state (from event listeners)
        if (this.keyStates[key] === true) {
            return true;
        }

        // Then also check Phaser's key state as a backup
        if (this.keys[key] && this.keys[key].isDown) {
            return true;
        }

        return false;
    }

    /**
     * Check if a key was just pressed this frame
     *
     * @param {string} key - Key to check
     * @returns {boolean} Whether the key was just pressed
     */
    wasKeyJustPressed(key) {
        return this.keyStates[key] === true && this.previousKeyStates[key] === false;
    }

    /**
     * Check if a key was just released this frame
     *
     * @param {string} key - Key to check
     * @returns {boolean} Whether the key was just released
     */
    wasKeyJustReleased(key) {
        return this.keyStates[key] === false && this.previousKeyStates[key] === true;
    }

    /**
     * Register a callback for a key event
     *
     * @param {string} key - Key to register for
     * @param {Function} callback - Function to call when the key state changes
     */
    onKey(key, callback) {
        if (!this.keyCallbacks[key]) {
            this.keyCallbacks[key] = [];
        }

        this.keyCallbacks[key].push(callback);
    }

    /**
     * Unregister a callback for a key event
     *
     * @param {string} key - Key to unregister for
     * @param {Function} callback - Function to remove
     */
    offKey(key, callback) {
        if (this.keyCallbacks[key]) {
            const index = this.keyCallbacks[key].indexOf(callback);
            if (index !== -1) {
                this.keyCallbacks[key].splice(index, 1);
            }
        }
    }

    /**
     * Log the current state of all keys
     */
    logKeyStates() {
        console.log("Current key states:");
        for (const key in this.keyStates) {
            console.log(`${key}: ${this.keyStates[key]}`);
        }

        console.log("Phaser key states:");
        for (const key in this.keys) {
            if (this.keys[key]) {
                console.log(`${key}: ${this.keys[key].isDown}`);
            }
        }
    }

    /**
     * Update the input manager
     * Should be called once per frame in the scene's update
     */
    update() {
        // Check direct key states from Phaser as a backup
        // This ensures we catch keys even if the event listeners missed them
        for (const key in this.keys) {
            if (this.keys[key] && this.keys[key].isDown) {
                this.keyStates[key] = true;
            }
        }

        // Store the current key states for "just pressed/released" detection
        for (const key in this.keyStates) {
            this.previousKeyStates[key] = this.keyStates[key];
        }
    }
}