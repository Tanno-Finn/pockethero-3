/**
 * Dialog System
 * Handles dialog display and interaction
 */
class Dialog {
    /**
     * Create a new dialog system
     *
     * @param {Object} scene - The scene this dialog belongs to
     */
    constructor(scene) {
        this.scene = scene;
        this.active = false;
        this.content = '';
        this.speaker = '';
        this.textSpeed = CONFIG.game.dialog.textSpeed;
        this.defaultDuration = CONFIG.game.dialog.defaultDuration;
        this.showingText = '';
        this.letterIndex = 0;
        this.textTimer = null;
        this.closeTimer = null;

        // Create dialog box
        this.createDialogBox();
    }

    /**
     * Create the dialog box UI
     */
    createDialogBox() {
        // Dialog elements will be created in the UI scene
        // This method would set up any initial properties
    }

    /**
     * Show a dialog
     *
     * @param {Object} options - Dialog options
     * @param {string} options.content - Text content
     * @param {string} [options.speaker] - Speaker name
     * @param {number} [options.duration] - Duration to show dialog (ms)
     * @param {boolean} [options.waitForInput] - Whether to wait for input to close
     * @param {Function} [options.onComplete] - Callback when dialog completes
     */
    show(options) {
        // If already showing, finish current dialog
        if (this.active) {
            this.complete();
        }

        // Extract options
        this.content = options.content || '';
        this.speaker = options.speaker || '';
        this.duration = options.duration || this.defaultDuration;
        this.waitForInput = options.waitForInput !== undefined ? options.waitForInput : true;
        this.onComplete = options.onComplete || null;

        // Reset state
        this.active = true;
        this.showingText = '';
        this.letterIndex = 0;

        // Clear any existing timers
        if (this.textTimer) clearInterval(this.textTimer);
        if (this.closeTimer) clearTimeout(this.closeTimer);

        // Emit event
        this.scene.events.emit(CONSTANTS.EVENTS.DIALOG_START, {
            content: this.content,
            speaker: this.speaker
        });

        // Start text animation
        this.animateText();
    }

    /**
     * Animate the text appearing
     */
    animateText() {
        // Set up timer to add letters one by one
        this.textTimer = setInterval(() => {
            if (this.letterIndex < this.content.length) {
                this.showingText += this.content[this.letterIndex];
                this.letterIndex++;

                // Update the UI
                this.updateDialogText();
            } else {
                // Text animation complete
                clearInterval(this.textTimer);
                this.textTimer = null;

                // If not waiting for input, set timer to close
                if (!this.waitForInput) {
                    this.closeTimer = setTimeout(() => {
                        this.complete();
                    }, this.duration);
                }
            }
        }, 1000 / this.textSpeed);
    }

    /**
     * Update the dialog text display
     */
    updateDialogText() {
        // UI update will be handled in the UI scene
        // This will dispatch an event for the UI scene to handle
        this.scene.events.emit('dialog-update', {
            content: this.showingText,
            speaker: this.speaker,
            isComplete: this.letterIndex >= this.content.length
        });
    }

    /**
     * Skip text animation and show full text immediately
     */
    skipAnimation() {
        if (!this.active) return;

        // Clear animation timer
        if (this.textTimer) {
            clearInterval(this.textTimer);
            this.textTimer = null;
        }

        // Show full text
        this.showingText = this.content;
        this.letterIndex = this.content.length;
        this.updateDialogText();

        // If not waiting for input, set timer to close
        if (!this.waitForInput) {
            if (this.closeTimer) clearTimeout(this.closeTimer);
            this.closeTimer = setTimeout(() => {
                this.complete();
            }, this.duration);
        }
    }

    /**
     * Handle user input to advance dialog
     */
    handleInput() {
        if (!this.active) return;

        // If text is still animating, skip animation
        if (this.letterIndex < this.content.length) {
            this.skipAnimation();
        } else {
            // Otherwise complete the dialog
            this.complete();
        }
    }

    /**
     * Complete the dialog and close
     */
    complete() {
        if (!this.active) return;

        // Clear timers
        if (this.textTimer) clearInterval(this.textTimer);
        if (this.closeTimer) clearTimeout(this.closeTimer);

        this.active = false;

        // Emit event
        this.scene.events.emit(CONSTANTS.EVENTS.DIALOG_END, {
            content: this.content,
            speaker: this.speaker
        });

        // Call onComplete callback if provided
        if (this.onComplete && typeof this.onComplete === 'function') {
            this.onComplete();
        }
    }

    /**
     * Check if dialog is currently active
     *
     * @returns {boolean} Whether dialog is active
     */
    isActive() {
        return this.active;
    }
}