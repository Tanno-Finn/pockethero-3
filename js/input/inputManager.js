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

        // Initialize
        this.init();
    }

    /**
     * Initialize the input manager
     */
    init() {
        // Set up Phaser input
        this.setupKeys();
    }

    /**
     * Set up input key handling
     */
    setupKeys() {
        // Get the keyboard from Phaser
        this.keyboard = this.scene.input.keyboard;

        // Define key mappings
        const keyMapping = {
            [CONSTANTS.KEYS.UP]: 'W',
            [CONSTANTS.KEYS.DOWN]: 'S',
            [CONSTANTS.KEYS.LEFT]: 'A',
            [CONSTANTS.KEYS.RIGHT]: 'D',
            [CONSTANTS.KEYS.INTERACT]: 'E'
        };

        // Create key objects
        for (const key in keyMapping) {
            this.keys[key] = this.keyboard.addKey(keyMapping[key]);
            this.keyStates[key] = false;
            this.previousKeyStates[key] = false;
        }

        // Add key event listeners
        this.keyboard.on('keydown', this.handleKeyDown.bind(this));
        this.keyboard.on('keyup', this.handleKeyUp.bind(this));
    }

    /**
     * Handle key down event
     *
     * @param {Object} event - Key event
     */
    handleKeyDown(event) {
        // Convert key code to our key constant
        const key = this.getKeyConstant(event.key);

        if (key) {
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
     * @param {Object} event - Key event
     */
    handleKeyUp(event) {
        // Convert key code to our key constant
        const key = this.getKeyConstant(event.key);

        if (key) {
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
     * @param {string} keyCode - The key code
     * @returns {string|null} Our key constant or null if not mapped
     */
    getKeyConstant(keyCode) {
        // Convert to uppercase for consistency
        const upperKey = keyCode.toUpperCase();

        // Find the matching key constant
        for (const key in CONSTANTS.KEYS) {
            if (CONSTANTS.KEYS[key] === upperKey) {
                return key;
            }
        }

        return null;
    }

    /**
     * Check if a key is currently down
     *
     * @param {string} key - Key to check
     * @returns {boolean} Whether the key is down
     */
    isKeyDown(key) {
        return this.keyStates[key] === true;
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
     * Update the input manager
     * Should be called once per frame in the scene's update
     */
    update() {
        // Store the current key states for "just pressed/released" detection
        for (const key in this.keyStates) {
            this.previousKeyStates[key] = this.keyStates[key];
        }
    }
}