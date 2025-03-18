/**
 * Game constants
 * All game-wide constants that won't change during runtime
 */

const CONSTANTS = {
    // Game dimensions and scaling
    GAME_WIDTH: 800,
    GAME_HEIGHT: 600,
    TILE_SIZE: 32,

    // Game states
    GAME_STATES: {
        BOOT: 'boot',
        LOADING: 'loading',
        PLAYING: 'playing',
        PAUSED: 'paused',
        DIALOG: 'dialog'
    },

    // Scene keys
    SCENES: {
        BOOT: 'BootScene',
        GAME: 'GameScene',
        UI: 'UIScene'
    },

    // Entity types
    ENTITY_TYPES: {
        PLAYER: 'player',
        NPC: 'npc',
        ITEM: 'item',
        FURNITURE: 'furniture'
    },

    // Tile types (just for reference, actual tiles defined in data)
    TILE_TYPES: {
        GRASS: 'grass',
        FOREST: 'forest',
        WATER: 'water',
        ROCK: 'rock',
        TELEPORTER: 'teleporter'
    },

    // Directions
    DIRECTIONS: {
        NORTH: 'north',
        EAST: 'east',
        SOUTH: 'south',
        WEST: 'west'
    },

    // Input keys
    KEYS: {
        UP: 'W',
        DOWN: 'S',
        LEFT: 'A',
        RIGHT: 'D',
        INTERACT: 'E'
    },

    // Tags
    TAGS: {
        PASSABLE: 'passable',
        BLOCKING: 'blocking',
        INTERACTABLE: 'interactable',
        COLLECTIBLE: 'collectible'
    },

    // Events
    EVENTS: {
        PLAYER_MOVE: 'player_move',
        PLAYER_INTERACT: 'player_interact',
        DIALOG_START: 'dialog_start',
        DIALOG_END: 'dialog_end',
        ITEM_PICKUP: 'item_pickup',
        ZONE_CHANGE: 'zone_change'
    },

    // Shape types
    SHAPES: {
        RECTANGLE: 'rectangle',
        CIRCLE: 'circle',
        TRIANGLE: 'triangle'
    },

    // Data paths
    DATA_PATHS: {
        TILES: 'data/tiles/',
        ENTITIES: 'data/entities/',
        ZONES: 'data/zones/',
        INTERACTIONS: 'data/interactions/'
    }
};