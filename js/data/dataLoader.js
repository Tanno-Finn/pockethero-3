/**
 * Data Loader
 * Handles loading and caching JSON data files
 */
class DataLoader {
    /**
     * Create a new data loader
     *
     * @param {Object} scene - The scene this loader belongs to
     */
    constructor(scene) {
        this.scene = scene;
        this.cache = {};
        this.loading = new Set();
        this.loaded = new Set();
        this.validators = {};
    }

    /**
     * Preload data files
     *
     * @param {Array} files - Array of file paths to preload
     * @returns {Promise} Promise that resolves when all files are loaded
     */
    preload(files) {
        return Promise.all(files.map(file => this.load(file)));
    }

    /**
     * Load a data file
     *
     * @param {string} path - Path to the data file
     * @returns {Promise} Promise that resolves with the loaded data
     */
    load(path) {
        // Check if already cached
        if (this.cache[path]) {
            return Promise.resolve(this.cache[path]);
        }

        // Check if already loading
        if (this.loading.has(path)) {
            return new Promise((resolve, reject) => {
                // Poll until the file is loaded
                const checkLoaded = () => {
                    if (this.loaded.has(path)) {
                        resolve(this.cache[path]);
                    } else if (!this.loading.has(path)) {
                        reject(new Error(`Failed to load ${path}`));
                    } else {
                        setTimeout(checkLoaded, 100);
                    }
                };

                checkLoaded();
            });
        }

        // Mark as loading
        this.loading.add(path);

        // Load the file
        return new Promise((resolve, reject) => {
            // Use Phaser's loader
            if (!this.scene.load) {
                reject(new Error('Scene loader not available'));
                return;
            }

            const key = `data_${path.replace(/[^\w]/g, '_')}`;

            this.scene.load.json(key, path);

            this.scene.load.once('complete', () => {
                // Get the data from the cache
                const data = this.scene.cache.json.get(key);

                if (!data) {
                    this.loading.delete(path);
                    reject(new Error(`Failed to load data from ${path}`));
                    return;
                }

                // Cache the data
                this.cache[path] = data;

                // Mark as loaded
                this.loading.delete(path);
                this.loaded.add(path);

                resolve(data);
            });

            this.scene.load.once('loaderror', () => {
                this.loading.delete(path);
                reject(new Error(`Failed to load ${path}`));
            });

            // Start loading if not already started
            if (this.scene.load.isLoading()) {
                // Already loading, the callbacks will be triggered
            } else {
                this.scene.load.start();
            }
        });
    }

    /**
     * Get data from the cache
     *
     * @param {string} path - Path of the data file
     * @returns {Object|null} The cached data or null if not found
     */
    getCache(path) {
        return this.cache[path] || null;
    }

    /**
     * Check if a file is loaded and cached
     *
     * @param {string} path - Path of the data file
     * @returns {boolean} Whether the file is cached
     */
    isCached(path) {
        return this.cache.hasOwnProperty(path);
    }

    /**
     * Clear the data cache
     *
     * @param {string} [path] - Specific path to clear, or all if not specified
     */
    clearCache(path) {
        if (path) {
            delete this.cache[path];
            this.loaded.delete(path);
        } else {
            this.cache = {};
            this.loaded.clear();
        }
    }

    /**
     * Register a validator for a data type
     *
     * @param {string} dataType - Type of data to validate
     * @param {Function} validator - Validation function
     */
    registerValidator(dataType, validator) {
        this.validators[dataType] = validator;
    }

    /**
     * Validate data against a registered validator
     *
     * @param {Object} data - Data to validate
     * @param {string} dataType - Type of data to validate against
     * @returns {boolean} Whether the data is valid
     */
    validate(data, dataType) {
        if (!this.validators[dataType]) {
            console.warn(`No validator registered for data type: ${dataType}`);
            return true;
        }

        return this.validators[dataType](data);
    }
}