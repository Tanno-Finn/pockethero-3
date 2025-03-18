/**
 * Renderer class
 * Handles rendering of the game world using Phaser's graphics
 */
class Renderer {
    /**
     * Create a new renderer
     *
     * @param {Object} scene - The scene this renderer belongs to
     */
    constructor(scene) {
        this.scene = scene;
        this.graphics = null;
        this.debugGraphics = null;
        this.shapeFactory = new ShapeFactory(scene);
        this.showGrid = CONFIG.game.debug.showGrid;
        this.showEntityInfo = CONFIG.game.debug.showEntityInfo;

        // Initialize graphics objects
        this.init();
    }

    /**
     * Initialize the renderer
     */
    init() {
        // Create main graphics object for rendering
        this.graphics = this.scene.add.graphics();

        // Create debug graphics object
        this.debugGraphics = this.scene.add.graphics();
    }

    /**
     * Clear all rendered content
     */
    clear() {
        this.graphics.clear();
        this.debugGraphics.clear();
    }

    /**
     * Render the game world
     *
     * @param {Object} grid - The grid to render
     * @param {Array} entities - Array of entities to render
     * @param {Object} camera - Camera information for viewport
     */
    render(grid, entities, camera) {
        // Clear previous rendering
        this.clear();

        // Calculate visible area
        const visibleArea = this.getVisibleArea(camera);

        // Render grid
        this.renderGrid(grid, visibleArea);

        // Render entities
        this.renderEntities(entities, visibleArea);

        // Render debug info if enabled
        if (this.showGrid || this.showEntityInfo) {
            this.renderDebug(grid, entities, visibleArea);
        }
    }

    /**
     * Get the visible area based on camera position
     *
     * @param {Object} camera - Camera information
     * @returns {Object} Visible area bounds
     */
    getVisibleArea(camera) {
        // Convert camera position to grid coordinates
        const gridX = Math.floor(camera.x / CONSTANTS.TILE_SIZE);
        const gridY = Math.floor(camera.y / CONSTANTS.TILE_SIZE);

        // Calculate visible tiles
        const visibleTilesX = Math.ceil(camera.width / CONSTANTS.TILE_SIZE) + 1;
        const visibleTilesY = Math.ceil(camera.height / CONSTANTS.TILE_SIZE) + 1;

        return {
            startX: Math.max(0, gridX - Math.floor(visibleTilesX / 2)),
            startY: Math.max(0, gridY - Math.floor(visibleTilesY / 2)),
            endX: gridX + Math.ceil(visibleTilesX / 2),
            endY: gridY + Math.ceil(visibleTilesY / 2)
        };
    }

    /**
     * Render the grid
     *
     * @param {Object} grid - The grid to render
     * @param {Object} visibleArea - Visible area bounds
     */
    renderGrid(grid, visibleArea) {
        // Iterate through visible tiles
        for (let y = visibleArea.startY; y < visibleArea.endY; y++) {
            for (let x = visibleArea.startX; x < visibleArea.endX; x++) {
                // Skip tiles outside grid bounds
                if (!grid.isInBounds(x, y)) {
                    continue;
                }

                const tile = grid.getTileAt(x, y);
                if (tile) {
                    this.renderTile(tile, x, y);
                }
            }
        }
    }

