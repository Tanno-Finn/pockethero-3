/**
 * Game configuration
 * Phaser configuration and game settings
 */

const CONFIG = {
    // Phaser configuration
    phaser: {
        type: Phaser.AUTO,
        parent: 'game-container',
        width: CONSTANTS.GAME_WIDTH,
        height: CONSTANTS.GAME_HEIGHT,
        pixelArt: true,
        backgroundColor: '#000000',
        scene: [
            BootScene,
            GameScene,
            UIScene
        ],
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
                gravity: { y: 0 }
            }
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    },

    // Game settings
    game: {
        // Player settings
        player: {
            moveSpeed: 1, // Grid cells per move
            interactionDistance: 1 // How far the player can interact
        },

        // World settings
        world: {
            defaultZone: 'village',
            visibleTiles: {
                width: 15, // Number of tiles visible horizontally
                height: 11 // Number of tiles visible vertically
            }
        },

        // Camera settings
        camera: {
            followPlayer: true,
            deadzone: { // Camera deadzone for player following
                x: 100,
                y: 100
            }
        },

        // Dialog settings
        dialog: {
            textSpeed: 30, // Characters per second
            defaultDuration: 3000 // Default display time in ms
        },

        // Debug settings
        debug: {
            showGrid: true,
            showEntityInfo: true,
            logEvents: true
        }
    }
};