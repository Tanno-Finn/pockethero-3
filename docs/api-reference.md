# API Reference

This document provides a reference for the core modules, classes, and functions in Grid World.

## Core Components

### Game

**Game.js** - Main entry point for the game

Methods:
- `isEmptyObject(obj)` - Checks if an object is empty
- `generateUUID()` - Generates a unique identifier
- `deepClone(obj)` - Creates a deep copy of an object
- `getNestedProperty(obj, path, defaultValue)` - Safely accesses nested object properties
- `isMobileDevice()` - Detects if running on a mobile device
- `formatNumber(num)` - Formats a number with commas for thousands
- `getUrlParameter(name)` - Gets a URL parameter by name
- `loadScript(url)` - Dynamically loads a script

### Constants

**Constants.js** - Game-wide constants

Properties:
- `GAME_WIDTH`, `GAME_HEIGHT`, `TILE_SIZE` - Game dimensions
- `GAME_STATES` - Game state constants
- `SCENES` - Scene key constants
- `ENTITY_TYPES` - Entity type constants
- `TILE_TYPES` - Tile type constants
- `DIRECTIONS` - Direction constants
- `KEYS` - Input key constants
- `TAGS` - Tag constants
- `EVENTS` - Event type constants
- `SHAPES` - Shape constants
- `DATA_PATHS` - Data file path constants

### Config

**Config.js** - Game configuration

Properties:
- `phaser` - Phaser engine configuration
- `game` - Game-specific configuration

## World System

### Grid

**Grid.js** - Manages the tile-based grid

Methods:
- `constructor(scene, config)` - Creates a new grid
- `reset()` - Resets the grid to default state
- `loadFromData(data)` - Loads grid from data object
- `isInBounds(x, y)` - Checks if coordinates are within grid bounds
- `getTileAt(x, y)` - Gets the tile at specific coordinates
- `setTileAt(x, y, tile)` - Sets a tile at specific coordinates
- `getNeighbors(x, y)` - Gets neighboring tiles around coordinates
- `getTilesByType(tileType)` - Gets all tiles of a specific type
- `getTilesByProperty(propertyName, propertyValue)` - Finds tiles by property value
- `getTilesByTag(tag)` - Finds all tiles with a specific tag
- `worldToGrid(worldX, worldY)` - Converts world coordinates to grid coordinates
- `gridToWorld(gridX, gridY)` - Converts grid coordinates to world coordinates

### Tile

**Tile.js** - Represents a single tile in the grid

Methods:
- `constructor(config)` - Creates a new tile
- `setDefaultPropertiesByType()` - Sets default properties based on tile type
- `hasTag(tag)` - Checks if tile has a specific tag
- `addTag(tag)` - Adds a tag to the tile
- `removeTag(tag)` - Removes a tag from the tile
- `getProperty(key, defaultValue)` - Gets a property value
- `setProperty(key, value)` - Sets a property value
- `serialize()` - Generates a serializable representation of the tile

### Zone

**Zone.js** - Represents a discrete area in the game

Methods:
- `constructor(scene, config)` - Creates a new zone
- `loadEntities(entitiesData)` - Loads entities from configuration data
- `addEntity(entity)` - Adds an entity to the zone
- `removeEntity(entityOrId)` - Removes an entity from the zone
- `getEntityById(id)` - Gets an entity by ID
- `getEntitiesAt(x, y)` - Gets all entities at a specific position
- `getEntityAt(x, y)` - Gets the first entity at a specific position
- `getEntitiesByType(type)` - Gets all entities of a specific type
- `getEntitiesByTag(tag)` - Gets all entities with a specific tag
- `update(time, delta)` - Updates all entities in the zone
- `getTeleporters()` - Finds all teleporters in the zone
- `isInZone(x, y)` - Checks if a position is within zone boundaries
- `serialize()` - Generates a serializable representation of the zone

### Teleporter

**Teleporter.js** - Handles teleportation between zones

Methods:
- `constructor(config)` - Creates a new teleporter
- `placeInGrid(grid)` - Sets the teleporter in a grid
- `createLinkedTeleporter(sourceGrid, targetGrid)` - Creates a linked bidirectional teleporter
- `activate()` - Activates the teleporter
- `deactivate()` - Deactivates the teleporter
- `isAt(x, y)` - Checks if a position is on this teleporter
- `serialize()` - Generates a serializable representation of the teleporter

## Entity System

### Entity

**Entity.js** - Base class for all game entities

