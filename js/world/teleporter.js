/**
 * Teleporter class
 * Handles teleportation between zones
 */
class Teleporter {
    /**
     * Create a new teleporter
     *
     * @param {Object} config - Teleporter configuration
     */
    constructor(config) {
        this.sourceZone = config.sourceZone || '';
        this.sourceX = config.sourceX || 0;
        this.sourceY = config.sourceY || 0;
        this.targetZone = config.targetZone || '';
        this.targetX = config.targetX || 0;
        this.targetY = config.targetY || 0;
        this.isActive = config.isActive !== undefined ? config.isActive : true;
        this.properties = config.properties || {};
    }

    /**
     * Set the teleporter in a grid
     *
     * @param {Grid} grid - The grid to place the teleporter in
     * @returns {boolean} Whether the teleporter was successfully placed
     */
    placeInGrid(grid) {
        if (!grid || !grid.isInBounds(this.sourceX, this.sourceY)) {
            return false;
        }

        // Create a teleporter tile
        const teleporterTile = new Tile({
            x: this.sourceX,
            y: this.sourceY,
            type: CONSTANTS.TILE_TYPES.TELEPORTER,
            properties: {
                targetZone: this.targetZone,
                targetX: this.targetX,
                targetY: this.targetY,
                isActive: this.isActive,
                ...this.properties
            },
            tags: ['teleporter', 'passable']
        });

        // Set the tile in the grid
        return grid.setTileAt(this.sourceX, this.sourceY, teleporterTile);
    }

    /**
     * Create a linked teleporter (bidirectional)
     * Creates both this teleporter and a return teleporter in the target zone
     *
     * @param {Object} sourceGrid - The source zone grid
     * @param {Object} targetGrid - The target zone grid
     * @returns {Object} The created return teleporter
     */
    createLinkedTeleporter(sourceGrid, targetGrid) {
        // Place this teleporter in the source grid
        this.placeInGrid(sourceGrid);

        // Create a return teleporter
        const returnTeleporter = new Teleporter({
            sourceZone: this.targetZone,
            sourceX: this.targetX,
            sourceY: this.targetY,
            targetZone: this.sourceZone,
            targetX: this.sourceX,
            targetY: this.sourceY,
            isActive: this.isActive,
            properties: this.properties
        });

        // Place the return teleporter in the target grid
        returnTeleporter.placeInGrid(targetGrid);

        return returnTeleporter;
    }

    /**
     * Activate the teleporter
     */
    activate() {
        this.isActive = true;
    }

    /**
     * Deactivate the teleporter
     */
    deactivate() {
        this.isActive = false;
    }

    /**
     * Check if a position is on this teleporter
     *
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} Whether the position is on this teleporter
     */
    isAt(x, y) {
        return this.sourceX === x && this.sourceY === y;
    }

    /**
     * Generate a serializable representation of this teleporter
     *
     * @returns {Object} Serialized teleporter data
     */
    serialize() {
        return {
            sourceZone: this.sourceZone,
            sourceX: this.sourceX,
            sourceY: this.sourceY,
            targetZone: this.targetZone,
            targetX: this.targetX,
            targetY: this.targetY,
            isActive: this.isActive,
            properties: {...this.properties}
        };
    }
}