# TODO List

This document tracks planned features and improvements for the Grid World project.

## Priority Tasks

### High Priority
- [ ] **Implement inventory system** (Complexity: Medium)
  - Create inventory UI
  - Add inventory management functions
  - Implement item use from inventory

- [ ] **Add saving and loading** (Complexity: High)
  - Design save data structure
  - Create save/load functions
  - Add UI for save/load options

- [ ] **Improve NPC behaviors** (Complexity: Medium)
  - Add more sophisticated movement patterns
  - Implement basic AI for NPCs
  - Add more dialog options and conditionals

### Medium Priority
- [ ] **Implement quest system** (Complexity: High)
  - Design quest data structure
  - Create quest tracking
  - Add quest log UI
  - Implement quest rewards

- [ ] **Enhance interaction system** (Complexity: Medium)
  - Add more interaction types
  - Implement context-sensitive interactions
  - Add interaction feedback and effects

- [ ] **Add container system** (Complexity: Medium)
  - Implement open/close functionality for containers
  - Add item storage and retrieval
  - Create container UI

### Low Priority
- [ ] **Add sound effects and music** (Complexity: Low)
  - Implement audio manager
  - Add sound effects for interactions
  - Add background music for different zones

- [ ] **Enhance visual effects** (Complexity: Medium)
  - Add particle effects
  - Implement day/night cycle
  - Add weather effects

- [ ] **Optimize performance** (Complexity: High)
  - Implement entity pooling
  - Add spatial partitioning for large zones
  - Optimize rendering pipeline

## Completed Tasks

### Session 1 (2025-03-18)
- [x] Set up initial project structure
- [x] Implement grid-based world system
- [x] Create entity system with player, NPCs, and items
- [x] Implement basic movement and collision detection
- [x] Create interaction system with direction-based interactions
- [x] Implement teleporters between zones
- [x] Add dialog system for NPC conversations
- [x] Create simple rendering using basic shapes
- [x] Add camera system that follows the player
- [x] Implement data-driven design with JSON configuration
- [x] Create demo content with 2 zones (village and forest)

## Bug Fixes Needed
- [ ] Fix camera edge behavior when approaching zone boundaries
- [ ] Fix entity overlap when multiple entities are on the same tile
- [ ] Address teleportation edge cases
- [ ] Fix dialog system interaction with other game systems

## Technical Debt
- [ ] Refactor entity class hierarchy for better extensibility
- [ ] Improve data validation for JSON files
- [ ] Add unit tests for core systems
- [ ] Create documentation for entity and tile creation