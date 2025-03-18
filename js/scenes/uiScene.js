/**
 * UI Scene
 * Handles user interface elements that overlay the game
 */
class UIScene extends Phaser.Scene {
    /**
     * Create the UI scene
     */
    constructor() {
        super({
            key: CONSTANTS.SCENES.UI
        });

        // UI state
        this.dialogActive = false;
        this.dialogBox = null;
        this.dialogText = null;
        this.dialogSpeakerText = null;
        this.dialogPrompt = null;
    }

    /**
     * Preload assets needed for the UI
     */
    preload() {
        // No assets needed for the simple UI
    }

    /**
     * Create UI elements
     */
    create() {
        // Get a reference to the game scene
        this.gameScene = this.scene.get(CONSTANTS.SCENES.GAME);

        // Create dialog UI
        this.createDialogUI();

        // Set up event listeners
        this.setupEventListeners();
    }

    /**
     * Create dialog UI elements
     */
    createDialogUI() {
        // Create dialog box
        this.dialogBox = this.add.graphics();
        this.drawDialogBox();

        // Create speaker text
        this.dialogSpeakerText = this.add.text(
            20,
            this.cameras.main.height - 100,
            '',
            {
                font: 'bold 16px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        );

        // Create dialog text
        this.dialogText = this.add.text(
            20,
            this.cameras.main.height - 80,
            '',
            {
                font: '16px Arial',
                fill: '#ffffff',
                wordWrap: { width: this.cameras.main.width - 40 }
            }
        );

        // Create continue prompt
        this.dialogPrompt = this.add.text(
            this.cameras.main.width - 30,
            this.cameras.main.height - 30,
            '►',
            {
                font: 'bold 24px Arial',
                fill: '#ffffff'
            }
        ).setOrigin(1, 1);

        // Hide dialog elements initially
        this.hideDialog();
    }

    /**
     * Draw the dialog box background
     */
    drawDialogBox() {
        this.dialogBox.clear();

        // Draw semi-transparent dialog background
        this.dialogBox.fillStyle(0x000000, 0.7);
        this.dialogBox.fillRect(
            10,
            this.cameras.main.height - 110,
            this.cameras.main.width - 20,
            100
        );

        // Draw border
        this.dialogBox.lineStyle(2, 0xffffff, 0.8);
        this.dialogBox.strokeRect(
            10,
            this.cameras.main.height - 110,
            this.cameras.main.width - 20,
            100
        );
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for dialog events from the game scene
        this.gameScene.events.on(CONSTANTS.EVENTS.DIALOG_START, this.showDialog, this);
        this.gameScene.events.on(CONSTANTS.EVENTS.DIALOG_END, this.hideDialog, this);
        this.gameScene.events.on('dialog-update', this.updateDialog, this);

        // Resize event to update UI positions
        this.scale.on('resize', this.handleResize, this);
    }

    /**
     * Handle window resize
     *
     * @param {number} gameSize - New game size
     */
    handleResize(gameSize) {
        // Reposition dialog elements
        if (this.dialogBox) {
            this.drawDialogBox();
        }

        if (this.dialogPrompt) {
            this.dialogPrompt.setPosition(
                this.cameras.main.width - 30,
                this.cameras.main.height - 30
            );
        }
    }

    /**
     * Show dialog with message
     *
     * @param {Object} data - Dialog data
     */
    showDialog(data) {
        // Set dialog active
        this.dialogActive = true;

        // Show dialog elements
        this.dialogBox.setVisible(true);
        this.dialogText.setVisible(true);

        // Set speaker text if provided
        if (data.speaker && data.speaker.trim() !== '') {
            this.dialogSpeakerText.setText(data.speaker);
            this.dialogSpeakerText.setVisible(true);
        } else {
            this.dialogSpeakerText.setVisible(false);
        }

        // Initially hide prompt (will show when text is complete)
        this.dialogPrompt.setVisible(false);
    }

    /**
     * Update dialog text
     *
     * @param {Object} data - Dialog update data
     */
    updateDialog(data) {
        // Update text
        this.dialogText.setText(data.content);

        // Show prompt if text is complete
        if (data.isComplete) {
            this.dialogPrompt.setVisible(true);

            // Add a pulsing animation to the prompt
            if (!this.promptTween) {
                this.promptTween = this.tweens.add({
                    targets: this.dialogPrompt,
                    alpha: { from: 1, to: 0.5 },
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
            } else {
                this.promptTween.restart();
            }
        } else {
            this.dialogPrompt.setVisible(false);

            // Stop prompt animation
            if (this.promptTween) {
                this.promptTween.stop();
            }
        }
    }

    /**
     * Hide dialog box
     */
    hideDialog() {
        // Set dialog inactive
        this.dialogActive = false;

        // Hide dialog elements
        this.dialogBox.setVisible(false);
        this.dialogSpeakerText.setVisible(false);
        this.dialogText.setVisible(false);
        this.dialogPrompt.setVisible(false);

        // Stop prompt animation
        if (this.promptTween) {
            this.promptTween.stop();
        }
    }

    /**
     * Update UI elements
     *
     * @param {number} time - Current time
     * @param {number} delta - Time since last update
     */
    update(time, delta) {
        // Update UI animations or elements here
    }
}