Methods:
- `constructor(scene, config)` - Creates a new entity
- `init()` - Initializes the entity
- `update(time, delta)` - Updates the entity
- `moveTo(x, y)` - Moves the entity to a new position
- `canMoveTo(x, y)` - Checks if the entity can move to a position
- `canPassTile(tile)` - Checks if the entity can pass a specific tile
- `setDirection(direction)` - Sets the direction of the entity
- `moveInDirection(direction)` - Moves in a direction
- `canInteractFrom(direction)` - Checks if the entity can be interacted with from a direction
- `onInteract(interactor)` - Handles interaction with this entity
- `hasTag(tag)` - Checks if this entity has a specific tag
- `addTag(tag)` - Adds a tag to this entity
- `removeTag(tag)` - Removes a tag from this entity
- `getScreenPosition()` - Gets the screen position of this entity
- `serialize()` - Generates a serializable representation of this entity

### Player

**Player.js** - Represents the player character

Methods:
- `constructor(scene, config)` - Creates a new player entity
- `init()` - Initializes the player
- `update(time, delta)` - Updates the player
- `handleInput(input)` - Handles player input
- `move(direction)` - Moves the player in a direction
- `checkTeleporter()` - Checks if the player is on a teleporter
- `interact()` - Interacts with entities in front of the player
- `getOppositeDirection(direction)` - Gets the opposite direction
- `addToInventory(item)` - Adds an item to the player's inventory
- `serialize()` - Serializes player for saving

### NPC

**NPC.js** - Represents a non-player character

Methods:
- `constructor(scene, config)` - Creates a new NPC entity
- `update(time, delta)` - Updates the NPC
- `startPatrol()` - Starts patrol movement pattern
- `moveInPattern()` - Moves according to the patrol pattern
- `startRandomMovement()` - Starts random movement
- `moveRandomly()` - Moves in a random direction
- `onInteract(interactor)` - Handles interaction with this NPC
- `stopMovement()` - Stops all movement
- `serialize()` - Serializes NPC for saving

### Item

**Item.js** - Represents an item in the game

Methods:
- `constructor(scene, config)` - Creates a new item entity
- `onInteract(interactor)` - Handles interaction with this item
- `onPickup(interactor)` - Handles pickup interaction
- `onUse(user)` - Handles use interaction
- `decreaseQuantity(amount)` - Decreases item quantity after use
- `increaseQuantity(amount)` - Increases item quantity
- `canStackWith(otherItem)` - Checks if item can stack with another item
- `stackWith(otherItem)` - Stacks with another item
- `serialize()` - Serializes item for saving

## Interaction System

### Dialog

**Dialog.js** - Handles dialog display and interaction

Methods:
- `constructor(scene)` - Creates a new dialog system
- `createDialogBox()` - Creates the dialog box UI
- `show(options)` - Shows a dialog
- `animateText()` - Animates the text appearing
- `updateDialogText()` - Updates the dialog text display
- `skipAnimation()` - Skips text animation
- `handleInput()` - Handles user input to advance dialog
- `complete()` - Completes the dialog and closes
- `isActive()` - Checks if dialog is currently active

### EventSystem

**EventSystem.js** - Handles event dispatching and listening

Methods:
- `constructor()` - Creates a new event system
- `subscribe(eventType, callback)` - Subscribes to an event
- `unsubscribe(eventType, callback)` - Unsubscribes from an event
- `emit(eventType, data)` - Emits an event
- `logEvent(eventType, data)` - Logs an event for debugging
- `getLogs()` - Gets the event log
- `clearLogs()` - Clears the event log
- `hasListeners(eventType)` - Checks if an event type has any listeners
- `listenerCount(eventType)` - Gets the number of listeners for an event type

## Rendering System

### Renderer

**Renderer.js** - Handles rendering of the game world

Methods:
- `constructor(scene)` - Creates a new renderer
- `init()` - Initializes the renderer
- `clear()` - Clears all rendered content
- `render(grid, entities, camera)` - Renders the game world
- `getVisibleArea(camera)` - Gets the visible area based on camera position
- `renderGrid(grid, visibleArea)` - Renders the grid
- `renderTile(tile, x, y)` - Renders a single tile
- `renderEntities(entities, visibleArea)` - Renders entities
- `renderEntity(entity)` - Renders a single entity
- `drawDirectionIndicator(entity, screenX, screenY)` - Draws direction indicator
- `drawEntityDetails(entity, screenX, screenY)` - Draws entity-specific details
- `drawInteractableIndicator(screenX, screenY)` - Draws an interactable indicator
- `drawSparkle(screenX, screenY)` - Draws a sparkle effect for items
- `renderDebug(grid, entities, visibleArea)` - Renders debug information
- `renderGridLines(visibleArea)` - Renders grid lines
- `renderEntityInfo(entities, visibleArea)` - Renders entity info
- `toggleGrid()` - Toggles debug grid display
- `toggleEntityInfo()` - Toggles entity info display

### ShapeFactory

