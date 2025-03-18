/**
 * Camera system
 * Manages the viewport and follows the player
 */
class Camera {
    /**
     * Create a new camera
     *
     * @param {Object} scene - The scene this camera belongs to
     */
    constructor(scene) {
        this.scene = scene;
        this.x = 0;
        this.y = 0;
        this.width = CONFIG.phaser.width;
        this.height = CONFIG.phaser.height;
        this.following = null;
        this.followPlayer = CONFIG.game.camera.followPlayer;
        this.deadzone = CONFIG.game.camera.deadzone;
        this.bounds = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
    }

    /**
     * Update camera position
     *
     * @param {number} delta - Time since last update in ms
     */
    update(delta) {
        // If following an entity, update position
        if (this.following && this.followPlayer) {
            this.followEntity(delta);
        }

        // Ensure camera stays within bounds
        this.clampToBounds();
    }

    /**
     * Set camera bounds
     *
     * @param {number} x - Left bound
     * @param {number} y - Top bound
     * @param {number} width - Bounds width
     * @param {number} height - Bounds height
     */
    setBounds(x, y, width, height) {
        this.bounds = { x, y, width, height };
    }

    /**
     * Set bounds based on grid dimensions
     *
     * @param {Object} grid - The grid to set bounds from
     */
    setBoundsToGrid(grid) {
        // Check if grid is valid
        if (!grid) {
            console.warn("Cannot set camera bounds: grid is null or undefined");
            // Set default bounds to prevent errors
            this.setBounds(
                0,
                0,
                CONFIG.phaser.width,
                CONFIG.phaser.height
            );
            return;
        }

        this.setBounds(
            0,
            0,
            grid.width * CONSTANTS.TILE_SIZE,
            grid.height * CONSTANTS.TILE_SIZE
        );
    }

    /**
     * Follow an entity
     *
     * @param {Object} entity - Entity to follow
     */
    follow(entity) {
        this.following = entity;

        // Center camera on entity initially
        if (entity) {
            this.centerOn(entity.position.x * CONSTANTS.TILE_SIZE, entity.position.y * CONSTANTS.TILE_SIZE);
        }
    }

    /**
     * Stop following any entity
     */
    stopFollowing() {
        this.following = null;
    }

    /**
     * Enable or disable player following
     *
     * @param {boolean} enable - Whether to enable following
     */
    setFollowPlayer(enable) {
        this.followPlayer = enable;
    }

    /**
     * Center camera on a position
     *
     * @param {number} x - X position to center on (world coordinates)
     * @param {number} y - Y position to center on (world coordinates)
     */
    centerOn(x, y) {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;

        this.clampToBounds();
    }

    /**
     * Move the camera by an offset
     *
     * @param {number} dx - X offset
     * @param {number} dy - Y offset
     */
    move(dx, dy) {
        this.x += dx;
        this.y += dy;

        this.clampToBounds();
    }

    /**
     * Handle following an entity
     *
     * @param {number} delta - Time since last update in ms
     */
    followEntity(delta) {
        if (!this.following) return;

        // Convert entity position to world coordinates
        const targetX = this.following.position.x * CONSTANTS.TILE_SIZE;
        const targetY = this.following.position.y * CONSTANTS.TILE_SIZE;

        // Calculate center of camera
        const cameraX = this.x + this.width / 2;
        const cameraY = this.y + this.height / 2;

        // Check if target is outside deadzone
        let moveX = 0;
        let moveY = 0;

        // Check if target is outside horizontal deadzone
        if (targetX < cameraX - this.deadzone.x / 2) {
            moveX = targetX - (cameraX - this.deadzone.x / 2);
        } else if (targetX > cameraX + this.deadzone.x / 2) {
            moveX = targetX - (cameraX + this.deadzone.x / 2);
        }

        // Check if target is outside vertical deadzone
        if (targetY < cameraY - this.deadzone.y / 2) {
            moveY = targetY - (cameraY - this.deadzone.y / 2);
        } else if (targetY > cameraY + this.deadzone.y / 2) {
            moveY = targetY - (cameraY + this.deadzone.y / 2);
        }

        // Apply movement
        if (moveX !== 0 || moveY !== 0) {
            this.move(moveX, moveY);
        }
    }

    /**
     * Keep camera within bounds
     */
    clampToBounds() {
        // Clamp X position
        if (this.x < this.bounds.x) {
            this.x = this.bounds.x;
        } else if (this.x + this.width > this.bounds.x + this.bounds.width) {
            this.x = this.bounds.x + this.bounds.width - this.width;
        }

        // Clamp Y position
        if (this.y < this.bounds.y) {
            this.y = this.bounds.y;
        } else if (this.y + this.height > this.bounds.y + this.bounds.height) {
            this.y = this.bounds.y + this.bounds.height - this.height;
        }
    }

    /**
     * Convert world coordinates to screen coordinates
     *
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {Object} {x, y} in screen coordinates
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    /**
     * Convert screen coordinates to world coordinates
     *
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @returns {Object} {x, y} in world coordinates
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }

    /**
     * Check if a world position is visible on screen
     *
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @param {number} [margin=0] - Additional margin to consider visible
     * @returns {boolean} Whether the position is visible
     */
    isVisible(worldX, worldY, margin = 0) {
        return worldX >= this.x - margin &&
            worldX <= this.x + this.width + margin &&
            worldY >= this.y - margin &&
            worldY <= this.y + this.height + margin;
    }

    /**
     * Get the visible area in world coordinates
     *
     * @returns {Object} Visible area {x, y, width, height}
     */
    getVisibleArea() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Convert the visible area to grid coordinates
     *
     * @returns {Object} Grid coordinates {startX, startY, endX, endY}
     */
    getVisibleGridArea() {
        return {
            startX: Math.floor(this.x / CONSTANTS.TILE_SIZE),
            startY: Math.floor(this.y / CONSTANTS.TILE_SIZE),
            endX: Math.ceil((this.x + this.width) / CONSTANTS.TILE_SIZE),
            endY: Math.ceil((this.y + this.height) / CONSTANTS.TILE_SIZE)
        };
    }
}