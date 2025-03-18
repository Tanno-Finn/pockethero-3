/**
 * Shape Factory
 * Utility for creating and drawing common shapes
 */
class ShapeFactory {
    /**
     * Create a new shape factory
     *
     * @param {Object} scene - The scene this factory belongs to
     */
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Draw a rectangle
     *
     * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {string|number} color - Fill color (hex string or number)
     * @param {number} [alpha=1] - Alpha transparency (0-1)
     * @param {boolean} [stroke=false] - Whether to stroke the rectangle
     * @param {string|number} [strokeColor=0x000000] - Stroke color
     * @param {number} [strokeWidth=1] - Stroke width
     */
    drawRectangle(graphics, x, y, width, height, color, alpha = 1, stroke = false, strokeColor = 0x000000, strokeWidth = 1) {
        // Convert string color to number if needed
        const fillColor = typeof color === 'string'
            ? Phaser.Display.Color.HexStringToColor(color).color
            : color;

        // Set fill style
        graphics.fillStyle(fillColor, alpha);

        // Draw rectangle
        graphics.fillRect(x, y, width, height);

        // Add stroke if requested
        if (stroke) {
            const lineColor = typeof strokeColor === 'string'
                ? Phaser.Display.Color.HexStringToColor(strokeColor).color
                : strokeColor;

            graphics.lineStyle(strokeWidth, lineColor, alpha);
            graphics.strokeRect(x, y, width, height);
        }
    }

    /**
     * Draw a circle
     *
     * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
     * @param {number} x - Center X position
     * @param {number} y - Center Y position
     * @param {number} radius - Circle radius
     * @param {string|number} color - Fill color (hex string or number)
     * @param {number} [alpha=1] - Alpha transparency (0-1)
     * @param {boolean} [stroke=false] - Whether to stroke the circle
     * @param {string|number} [strokeColor=0x000000] - Stroke color
     * @param {number} [strokeWidth=1] - Stroke width
     */
    drawCircle(graphics, x, y, radius, color, alpha = 1, stroke = false, strokeColor = 0x000000, strokeWidth = 1) {
        // Convert string color to number if needed
        const fillColor = typeof color === 'string'
            ? Phaser.Display.Color.HexStringToColor(color).color
            : color;

        // Set fill style
        graphics.fillStyle(fillColor, alpha);

        // Draw circle
        graphics.fillCircle(x, y, radius);

        // Add stroke if requested
        if (stroke) {
            const lineColor = typeof strokeColor === 'string'
                ? Phaser.Display.Color.HexStringToColor(strokeColor).color
                : strokeColor;

            graphics.lineStyle(strokeWidth, lineColor, alpha);
            graphics.strokeCircle(x, y, radius);
        }
    }

    /**
     * Draw a triangle
     *
     * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
     * @param {number} x1 - First point X
     * @param {number} y1 - First point Y
     * @param {number} x2 - Second point X
     * @param {number} y2 - Second point Y
     * @param {number} x3 - Third point X
     * @param {number} y3 - Third point Y
     * @param {string|number} color - Fill color (hex string or number)
     * @param {number} [alpha=1] - Alpha transparency (0-1)
     * @param {boolean} [stroke=false] - Whether to stroke the triangle
     * @param {string|number} [strokeColor=0x000000] - Stroke color
     * @param {number} [strokeWidth=1] - Stroke width
     */
    drawTriangle(graphics, x1, y1, x2, y2, x3, y3, color, alpha = 1, stroke = false, strokeColor = 0x000000, strokeWidth = 1) {
        // Convert string color to number if needed
        const fillColor = typeof color === 'string'
            ? Phaser.Display.Color.HexStringToColor(color).color
            : color;

        // Set fill style
        graphics.fillStyle(fillColor, alpha);

        // Draw triangle
        graphics.fillTriangle(x1, y1, x2, y2, x3, y3);

        // Add stroke if requested
        if (stroke) {
            const lineColor = typeof strokeColor === 'string'
                ? Phaser.Display.Color.HexStringToColor(strokeColor).color
                : strokeColor;

            graphics.lineStyle(strokeWidth, lineColor, alpha);

            // Draw triangle outline
            graphics.beginPath();
            graphics.moveTo(x1, y1);
            graphics.lineTo(x2, y2);
            graphics.lineTo(x3, y3);
            graphics.closePath();
            graphics.strokePath();
        }
    }