**ShapeFactory.js** - Utility for creating and drawing shapes

Methods:
- `constructor(scene)` - Creates a new shape factory
- `drawRectangle(graphics, x, y, width, height, color, alpha, stroke, strokeColor, strokeWidth)` - Draws a rectangle
- `drawCircle(graphics, x, y, radius, color, alpha, stroke, strokeColor, strokeWidth)` - Draws a circle
- `drawTriangle(graphics, x1, y1, x2, y2, x3, y3, color, alpha, stroke, strokeColor, strokeWidth)` - Draws a triangle
- `drawLine(graphics, x1, y1, x2, y2, color, width, alpha)` - Draws a line
- `drawRoundedRect(graphics, x, y, width, height, radius, color, alpha, stroke, strokeColor, strokeWidth)` - Draws a rounded rectangle
- `drawStar(graphics, x, y, points, innerRadius, outerRadius, color, alpha, stroke, strokeColor, strokeWidth)` - Draws a star
- `drawText(x, y, text, style)` - Draws text

### Camera

**Camera.js** - Manages the viewport and follows the player

Methods:
- `constructor(scene)` - Creates a new camera
- `update(delta)` - Updates camera position
- `setBounds(x, y, width, height)` - Sets camera bounds
- `setBoundsToGrid(grid)` - Sets bounds based on grid dimensions
- `follow(entity)` - Follows an entity
- `stopFollowing()` - Stops following any entity
- `setFollowPlayer(enable)` - Enables or disables player following
- `centerOn(x, y)` - Centers camera on a position
- `move(dx, dy)` - Moves the camera by an offset
- `followEntity(delta)` - Handles following an entity
- `clampToBounds()` - Keeps camera within bounds
- `worldToScreen(worldX, worldY)` - Converts world coordinates to screen coordinates
- `screenToWorld(screenX, screenY)` - Converts screen coordinates to world coordinates
- `isVisible(worldX, worldY, margin)` - Checks if a world position is visible on screen
- `getVisibleArea()` - Gets the visible area in world coordinates
- `getVisibleGridArea()` - Converts the visible area to grid coordinates

## Input System

### InputManager

**InputManager.js** - Handles user input

Methods:
- `constructor(scene)` - Creates a new input manager
- `init()` - Initializes the input manager
- `setupKeys()` - Sets up input key handling
- `handleKeyDown(event)` - Handles key down event
- `handleKeyUp(event)` - Handles key up event
- `getKeyConstant(keyCode)` - Converts a key code to our key constant
- `isKeyDown(key)` - Checks if a key is currently down
- `wasKeyJustPressed(key)` - Checks if a key was just pressed this frame
- `wasKeyJustReleased(key)` - Checks if a key was just released this frame
- `onKey(key, callback)` - Registers a callback for a key event
- `offKey(key, callback)` - Unregisters a callback for a key event
- `update()` - Updates the input manager

## Data Management

### DataLoader

**DataLoader.js** - Handles loading and caching JSON data files

Methods:
- `constructor(scene)` - Creates a new data loader
- `preload(files)` - Preloads data files
- `load(path)` - Loads a data file
- `getCache(path)` - Gets data from the cache
- `isCached(path)` - Checks if a file is loaded and cached
- `clearCache(path)` - Clears the data cache
- `registerValidator(dataType, validator)` - Registers a validator for a data type
- `validate(data, dataType)` - Validates data against a registered validator

### DataManager

**DataManager.js** - Manages access to game data

Methods:
- `constructor(scene)` - Creates a new data manager
- `registerValidators()` - Registers data validators
- `loadAll()` - Loads all game data
- `loadTiles()` - Loads all tile definitions
- `loadEntities()` - Loads all entity definitions
- `loadZones()` - Loads all zone definitions
- `loadInteractions()` - Loads all interaction definitions
- `loadDataFiles(basePath, dataType, targetCache)` - Helper method to load data files
- `getTile(id)` - Gets a tile definition by ID
- `getEntity(id)` - Gets an entity definition by ID
- `getZone(id)` - Gets a zone definition by ID
- `getInteraction(id)` - Gets an interaction definition by ID
- `getAllTiles()` - Gets all tiles
- `getAllEntities()` - Gets all entities
- `getAllZones()` - Gets all zones
- `getAllInteractions()` - Gets all interactions
- `createZone(zoneId, scene)` - Creates a new instance of a zone from definition
- `createEntity(entityId, scene, overrideProps)` - Creates a new instance of an entity from definition

### Validator

**Validator.js** - Validates data structures against schemas

