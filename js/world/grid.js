/**
 * Grid system
 * Manages the tile-based grid for the game world
 */
class Grid {
    /**
     * Create a new grid
     *
     * @param {Object} scene - The scene this grid belongs to
     * @param {Object} config - Grid configuration
     */
    constructor(scene, config) {
        this.scene = scene;
        this.width = config.width || 20;
        this.height = config.height || 15;
        this.tileSize = config.tileSize || CONSTANTS.TILE_SIZE;
        this.defaultTileType = config.defaultTileType || CONSTANTS.TILE_TYPES.GRASS;

        // Initialize the grid with default tiles
        this.tiles = [];
        this.reset();
    }

    /**
     * Reset the grid to default state
     */
    reset() {
        this.tiles = [];

        // Initialize with default tiles
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = new Tile({
                    x: x,
                    y: y,
                    type: this.defaultTileType
                });
            }
        }
    }

    /**
     * Load grid data from a configuration object
     *
     * @param {Object} data - Grid data
     */
    loadFromData(data) {
        // Reset to ensure clean state
        this.reset();

        // Update grid dimensions if specified
        if (data.width !== undefined) this.width = data.width;
        if (data.height !== undefined) this.height = data.height;
        if (data.defaultTile !== undefined) this.defaultTileType = data.defaultTile;

        // Resize grid if needed
        if (this.tiles.length !== this.height || (this.tiles[0] && this.tiles[0].length !== this.width)) {
            this.reset();
        }

        // Load tile data
        if (data.tiles && Array.isArray(data.tiles)) {
            data.tiles.forEach(tileData => {
                if (tileData.x !== undefined &&
                    tileData.y !== undefined &&
                    tileData.type !== undefined) {
                    this.setTileAt(tileData.x, tileData.y, new Tile({
                        x: tileData.x,
                        y: tileData.y,
                        type: tileData.type,
                        properties: tileData.properties || {}
                    }));
                }
            });
        }
    }

    /**
     * Check if coordinates are within the grid bounds
     *
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} Whether the coordinates are in bounds
     */
    isInBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    /**
     * Get the tile at specific coordinates
     *
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Tile|null} The tile or null if out of bounds
     */
    getTileAt(x, y) {
        if (!this.isInBounds(x, y)) {
            return null;
        }

        return this.tiles[y][x];
    }

    /**
     * Set a tile at specific coordinates
     *
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {Tile} tile - The tile to set
     * @returns {boolean} Whether the tile was set
     */
    setTileAt(x, y, tile) {
        if (!this.isInBounds(x, y)) {
            return false;
        }

        this.tiles[y][x] = tile;
        return true;
    }

    /**
     * Get neighboring tiles around coordinates
     *
     * @param {number} x - Center X coordinate
     * @param {number} y - Center Y coordinate
     * @returns {Object} Object with tiles in each direction
     */
    getNeighbors(x, y) {
        return {
            north: this.isInBounds(x, y - 1) ? this.tiles[y - 1][x] : null,
            east: this.isInBounds(x + 1, y) ? this.tiles[y][x + 1] : null,
            south: this.isInBounds(x, y + 1) ? this.tiles[y + 1][x] : null,
            west: this.isInBounds(x - 1, y) ? this.tiles[y][x - 1] : null
        };
    }

    /**
     * Get all tiles of a specific type
     *
     * @param {string} tileType - The tile type to find
     * @returns {Array} Array of tiles matching the type
     */
    getTilesByType(tileType) {
        const result = [];

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.tiles[y][x].type === tileType) {
                    result.push(this.tiles[y][x]);
                }
            }
        }

        return result;
    }

    /**
     * Find tiles by a property value
     *
     * @param {string} propertyName - The property name
     * @param {*} propertyValue - The property value
     * @returns {Array} Array of tiles with matching property
     */
    getTilesByProperty(propertyName, propertyValue) {
        const result = [];

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                if (tile.properties &&
                    tile.properties[propertyName] !== undefined &&
                    tile.properties[propertyName] === propertyValue) {
                    result.push(tile);
                }
            }
        }

        return result;
    }

    /**
     * Find all tiles with a specific tag
     *
     * @param {string} tag - The tag to search for
     * @returns {Array} Array of tiles with the tag
     */
    getTilesByTag(tag) {
        const result = [];

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                if (tile.tags && tile.tags.includes(tag)) {
                    result.push(tile);
                }
            }
        }

        return result;
    }

    /**
     * Convert world coordinates to grid coordinates
     *
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {Object} {x, y} in grid coordinates
     */
    worldToGrid(worldX, worldY) {
        return {
            x: Math.floor(worldX / this.tileSize),
            y: Math.floor(worldY / this.tileSize)
        };
    }

    /**
     * Convert grid coordinates to world coordinates
     *
     * @param {number} gridX - Grid X coordinate
     * @param {number} gridY - Grid Y coordinate
     * @returns {Object} {x, y} in world coordinates
     */
    gridToWorld(gridX, gridY) {
        return {
            x: gridX * this.tileSize,
            y: gridY * this.tileSize
        };
    }
}