    /**
     * Draw a line
     *
     * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
     * @param {number} x1 - Start point X
     * @param {number} y1 - Start point Y
     * @param {number} x2 - End point X
     * @param {number} y2 - End point Y
     * @param {string|number} color - Line color (hex string or number)
     * @param {number} [width=1] - Line width
     * @param {number} [alpha=1] - Alpha transparency (0-1)
     */
    drawLine(graphics, x1, y1, x2, y2, color, width = 1, alpha = 1) {
        // Convert string color to number if needed
        const lineColor = typeof color === 'string'
            ? Phaser.Display.Color.HexStringToColor(color).color
            : color;

        // Set line style
        graphics.lineStyle(width, lineColor, alpha);

        // Draw line
        graphics.beginPath();
        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);
        graphics.strokePath();
    }

    /**
     * Draw a rounded rectangle
     *
     * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {number} radius - Corner radius
     * @param {string|number} color - Fill color (hex string or number)
     * @param {number} [alpha=1] - Alpha transparency (0-1)
     * @param {boolean} [stroke=false] - Whether to stroke the rectangle
     * @param {string|number} [strokeColor=0x000000] - Stroke color
     * @param {number} [strokeWidth=1] - Stroke width
     */
    drawRoundedRect(graphics, x, y, width, height, radius, color, alpha = 1, stroke = false, strokeColor = 0x000000, strokeWidth = 1) {
        // Convert string color to number if needed
        const fillColor = typeof color === 'string'
            ? Phaser.Display.Color.HexStringToColor(color).color
            : color;

        // Set fill style
        graphics.fillStyle(fillColor, alpha);

        // Draw rounded rectangle
        graphics.fillRoundedRect(x, y, width, height, radius);

        // Add stroke if requested
        if (stroke) {
            const lineColor = typeof strokeColor === 'string'
                ? Phaser.Display.Color.HexStringToColor(strokeColor).color
                : strokeColor;

            graphics.lineStyle(strokeWidth, lineColor, alpha);
            graphics.strokeRoundedRect(x, y, width, height, radius);
        }
    }

    /**
     * Draw a star
     *
     * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
     * @param {number} x - Center X position
     * @param {number} y - Center Y position
     * @param {number} points - Number of points
     * @param {number} innerRadius - Inner radius
     * @param {number} outerRadius - Outer radius
     * @param {string|number} color - Fill color (hex string or number)
     * @param {number} [alpha=1] - Alpha transparency (0-1)
     * @param {boolean} [stroke=false] - Whether to stroke the star
     * @param {string|number} [strokeColor=0x000000] - Stroke color
     * @param {number} [strokeWidth=1] - Stroke width
     */
    drawStar(graphics, x, y, points, innerRadius, outerRadius, color, alpha = 1, stroke = false, strokeColor = 0x000000, strokeWidth = 1) {
        // Convert string color to number if needed
        const fillColor = typeof color === 'string'
            ? Phaser.Display.Color.HexStringToColor(color).color
            : color;

        // Set fill style
        graphics.fillStyle(fillColor, alpha);

        // Calculate points
        const vertices = [];

        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / points;

            vertices.push({
                x: x + radius * Math.sin(angle),
                y: y + radius * Math.cos(angle)
            });
        }

        // Draw star
        graphics.beginPath();
        graphics.moveTo(vertices[0].x, vertices[0].y);

        for (let i = 1; i < vertices.length; i++) {
            graphics.lineTo(vertices[i].x, vertices[i].y);
        }

        graphics.closePath();
        graphics.fillPath();

        // Add stroke if requested
        if (stroke) {
            const lineColor = typeof strokeColor === 'string'
                ? Phaser.Display.Color.HexStringToColor(strokeColor).color
                : strokeColor;

            graphics.lineStyle(strokeWidth, lineColor, alpha);

            graphics.beginPath();
            graphics.moveTo(vertices[0].x, vertices[0].y);

            for (let i = 1; i < vertices.length; i++) {
                graphics.lineTo(vertices[i].x, vertices[i].y);
            }

            graphics.closePath();
            graphics.strokePath();
        }
    }

    /**
     * Draw text
     *
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} text - Text content
     * @param {Object} [style={}] - Text style object
     * @returns {Phaser.GameObjects.Text} Text object
     */
    drawText(x, y, text, style = {}) {
        return this.scene.add.text(x, y, text, {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#FFFFFF',
            ...style
        });
    }
}