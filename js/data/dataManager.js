/**
 * Data Manager
 * Manages access to game data and provides a simplified interface
 */
class DataManager {
    /**
     * Create a new data manager
     *
     * @param {Object} scene - The scene this manager belongs to
     */
    constructor(scene) {
        this.scene = scene;
        this.loader = new DataLoader(scene);

        // Cache for specific types of data
        this.tiles = {};
        this.entities = {};
        this.zones = {};
        this.interactions = {};

        // Register validators
        this.registerValidators();
    }

    /**
     * Register data validators
     */
    registerValidators() {
        // Register validators for different data types
        this.loader.registerValidator('tile', Validator.validateTile);
        this.loader.registerValidator('entity', Validator.validateEntity);
        this.loader.registerValidator('zone', Validator.validateZone);
        this.loader.registerValidator('interaction', Validator.validateInteraction);
    }

    /**
     * Load all game data
     *
     * @returns {Promise} Promise that resolves when all data is loaded
     */
    loadAll() {
        // Load all data from the data paths
        return Promise.all([
            this.loadTiles(),
            this.loadEntities(),
            this.loadZones(),
            this.loadInteractions()
        ]).then(() => {
            // Debug: Log what's in the data caches
            console.log("LOADED DATA SUMMARY:");
            console.log("Tiles:", Object.keys(this.tiles));
            console.log("Entities:", Object.keys(this.entities));
            console.log("Zones:", Object.keys(this.zones));
            console.log("Interactions:", Object.keys(this.interactions));

            // Return the loaded data
            return {
                tiles: this.tiles,
                entities: this.entities,
                zones: this.zones,
                interactions: this.interactions
            };
        });
    }

    /**
     * Load all tile definitions
     *
     * @returns {Promise} Promise that resolves when tiles are loaded
     */
    loadTiles() {
        console.log("Loading tiles from path:", CONSTANTS.DATA_PATHS.TILES);
        return this.loadDataFiles(CONSTANTS.DATA_PATHS.TILES, 'tile', this.tiles);
    }

    /**
     * Load all entity definitions
     *
     * @returns {Promise} Promise that resolves when entities are loaded
     */
    loadEntities() {
        console.log("Loading entities from path:", CONSTANTS.DATA_PATHS.ENTITIES);
        return this.loadDataFiles(CONSTANTS.DATA_PATHS.ENTITIES, 'entity', this.entities);
    }

    /**
     * Load all zone definitions
     *
     * @returns {Promise} Promise that resolves when zones are loaded
     */
    loadZones() {
        console.log("Loading zones from path:", CONSTANTS.DATA_PATHS.ZONES);
        return this.loadDataFiles(CONSTANTS.DATA_PATHS.ZONES, 'zone', this.zones);
    }

    /**
     * Load all interaction definitions
     *
     * @returns {Promise} Promise that resolves when interactions are loaded
     */
    loadInteractions() {
        console.log("Loading interactions from path:", CONSTANTS.DATA_PATHS.INTERACTIONS);
        return this.loadDataFiles(CONSTANTS.DATA_PATHS.INTERACTIONS, 'interaction', this.interactions);
    }

