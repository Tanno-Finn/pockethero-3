# Grid World

A top-down 2D tile-based game where entities move in discrete steps on a grid. Players can interact with various objects, NPCs, and the environment using a flexible interaction system.

## Overview

Grid World is a minimalist tile-based game built with Phaser 3. The game features:

- Tile-based grid movement
- Various terrain types with different properties
- Direction-based entity interactions
- NPCs, items, and environment objects
- Dialog system
- Simple, colorful rendering using basic shapes
- Zone transitions via teleporters
- Data-driven architecture for easy content creation

## Architecture

```
[Project]
├── index.html            # Entry point
├── js/                   # JavaScript files
│   ├── core/             # Core game engine components
│   │   ├── game.js       # Main game initialization
│   │   ├── config.js     # Game configuration
│   │   └── constants.js  # Game constants
│   ├── scenes/           # Phaser scenes
│   │   ├── BootScene.js  # Initial loading scene
│   │   ├── GameScene.js  # Main gameplay scene
│   │   └── UIScene.js    # UI overlay scene
│   ├── world/            # World-related components
│   │   ├── Grid.js       # Grid system
│   │   ├── Tile.js       # Tile class
│   │   ├── Zone.js       # Zone management
│   │   └── Teleporter.js # Zone transition
│   ├── entities/         # Entity-related components
│   │   ├── Entity.js     # Base entity class
│   │   ├── Player.js     # Player character
│   │   ├── NPC.js        # Non-player characters
│   │   └── Item.js       # Collectible items
│   ├── interactions/     # Interaction system
│   │   ├── Interaction.js # Base interaction class
│   │   ├── Dialog.js      # Dialog system
│   │   └── EventSystem.js # Event handling
│   ├── rendering/        # Rendering system
│   │   ├── Renderer.js   # Main renderer
│   │   ├── ShapeFactory.js # Shape creation
│   │   └── Camera.js      # Camera controls
│   ├── input/            # Input handling
│   │   └── InputManager.js # User input
│   ├── data/             # Data management
│   │   ├── DataLoader.js # JSON loading
│   │   ├── DataManager.js # Data access
│   │   └── Validator.js  # Data validation
│   └── utils/            # Utility functions
│       ├── helpers.js    # Helper functions
│       └── math.js       # Math utilities
├── css/                  # Stylesheets
│   └── style.css         # Main stylesheet
├── data/                 # Game data (JSON)
│   ├── tiles/            # Tile definitions
│   ├── entities/         # Entity definitions
│   ├── zones/            # Zone layouts
│   └── interactions/     # Interaction definitions
└── tests/                # Test files
    ├── world/            # World system tests
    ├── entities/         # Entity system tests
    ├── interactions/     # Interaction system tests
    └── rendering/        # Rendering tests
```

## File Catalog

### Core Files
- **index.html**: Main entry point that loads Phaser and the game scripts
- **js/core/game.js**: Core game initialization and configuration
- **js/scenes/GameScene.js**: Main gameplay scene handling game logic
- **js/world/Grid.js**: Grid system managing the tile-based world
- **js/entities/Entity.js**: Base class for all game entities
- **js/interactions/Interaction.js**: System for entity interactions
- **js/rendering/Renderer.js**: Custom rendering for tiles and entities
- **js/data/DataLoader.js**: Loads game data from JSON files

## Setup and Usage
1. Clone the repository
2. Open index.html in a modern browser supporting Canvas and ES6+
3. Alternative: Use a local server (like `http-server`) for better performance

## Game Controls
- **W/A/S/D**: Move the player character in four directions
- **E**: Interact with entities (depends on what you're facing)
- **ESC**: Open the game menu (when implemented)

## Data-Driven Content
All game content is defined in JSON files:
- Tile types with properties
- Entity definitions
- Zone layouts
- Interaction rules

New content can be added by creating or modifying these data files without changing code.

## Development
See the following documents for development information:
- [Design Document](docs/design.md): Architecture and design decisions
- [API Reference](docs/api-reference.md): API documentation
- [Coding Guidelines](docs/guidelines.md): Development standards
- [TODO List](docs/todo.md): Development roadmap
- [Changelog](docs/changelog.md): Version history