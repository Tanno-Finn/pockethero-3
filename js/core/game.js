/**
 * Main Game
 * Entry point for the game that initializes Phaser and starts the game
 */

// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', function () {
    // Make sure CONFIG is defined before using it
    if (typeof CONFIG !== 'undefined') {
        // Create a new Phaser game instance
        const game = new Phaser.Game(CONFIG.phaser);

        // Store global game reference
        window.game = game;

        // Log game initialization
        console.log('Grid World game initialized');
    } else {
        console.error('Game configuration not loaded. Make sure config.js is loaded before game.js');
    }
});

/**
 * Check if object is empty
 *
 * @param {Object} obj - Object to check
 * @returns {boolean} Whether the object is empty
 */
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * Generate a UUID
 *
 * @returns {string} A UUID string
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Deep clone an object
 *
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Safely access nested object properties
 *
 * @param {Object} obj - Object to access
 * @param {string} path - Dot-separated path to property
 * @param {*} [defaultValue=null] - Default value if property doesn't exist
 * @returns {*} Property value or default
 */
function getNestedProperty(obj, path, defaultValue = null) {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length; i++) {
        if (current === undefined || current === null) {
            return defaultValue;
        }

        current = current[parts[i]];
    }

    return current !== undefined ? current : defaultValue;
}

/**
 * Check if a device is mobile
 *
 * @returns {boolean} Whether the device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Format a number with commas for thousands
 *
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Get URL parameter by name
 *
 * @param {string} name - Parameter name
 * @returns {string|null} Parameter value or null if not found
 */
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Load a script dynamically
 *
 * @param {string} url - Script URL
 * @returns {Promise} Promise that resolves when script is loaded
 */
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}