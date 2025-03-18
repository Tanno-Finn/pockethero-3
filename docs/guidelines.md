# Coding Guidelines

## General Principles

### Code Organization
- All code must be modular and well-encapsulated
- Follow the established directory structure
- Place related functionality in appropriate modules
- Each file should have a single responsibility

### Naming Conventions
- Use camelCase for variable and function names (e.g., `playerPosition`, `calculateDistance`)
- Use PascalCase for class names (e.g., `Player`, `GameScene`)
- Use UPPER_SNAKE_CASE for constants (e.g., `MAX_PLAYERS`, `DEFAULT_SPEED`)
- Use descriptive names that clearly indicate purpose

### Documentation
- All files must have a file-level JSDoc comment explaining its purpose
- All classes, methods, and functions must have JSDoc comments
- Document parameters, return values, and thrown exceptions
- Include examples for complex functions
- Keep documentation up-to-date when code changes

## JavaScript Style Guide

### Formatting
- Use 4 spaces for indentation
- Use single quotes for strings (`'example'` not `"example"`)
- Always use semicolons to terminate statements
- Maximum line length of 100 characters
- Leave one empty line between logical sections of code
- No trailing whitespace
- Files should end with a newline

### Best Practices
- Declare variables with `const` when possible, `let` when necessary
- Avoid global variables
- Use strict equality (`===` and `!==`) instead of loose equality
- Use arrow functions for callbacks when appropriate
- Keep functions small and focused
- Avoid deeply nested code (maximum 3 levels)
- Prefer early returns to reduce nesting

### Error Handling
- Use try/catch blocks for error-prone code
- Provide meaningful error messages
- Log errors to the console with appropriate context
- Fail gracefully when errors occur

## Phaser-Specific Guidelines

### Scene Management
- Implement the standard Phaser lifecycle methods (`init`, `preload`, `create`, `update`)
- Keep update functions lightweight
- Use scene transitions appropriately
- Use scene data to pass information between scenes

### Asset Management
- Preload all assets in the appropriate scenes
- Use asset keys that clearly indicate content
- Group related assets logically

### Input Handling
- Separate input handling from game logic
- Consider mobile users when designing input systems
- Provide feedback for user interactions

## Game-Specific Guidelines

### Entity System
- Entities should inherit from the base Entity class
- Entity properties should be consistent across similar entity types
- Entity behavior should be defined through composition when possible

### Data-Driven Design
- Game content should be defined in JSON, not hardcoded
- Data files should be validated before use
- Data schemas should be documented
- Keep data and code separate

### Grid System
- All positioning should use grid coordinates
- Movement should respect grid boundaries
- Entity interactions should be grid-aware

### Event System
- Use events for loose coupling between systems
- Document event types and their data structure
- Ensure events are properly cleaned up when no longer needed

## Testing

### Unit Tests
- Each core system should have unit tests
- Tests should be in the `/tests` directory
- Test edge cases and normal cases
- Use descriptive test names

### Manual Testing
- Test each feature on multiple browsers
- Verify interactions between systems
- Check performance on lower-end devices
- Test with various window sizes

## Performance Considerations

### Rendering
- Minimize draw calls
- Only render what's visible
- Use object pooling for frequently created/destroyed objects
- Batch similar operations

### Memory Management
- Clean up event listeners when not needed
- Dispose of objects properly to prevent memory leaks
- Be mindful of closure scope and potential memory retention

## Version Control

### Commit Messages
- Use clear, descriptive commit messages
- Begin with a verb in the imperative form
- Reference issue numbers when applicable
- Keep commits focused on a single change

### Branching
- Use feature branches for new features
- Use fix branches for bug fixes
- Branch names should be descriptive of their purpose
- Keep branches up-to-date with the main branch

## Documentation Updates

### Required Documentation
- Update README.md with new features
- Update CHANGELOG.md with version changes
- Keep API_REFERENCE.md current
- Update DESIGN.md when architectural decisions change
- Keep TODO.md up-to-date with completed tasks and new tasks