    /**
     * Render a single tile
     *
     * @param {Object} tile - The tile to render
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    renderTile(tile, x, y) {
        // Calculate screen position
        const screenX = x * CONSTANTS.TILE_SIZE;
        const screenY = y * CONSTANTS.TILE_SIZE;

        // Set fill color
        this.graphics.fillStyle(Phaser.Display.Color.HexStringToColor(tile.color).color, 1);

        // Draw tile based on type
        this.graphics.fillRect(screenX, screenY, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);

        // Add tile-specific detail based on type
        switch (tile.type) {
            case CONSTANTS.TILE_TYPES.TELEPORTER:
                // Draw teleporter portal effect (circular highlight)
                this.graphics.fillStyle(0xFFFFFF, 0.3);
                this.graphics.fillCircle(
                    screenX + CONSTANTS.TILE_SIZE / 2,
                    screenY + CONSTANTS.TILE_SIZE / 2,
                    CONSTANTS.TILE_SIZE / 4
                );
                break;

            case CONSTANTS.TILE_TYPES.WATER:
                // Draw water wave lines
                this.graphics.lineStyle(1, 0xFFFFFF, 0.3);
                const waveY1 = screenY + CONSTANTS.TILE_SIZE / 3;
                const waveY2 = screenY + CONSTANTS.TILE_SIZE * 2 / 3;

                this.graphics.beginPath();
                this.graphics.moveTo(screenX, waveY1);
                this.graphics.bezierCurveTo(
                    screenX + CONSTANTS.TILE_SIZE / 4, waveY1 - 2,
                    screenX + CONSTANTS.TILE_SIZE * 3 / 4, waveY1 + 2,
                    screenX + CONSTANTS.TILE_SIZE, waveY1
                );
                this.graphics.stroke();

                this.graphics.beginPath();
                this.graphics.moveTo(screenX, waveY2);
                this.graphics.bezierCurveTo(
                    screenX + CONSTANTS.TILE_SIZE / 4, waveY2 + 2,
                    screenX + CONSTANTS.TILE_SIZE * 3 / 4, waveY2 - 2,
                    screenX + CONSTANTS.TILE_SIZE, waveY2
                );
                this.graphics.stroke();
                break;

            case CONSTANTS.TILE_TYPES.FOREST:
                // Draw simple tree symbol
                this.graphics.fillStyle(0x004400, 0.5);
                this.graphics.fillTriangle(
                    screenX + CONSTANTS.TILE_SIZE / 2, screenY + CONSTANTS.TILE_SIZE / 4,
                    screenX + CONSTANTS.TILE_SIZE / 4, screenY + CONSTANTS.TILE_SIZE * 3 / 4,
                    screenX + CONSTANTS.TILE_SIZE * 3 / 4, screenY + CONSTANTS.TILE_SIZE * 3 / 4
                );
                break;
        }
    }

    /**
     * Render entities
     *
     * @param {Array} entities - Array of entities to render
     * @param {Object} visibleArea - Visible area bounds
     */
    renderEntities(entities, visibleArea) {
        // Sort entities by Y position for proper layering
        const sortedEntities = [...entities].sort((a, b) => a.position.y - b.position.y);

        // Render each entity
        for (const entity of sortedEntities) {
            // Skip entities outside visible area
            if (entity.position.x < visibleArea.startX ||
                entity.position.x > visibleArea.endX ||
                entity.position.y < visibleArea.startY ||
                entity.position.y > visibleArea.endY) {
                continue;
            }

            this.renderEntity(entity);
        }
    }

    /**
     * Render a single entity
     *
     * @param {Object} entity - The entity to render
     */
    renderEntity(entity) {
        // Calculate screen position (center of tile)
        const screenX = entity.position.x * CONSTANTS.TILE_SIZE;
        const screenY = entity.position.y * CONSTANTS.TILE_SIZE;

        // Calculate entity size (relative to tile size)
        const size = entity.size * CONSTANTS.TILE_SIZE;

        // Calculate offset to center entity on tile
        const offsetX = (CONSTANTS.TILE_SIZE - size) / 2;
        const offsetY = (CONSTANTS.TILE_SIZE - size) / 2;

        // Set fill color
        this.graphics.fillStyle(Phaser.Display.Color.HexStringToColor(entity.color).color, 1);

        // Draw entity based on shape
        switch (entity.shape) {
            case CONSTANTS.SHAPES.CIRCLE:
                this.graphics.fillCircle(
                    screenX + CONSTANTS.TILE_SIZE / 2,
                    screenY + CONSTANTS.TILE_SIZE / 2,
                    size / 2
                );

                // Draw direction indicator for circle entities
                this.drawDirectionIndicator(entity, screenX, screenY);
                break;

            case CONSTANTS.SHAPES.RECTANGLE:
                this.graphics.fillRect(
                    screenX + offsetX,
                    screenY + offsetY,
                    size,
                    size
                );

                // Draw direction indicator for rectangle entities
                this.drawDirectionIndicator(entity, screenX, screenY);
                break;

            case CONSTANTS.SHAPES.TRIANGLE:
                this.graphics.fillTriangle(
                    screenX + CONSTANTS.TILE_SIZE / 2, screenY + offsetY,
                    screenX + offsetX, screenY + CONSTANTS.TILE_SIZE - offsetY,
                    screenX + CONSTANTS.TILE_SIZE - offsetX, screenY + CONSTANTS.TILE_SIZE - offsetY
                );
                break;

            default:
                // Default to rectangle if shape not recognized
                this.graphics.fillRect(
                    screenX + offsetX,
                    screenY + offsetY,
                    size,
                    size
                );
                break;
        }

        // Draw entity-specific details
        this.drawEntityDetails(entity, screenX, screenY);
    }