Methods:
- `clearErrors()` - Clears validation errors
- `getErrors()` - Gets validation errors
- `addError(message)` - Adds a validation error
- `validateTile(tile)` - Validates a tile definition
- `validateEntity(entity)` - Validates an entity definition
- `validateZone(zone)` - Validates a zone definition
- `validateInteraction(interaction)` - Validates an interaction definition
- `validate(data, schemaType)` - Generic validator for any data type

## Utility Functions

### Helpers

**Helpers.js** - General purpose utility functions

Methods:
- `generateId()` - Generates a unique ID
- `deepClone(obj)` - Deep clones an object
- `hasTag(entity, tag)` - Checks if an entity has a specific tag
- `hasAllTags(entity, requiredTags)` - Checks if all required tags are present
- `gridToScreen(gridX, gridY)` - Converts grid coordinates to screen coordinates
- `screenToGrid(screenX, screenY)` - Converts screen coordinates to grid coordinates
- `getDirection(fromPos, toPos)` - Gets grid direction from two positions
- `getPositionInFront(entity)` - Gets the position in front of an entity
- `debounce(func, wait)` - Debounces a function

### MathUtils

**MathUtils.js** - Math-related utility functions

Methods:
- `randomInt(min, max)` - Generates a random integer
- `randomFloat(min, max)` - Generates a random float
- `clamp(value, min, max)` - Clamps a value between min and max
- `manhattanDistance(x1, y1, x2, y2)` - Calculates Manhattan distance
- `distance(x1, y1, x2, y2)` - Calculates Euclidean distance
- `lerp(a, b, t)` - Linear interpolation between two values
- `pointInRect(px, py, rx, ry, rw, rh)` - Checks if a point is inside a rectangle
- `rectOverlap(x1, y1, w1, h1, x2, y2, w2, h2)` - Checks if two rectangles overlap

## Scenes

### BootScene

**BootScene.js** - Initial scene that loads basic assets

Methods:
- `constructor()` - Creates the boot scene
- `preload()` - Preloads assets needed for the boot scene
- `createLoadingUI()` - Creates the loading UI
- `updateProgress(value)` - Updates the progress bar
- `loadComplete()` - Handles load completion
- `create()` - Creates the boot scene
- `setupDataStructures()` - Sets up data structures
- `loadGameData()` - Loads all game data
- `startGame()` - Starts the game

### GameScene

**GameScene.js** - Main gameplay scene

Methods:
- `constructor()` - Creates the game scene
- `init(data)` - Initializes scene data
- `preload()` - Preloads game assets
- `create()` - Creates the game scene
- `setupEventListeners()` - Sets up event listeners
- `loadZone(zoneId)` - Loads a zone
- `createPlayer()` - Creates the player character
- `setPlayer(player)` - Sets the player reference
- `changeZone(zoneId, targetX, targetY)` - Changes to a different zone
- `getEntityAt(x, y)` - Gets an entity at a specific position
- `getEntitiesAt(x, y)` - Gets all entities at a specific position
- `getEntityById(id)` - Gets an entity by ID
- `addEntity(entity)` - Adds an entity to the scene
- `removeEntity(entityOrId)` - Removes an entity from the scene
- `showDialog(options)` - Shows a dialog
- `update(time, delta)` - Updates game state
- `updatePlaying(time, delta)` - Updates playing state
- `updateDialog(time, delta)` - Updates dialog state
- `updateRenderer(time, delta)` - Updates renderer

### UIScene

**UIScene.js** - Handles user interface elements

Methods:
- `constructor()` - Creates the UI scene
- `preload()` - Preloads assets needed for the UI
- `create()` - Creates UI elements
- `createDialogUI()` - Creates dialog UI elements
- `drawDialogBox()` - Draws the dialog box background
- `setupEventListeners()` - Sets up event listeners
- `handleResize(gameSize)` - Handles window resize
- `showDialog(data)` - Shows dialog with message
- `updateDialog(data)` - Updates dialog text
- `hideDialog()` - Hides dialog box
- `update(time, delta)` - Updates UI elements

## Data Schemas

### Tile Data

```json
{
  "id": "grass",
  "displayName": "Grass",
  "type": "grass",
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
  "id": "villager",
  "displayName": "Villager",
  "type": "npc",
  "color": "#FF0000",
  "shape": "circle",
  "size": 0.8,
  "interactable": true,
  "tags": ["character", "npc", "villager"],
  "dialog": "Hello there! Welcome to our village.",
  "properties": {
    "movementSpeed": 1
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
    { "x": 5, "y": 7, "type": "water" }
  ],
  "entities": [
    { "x": 10, "y": 4, "type": "npc", "id": "villager" }
  ]
}
```

### Interaction Data

```json
{
  "id": "talk",
  "displayName": "Talk",
  "requiredTags": ["character"],
  "directions": ["north", "east", "south", "west"],
  "eventType": "dialog",
  "keyBinding": "E"
}
```