/**
 * Item Entity class
 * Represents an item in the game that can be picked up or interacted with
 */
class Item extends Entity {
    /**
     * Create a new Item entity
     *
     * @param {Object} scene - The scene this item belongs to
     * @param {Object} config - Item configuration
     */
    constructor(scene, config) {
        // Set default item properties
        const itemConfig = {
            type: CONSTANTS.ENTITY_TYPES.ITEM,
            displayName: 'Item',
            color: '#FFFF00', // Yellow
            shape: CONSTANTS.SHAPES.RECTANGLE,
            size: 0.5,
            interactable: true,
            tags: ['item', 'collectible'],
            ...config
        };

        super(scene, itemConfig);

        // Item-specific properties
        this.pickupable = config.pickupable !== undefined ? config.pickupable : true;
        this.useEffect = config.useEffect || null;
        this.stackable = config.stackable !== undefined ? config.stackable : true;
        this.quantity = config.quantity || 1;
        this.dialogOnPickup = config.dialogOnPickup || null;
    }

    /**
     * Handle interaction with this item
     *
     * @param {Entity} interactor - Entity initiating the interaction
     * @returns {boolean} Whether the interaction was handled
     */
    onInteract(interactor) {
        // Only respond to player interactions
        if (interactor.type !== CONSTANTS.ENTITY_TYPES.PLAYER) {
            return false;
        }

        // Handle pickup if this item is pickupable
        if (this.pickupable) {
            return this.onPickup(interactor);
        }

        // Handle use if this item has a use effect but isn't pickupable
        if (this.useEffect) {
            return this.onUse(interactor);
        }

        return false;
    }

    /**
     * Handle pickup interaction
     *
     * @param {Entity} interactor - Entity picking up the item
     * @returns {boolean} Whether the pickup was successful
     */
    onPickup(interactor) {
        // Make sure the interactor is a player and can collect items
        if (interactor.type !== CONSTANTS.ENTITY_TYPES.PLAYER ||
            !interactor.addToInventory) {
            return false;
        }

        // Add to player's inventory
        interactor.addToInventory(this);

        // Show dialog if configured
        if (this.dialogOnPickup) {
            this.scene.showDialog({
                content: this.dialogOnPickup,
                speaker: '',
                waitForInput: false,
                duration: 2000
            });
        }

        // Remove from the scene
        this.scene.removeEntity(this);

        return true;
    }

    /**
     * Handle use interaction
     *
     * @param {Entity} user - Entity using the item
     * @returns {boolean} Whether the use was successful
     */
    onUse(user) {
        // If no use effect defined, do nothing
        if (!this.useEffect) {
            return false;
        }

        // Handle different use effect types
        switch (this.useEffect.type) {
            case 'heal':
                if (user.health !== undefined && this.useEffect.amount !== undefined) {
                    user.health = Math.min(user.health + this.useEffect.amount, user.maxHealth || 100);
                    return true;
                }
                break;

            case 'teleport':
                if (this.useEffect.targetZone &&
                    this.useEffect.targetX !== undefined &&
                    this.useEffect.targetY !== undefined) {
                    this.scene.changeZone(
                        this.useEffect.targetZone,
                        this.useEffect.targetX,
                        this.useEffect.targetY
                    );
                    return true;
                }
                break;

            case 'dialog':
                if (this.useEffect.content) {
                    this.scene.showDialog({
                        content: this.useEffect.content,
                        speaker: this.useEffect.speaker || this.displayName,
                        waitForInput: this.useEffect.waitForInput !== undefined
                            ? this.useEffect.waitForInput
                            : true
                    });
                    return true;
                }
                break;

            default:
                // Custom effect, emit an event for other systems to handle
                this.scene.events.emit(`item-use-${this.useEffect.type}`, {
                    item: this,
                    user: user,
                    effect: this.useEffect
                });
                return true;
        }

        return false;
    }

    /**
     * Decrease item quantity after use
     *
     * @param {number} amount - Amount to decrease (default 1)
     * @returns {number} New quantity
     */
    decreaseQuantity(amount = 1) {
        this.quantity = Math.max(0, this.quantity - amount);

        // Return the new quantity
        return this.quantity;
    }

    /**
     * Increase item quantity
     *
     * @param {number} amount - Amount to increase (default 1)
     * @returns {number} New quantity
     */
    increaseQuantity(amount = 1) {
        this.quantity += amount;

        // Return the new quantity
        return this.quantity;
    }

    /**
     * Check if item can stack with another item
     *
     * @param {Item} otherItem - Item to check stacking with
     * @returns {boolean} Whether the items can stack
     */
    canStackWith(otherItem) {
        if (!this.stackable || !otherItem.stackable) {
            return false;
        }

        // Check if items are the same type
        return this.id === otherItem.id;
    }

    /**
     * Stack with another item
     *
     * @param {Item} otherItem - Item to stack with
     * @returns {boolean} Whether the stacking was successful
     */
    stackWith(otherItem) {
        if (!this.canStackWith(otherItem)) {
            return false;
        }

        // Add quantities
        this.quantity += otherItem.quantity;

        return true;
    }

    /**
     * Serialize item for saving
     *
     * @returns {Object} Serialized item data
     */
    serialize() {
        const data = super.serialize();

        // Add item-specific properties
        data.pickupable = this.pickupable;
        data.useEffect = this.useEffect;
        data.stackable = this.stackable;
        data.quantity = this.quantity;

        return data;
    }
}