    /**
     * Draw direction indicator for an entity
     *
     * @param {Object} entity - The entity
     * @param {number} screenX - Screen X position
     * @param {number} screenY - Screen Y position
     */
    drawDirectionIndicator(entity, screenX, screenY) {
        // Only draw direction for entities with direction property
        if (!entity.direction) return;

        const centerX = screenX + CONSTANTS.TILE_SIZE / 2;
        const centerY = screenY + CONSTANTS.TILE_SIZE / 2;
        const radius = (entity.size * CONSTANTS.TILE_SIZE / 2) * 0.8; // 80% of entity radius

        // Calculate indicator position based on direction
        let indicatorX = centerX;
        let indicatorY = centerY;

        switch (entity.direction) {
            case CONSTANTS.DIRECTIONS.NORTH:
                indicatorY = centerY - radius;
                break;
            case CONSTANTS.DIRECTIONS.EAST:
                indicatorX = centerX + radius;
                break;
            case CONSTANTS.DIRECTIONS.SOUTH:
                indicatorY = centerY + radius;
                break;
            case CONSTANTS.DIRECTIONS.WEST:
                indicatorX = centerX - radius;
                break;
        }

        // Draw direction indicator (white dot)
        this.graphics.fillStyle(0xFFFFFF, 1);
        this.graphics.fillCircle(indicatorX, indicatorY, 3);
    }

    /**
     * Draw entity-specific details
     *
     * @param {Object} entity - The entity
     * @param {number} screenX - Screen X position
     * @param {number} screenY - Screen Y position
     */
    drawEntityDetails(entity, screenX, screenY) {
        // Draw different details based on entity type
        switch (entity.type) {
            case CONSTANTS.ENTITY_TYPES.PLAYER:
                // Highlight player with a subtle glow effect
                this.graphics.fillStyle(0xFFFFFF, 0.2);
                this.graphics.fillCircle(
                    screenX + CONSTANTS.TILE_SIZE / 2,
                    screenY + CONSTANTS.TILE_SIZE / 2,
                    entity.size * CONSTANTS.TILE_SIZE / 2 + 3
                );
                break;

            case CONSTANTS.ENTITY_TYPES.NPC:
                // Draw interactable indicator if NPC can be interacted with
                if (entity.interactable) {
                    this.drawInteractableIndicator(screenX, screenY);
                }
                break;

            case CONSTANTS.ENTITY_TYPES.ITEM:
                // Draw a sparkle effect for items
                this.drawSparkle(screenX, screenY);

                // Draw interactable indicator if item can be interacted with
                if (entity.interactable) {
                    this.drawInteractableIndicator(screenX, screenY);
                }
                break;
        }
    }

    /**
     * Draw an interactable indicator
     *
     * @param {number} screenX - Screen X position
     * @param {number} screenY - Screen Y position
     */
    drawInteractableIndicator(screenX, screenY) {
        // Draw a small exclamation mark or indicator above the entity
        this.graphics.fillStyle(0xFFFFFF, 0.7);
        this.graphics.fillCircle(
            screenX + CONSTANTS.TILE_SIZE / 2,
            screenY - 5,
            3
        );
    }

