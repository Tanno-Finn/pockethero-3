/**
 * Interaction class
 * Base class for interactions between entities
 */
class Interaction {
    /**
     * Create a new interaction
     *
     * @param {Object} scene - The scene this interaction belongs to
     * @param {Object} config - Interaction configuration
     */
    constructor(scene, config) {
        this.scene = scene;
        this.id = config.id || Helpers.generateId();
        this.displayName = config.displayName || 'Interaction';
        this.requiredTags = config.requiredTags || [];
        this.directions = config.directions || Object.values(CONSTANTS.DIRECTIONS);
        this.eventType = config.eventType || '';
        this.keyBinding = config.keyBinding || CONSTANTS.KEYS.INTERACT;
        this.properties = config.properties || {};
    }

    /**
     * Check if an entity can be interacted with using this interaction
     *
     * @param {Entity} entity - Entity to check
     * @returns {boolean} Whether the entity can be interacted with
     */
    canInteractWith(entity) {
        // Check if the entity has all required tags
        return Helpers.hasAllTags(entity, this.requiredTags);
    }

    /**
     * Check if interaction is valid from a specific direction
     *
     * @param {string} direction - Direction to check
     * @returns {boolean} Whether interaction is valid from the direction
     */
    isValidDirection(direction) {
        return this.directions.includes(direction);
    }

    /**
     * Execute the interaction
     *
     * @param {Entity} source - Entity initiating the interaction
     * @param {Entity} target - Entity being interacted with
     * @param {string} direction - Direction of interaction
     * @returns {boolean} Whether the interaction was successful
     */
    execute(source, target, direction) {
        // Check if the interaction is valid
        if (!this.canInteractWith(target)) {
            return false;
        }

        // Check if the direction is valid
        if (!this.isValidDirection(direction)) {
            return false;
        }

        // Emit the interaction event
        this.scene.events.emit(this.eventType, {
            source: source,
            target: target,
            direction: direction,
            interaction: this
        });

        return true;
    }

    /**
     * Get an appropriate interaction message
     *
     * @param {Entity} target - Entity being interacted with
     * @returns {string} Interaction message
     */
    getMessage(target) {
        return `${this.displayName} ${target.displayName}`;
    }

    /**
     * Generate a serializable representation of this interaction
     *
     * @returns {Object} Serialized interaction data
     */
    serialize() {
        return {
            id: this.id,
            displayName: this.displayName,
            requiredTags: [...this.requiredTags],
            directions: [...this.directions],
            eventType: this.eventType,
            keyBinding: this.keyBinding,
            properties: {...this.properties}
        };
    }
}