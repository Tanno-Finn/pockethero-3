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
        ]);
    }

    /**
     * Load all tile definitions
     *
     * @returns {Promise} Promise that resolves when tiles are loaded
     */
    loadTiles() {
        return this.loadDataFiles(CONSTANTS.DATA_PATHS.TILES, 'tile', this.tiles);
    }

    /**
     * Load all entity definitions
     *
     * @returns {Promise} Promise that resolves when entities are loaded
     */
    loadEntities() {
        return this.loadDataFiles(CONSTANTS.DATA_PATHS.ENTITIES, 'entity', this.entities);
    }

    /**
     * Load all zone definitions
     *
     * @returns {Promise} Promise that resolves when zones are loaded
     */
    loadZones() {
        return this.loadDataFiles(CONSTANTS.DATA_PATHS.ZONES, 'zone', this.zones);
    }

    /**
     * Load all interaction definitions
     *
     * @returns {Promise} Promise that resolves when interactions are loaded
     */
    loadInteractions() {
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
        // Load the index file first
        return this.loader.load(`${basePath}index.json`)
            .then(indexData => {
                if (!Array.isArray(indexData.files)) {
                    throw new Error(`Invalid index file at ${basePath}index.json`);
                }

                // Load each file in the index
                const promises = indexData.files.map(filename => {
                    const path = `${basePath}${filename}`;

                    return this.loader.load(path)
                        .then(data => {
                            // Validate the data
                            if (!this.loader.validate(data, dataType)) {
                                console.warn(`Invalid ${dataType} data in ${path}`);
                                return;
                            }

                            // Store in the appropriate cache
                            if (Array.isArray(data)) {
                                // If it's an array, process each item
                                data.forEach(item => {
                                    if (item.id) {
                                        targetCache[item.id] = item;
                                    } else {
                                        console.warn(`Item without id in ${path}`);
                                    }
                                });
                            } else if (data.id) {
                                // If it's a single object with an id
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
        return this.tiles[id] || null;
    }

    /**
     * Get an entity definition by ID
     *
     * @param {string} id - Entity ID
     * @returns {Object|null} Entity definition or null if not found
     */
    getEntity(id) {
        return this.entities[id] || null;
    }

    /**
     * Get a zone definition by ID
     *
     * @param {string} id - Zone ID
     * @returns {Object|null} Zone definition or null if not found
     */
    getZone(id) {
        return this.zones[id] || null;
    }

    /**
     * Get an interaction definition by ID
     *
     * @param {string} id - Interaction ID
     * @returns {Object|null} Interaction definition or null if not found
     */
    getInteraction(id) {
        return this.interactions[id] || null;
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
}