    /**
     * Draw a sparkle effect for items
     *
     * @param {number} screenX - Screen X position
     * @param {number} screenY - Screen Y position
     */
    drawSparkle(screenX, screenY) {
        // Calculate center point
        const centerX = screenX + CONSTANTS.TILE_SIZE / 2;
        const centerY = screenY + CONSTANTS.TILE_SIZE / 2;

        // Animation time (based on current time)
        const animTime = Date.now() % 2000 / 2000;

        // Only show sparkle part of the time
        if (animTime > 0.7) {
            const sparkleSize = 4 + Math.sin(animTime * Math.PI * 2) * 2;

            // Draw sparkle
            this.graphics.fillStyle(0xFFFFFF, 0.8);

            // Draw a star shape
            this.graphics.lineStyle(1, 0xFFFFFF, 0.8);
            this.graphics.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = Math.PI / 2 * i;
                this.graphics.moveTo(centerX, centerY);
                this.graphics.lineTo(
                    centerX + Math.cos(angle) * sparkleSize,
                    centerY + Math.sin(angle) * sparkleSize
                );
            }
            this.graphics.strokePath();
        }
    }

    /**
     * Render debug information
     *
     * @param {Object} grid - The grid
     * @param {Array} entities - Array of entities
     * @param {Object} visibleArea - Visible area bounds
     */
    renderDebug(grid, entities, visibleArea) {
        // Draw grid lines if enabled
        if (this.showGrid) {
            this.renderGridLines(visibleArea);
        }

        // Draw entity info if enabled
        if (this.showEntityInfo) {
            this.renderEntityInfo(entities, visibleArea);
        }
    }

    /**
     * Render grid lines
     *
     * @param {Object} visibleArea - Visible area bounds
     */
    renderGridLines(visibleArea) {
        this.debugGraphics.lineStyle(1, 0xFFFFFF, 0.3);

        // Draw vertical lines
        for (let x = visibleArea.startX; x <= visibleArea.endX; x++) {
            const screenX = x * CONSTANTS.TILE_SIZE;
            this.debugGraphics.beginPath();
            this.debugGraphics.moveTo(screenX, visibleArea.startY * CONSTANTS.TILE_SIZE);
            this.debugGraphics.lineTo(screenX, visibleArea.endY * CONSTANTS.TILE_SIZE);
            this.debugGraphics.strokePath();
        }

        // Draw horizontal lines
        for (let y = visibleArea.startY; y <= visibleArea.endY; y++) {
            const screenY = y * CONSTANTS.TILE_SIZE;
            this.debugGraphics.beginPath();
            this.debugGraphics.moveTo(visibleArea.startX * CONSTANTS.TILE_SIZE, screenY);
            this.debugGraphics.lineTo(visibleArea.endX * CONSTANTS.TILE_SIZE, screenY);
            this.debugGraphics.strokePath();
        }
    }

    /**
     * Render entity info
     *
     * @param {Array} entities - Array of entities
     * @param {Object} visibleArea - Visible area bounds
     */
    renderEntityInfo(entities, visibleArea) {
        for (const entity of entities) {
            // Skip entities outside visible area
            if (entity.position.x < visibleArea.startX ||
                entity.position.x > visibleArea.endX ||
                entity.position.y < visibleArea.startY ||
                entity.position.y > visibleArea.endY) {
                continue;
            }

            // Calculate screen position
            const screenX = entity.position.x * CONSTANTS.TILE_SIZE;
            const screenY = entity.position.y * CONSTANTS.TILE_SIZE;

            // Draw entity info text
            const textX = screenX + CONSTANTS.TILE_SIZE / 2;
            const textY = screenY - 5;

            // Create text if not already created
            if (!entity.debugText) {
                entity.debugText = this.scene.add.text(
                    textX,
                    textY,
                    entity.displayName || entity.type,
                    {
                        font: '10px Arial',
                        fill: '#FFFFFF',
                        backgroundColor: '#00000080',
                        padding: { x: 2, y: 1 }
                    }
                );
                entity.debugText.setOrigin(0.5, 1);
            } else {
                // Update text position if it already exists
                entity.debugText.setPosition(textX, textY);
            }
        }
    }

    /**
     * Toggle debug grid display
     *
     * @returns {boolean} New grid display state
     */
    toggleGrid() {
        this.showGrid = !this.showGrid;
        return this.showGrid;
    }

    /**
     * Toggle entity info display
     *
     * @returns {boolean} New entity info display state
     */
    toggleEntityInfo() {
        this.showEntityInfo = !this.showEntityInfo;

        // Hide all debug texts if turning off
        if (!this.showEntityInfo) {
            this.scene.entities.forEach(entity => {
                if (entity.debugText) {
                    entity.debugText.setVisible(false);
                }
            });
        }

        return this.showEntityInfo;
    }
}