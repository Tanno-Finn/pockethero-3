# Design Document

## Architecture Overview

This project follows a modular, data-driven architecture to support a tile-based top-down 2D game where entities move in discrete steps.

### Core Components

#### Game Engine
The central component that manages the game state and logic. It coordinates between all other components and maintains the game loop.

#### World System
Manages the tile-based world, including:
- Grid-based positioning
- Tile types and properties
- Zone management (different areas/maps)
- Teleportation between zones

#### Entity System
Handles all dynamic objects in the game:
- Player character
- NPCs
- Items
- Furniture and other static objects
- Tag-based property system

#### Interaction System
Manages interactions between entities:
- Direction-based interactions
- Event dispatching
- Dialog system
- Item pickup
- Position swapping
- Custom interactions through configuration

#### Camera System
Controls what portion of the world is visible:
- Follows player within larger zones
- Maintains appropriate view bounds
- Handles zone transitions

#### Renderer
Handles all drawing operations using simple shapes and colors:
- Tile rendering
- Entity rendering
- UI elements
- Effects and animations

#### Input Manager
Processes player input:
- WASD movement
- Interaction with E key
- Additional key bindings for other actions

#### Data Management
Loads and manages game data from JSON files:
- Tile definitions
- Entity definitions
- Zone layouts
- Interaction rules
- Dialog content

## Design Decisions

### Data-Driven Approach
The game uses a data-driven approach where game content is defined in JSON files:
- Core systems are agnostic to specific content
- New content can be added without changing code
- Properties and behaviors are defined through data
- Tag system for flexible property definition

### Grid-Based Movement
- Entities move in discrete steps on a grid
- Movement validation based on tile and entity properties
- Tag system determines passability

### Event-Based Interaction
- Interactions trigger events
- Event handlers determine outcomes
- Direction-sensitive interaction logic
- Configurable interaction types

### Simple Rendering
- Uses basic Canvas shapes (squares, circles) instead of images
- Color-based visual differentiation
- Abstract rendering system for future extension

### Zone Management
- Multiple separate zones (maps)
- Teleporters for zone transitions
- Camera follows player within zones

## Component Interaction

```
[Input Manager] ──→ [Game Engine] ──→ [Renderer]
      │                 │ ↑ ↓             │
      │                 │ │ │             │
      └─────→ [Player] ─┘ │ └─── [Camera] │
                          │               │
[Data Manager] ───────────┘               │
      ↑                                   │
      │                                   │
[JSON Data Files]                         │
   - Tiles                                │
   - Entities                             │
   - Zones                                │
   - Interactions                         │
                                          │
[World System] ────────────────────┐      │
   - Grid                          │      │
   - Tiles                         │      │
   - Zones                         │      │
                                   │      │
[Entity System] ──────────────────┤      │
   - Player                        │      │
   - NPCs                          │      │
   - Items                         │      │
                                   │      │
[Interaction System] ─────────────┘      │
   - Direction Logic                      │
   - Event Handling                       │
   - Dialog                               │
                                          │
[Rendering Pipeline] ←─────────────────────┘
```

## Data Structures

### Tile Data
```json
{
  "id": "grass",
  "displayName": "Grass",
  "color": "#7CFC00",
  "shape": "rectangle",
  "tags": ["passable", "natural"],
  "properties": {
    "movementCost": 1
  }
}
```

### Entity Data
```json
{
  "id": "player",
  "displayName": "Player",
  "color": "#0000FF",
  "shape": "circle",
  "tags": ["character", "controllable"],
  "size": 0.8,
  "interactions": {
    "canInteractWith": ["npc", "item", "furniture"],
    "interactionTypes": ["talk", "pickup", "use"]
  }
}
```

### Zone Data
```json
{
  "id": "village",
  "displayName": "Village",
  "width": 20,
  "height": 15,
  "defaultTile": "grass",
  "tiles": [
    { "x": 5, "y": 7, "type": "water" },
    { "x": 6, "y": 7, "type": "water" }
  ],
  "entities": [
    { "x": 10, "y": 8, "type": "npc", "id": "villager1" },
    { "x": 15, "y": 10, "type": "item", "id": "potion" }
  ],
  "teleporters": [
    { 
      "x": 19, 
      "y": 10, 
      "targetZone": "forest", 
      "targetX": 1, 
      "targetY": 10 
    }
  ]
}
```

### Interaction Data
```json
{
  "id": "talk",
  "requiredTags": ["character"],
  "directions": ["north", "east", "south", "west"],
  "eventType": "dialog",
  "keyBinding": "E"
}
```

## Phaser Integration

Phaser 3 will be used as the core game engine with custom systems built on top:

- Phaser's Scene system for game state management
- Phaser's Game loop for consistent updates
- Custom grid system within Phaser's coordinate space
- Custom rendering using Phaser's Graphics objects
- Phaser's Input system with custom handling
- Phaser's Camera system for following the player

## Future Considerations

- Potential for adding sprite-based graphics later
- Advanced pathfinding for NPCs
- Inventory system
- Quest system
- Save/load functionality