    /**
     * Helper method to load data files of a specific type
     *
     * @param {string} basePath - Base path for data files
     * @param {string} dataType - Type of data for validation
     * @param {Object} targetCache - Cache object to store loaded data
     * @returns {Promise} Promise that resolves when data is loaded
     */
    loadDataFiles(basePath, dataType, targetCache) {
        // Log the base path
        console.log(`Attempting to load ${dataType} data from ${basePath}`);

        // First check if the index file exists
        return fetch(basePath + 'index.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Index file not found at ${basePath}index.json (${response.status})`);
                }
                return response.json();
            })
            .then(indexData => {
                console.log(`Successfully loaded index for ${dataType}:`, indexData);

                if (!Array.isArray(indexData.files)) {
                    throw new Error(`Invalid index file at ${basePath}index.json - no files array`);
                }

                // Load each file in the index
                const promises = indexData.files.map(filename => {
                    const path = `${basePath}${filename}`;
                    console.log(`Loading ${dataType} file: ${path}`);

                    return fetch(path)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`File not found: ${path} (${response.status})`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log(`Successfully loaded data from ${path}:`, data);

                            // Validate the data
                            const isValid = this.loader.validate(data, dataType);
                            if (!isValid) {
                                console.warn(`Invalid ${dataType} data in ${path}:`, Validator.getErrors());
                                return;
                            }

                            // Process the data based on its structure
                            if (Array.isArray(data)) {
                                // Process each item in the array
                                data.forEach(item => {
                                    if (item.id) {
                                        console.log(`Adding ${dataType} to cache: ${item.id}`);
                                        targetCache[item.id] = item;
                                    } else {
                                        console.warn(`Item without id in ${path}`);
                                    }
                                });
                            } else if (data.id) {
                                // It's a single object with an id
                                console.log(`Adding single ${dataType} to cache: ${data.id}`);
                                targetCache[data.id] = data;
                            } else {
                                console.warn(`Data without id in ${path}`);
                            }
                        })
                        .catch(error => {
                            console.error(`Error loading ${path}:`, error);
                        });
                });

                return Promise.all(promises);
            })
            .catch(error => {
                console.error(`Error loading index at ${basePath}:`, error);
                return Promise.resolve(); // Continue even if index fails
            });
    }

    /**
     * Get a tile definition by ID
     *
     * @param {string} id - Tile ID
     * @returns {Object|null} Tile definition or null if not found
     */
    getTile(id) {
        const tile = this.tiles[id] || null;
        if (!tile) {
            console.warn(`Tile not found: ${id}. Available tiles:`, Object.keys(this.tiles));
        }
        return tile;
    }

    /**
     * Get an entity definition by ID
     *
     * @param {string} id - Entity ID
     * @returns {Object|null} Entity definition or null if not found
     */
    getEntity(id) {
        const entity = this.entities[id] || null;
        if (!entity) {
            console.warn(`Entity not found: ${id}. Available entities:`, Object.keys(this.entities));
        }
        return entity;
    }

    /**
     * Get a zone definition by ID
     *
     * @param {string} id - Zone ID
     * @returns {Object|null} Zone definition or null if not found
     */
    getZone(id) {
        const zone = this.zones[id] || null;
        if (!zone) {
            console.warn(`Zone not found: ${id}. Available zones:`, Object.keys(this.zones));
        }
        return zone;
    }

    /**
     * Get an interaction definition by ID
     *
     * @param {string} id - Interaction ID
     * @returns {Object|null} Interaction definition or null if not found
     */
    getInteraction(id) {
        const interaction = this.interactions[id] || null;
        if (!interaction) {
            console.warn(`Interaction not found: ${id}. Available interactions:`, Object.keys(this.interactions));
        }
        return interaction;
    }

    /**
     * Get all tiles
     *
     * @returns {Object} All tile definitions
     */
    getAllTiles() {
        return {...this.tiles};
    }

    /**
     * Get all entities
     *
     * @returns {Object} All entity definitions
     */
    getAllEntities() {
        return {...this.entities};
    }

    /**
     * Get all zones
     *
     * @returns {Object} All zone definitions
     */
    getAllZones() {
        return {...this.zones};
    }

    /**
     * Get all interactions
     *
     * @returns {Object} All interaction definitions
     */
    getAllInteractions() {
        return {...this.interactions};
    }

    /**
     * Create a new instance of a zone from definition
     *
     * @param {string} zoneId - ID of the zone to create
     * @param {Object} scene - Scene to attach the zone to
     * @returns {Zone|null} Created zone or null if definition not found
     */
    createZone(zoneId, scene) {
        const zoneData = this.getZone(zoneId);

        if (!zoneData) {
            console.error(`Zone definition not found: ${zoneId}`);
            return null;
        }

        return new Zone(scene, zoneData);
    }

    /**
     * Create a new instance of an entity from definition
     *
     * @param {string} entityId - ID of the entity definition
     * @param {Object} scene - Scene to attach the entity to
     * @param {Object} [overrideProps] - Properties to override in the definition
     * @returns {Entity|null} Created entity or null if definition not found
     */
    createEntity(entityId, scene, overrideProps = {}) {
        const entityData = this.getEntity(entityId);

        if (!entityData) {
            console.error(`Entity definition not found: ${entityId}`);
            return null;
        }

        // Merge override properties
        const config = {...entityData, ...overrideProps};

        // Create the appropriate entity type
        switch (config.type) {
            case CONSTANTS.ENTITY_TYPES.PLAYER:
                return new Player(scene, config);

            case CONSTANTS.ENTITY_TYPES.NPC:
                return new NPC(scene, config);

            case CONSTANTS.ENTITY_TYPES.ITEM:
                return new Item(scene, config);

            default:
                return new Entity(scene, config);
        }
    }

    /**
     * Debug method to log the content of all data caches
     */
    logDataCaches() {
        console.log("=== DATA CACHE CONTENTS ===");
        console.log("Tiles:", this.tiles);
        console.log("Entities:", this.entities);
        console.log("Zones:", this.zones);
        console.log("Interactions:", this.interactions);
        console.log("=========================");
    }
}