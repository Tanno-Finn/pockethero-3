/**
 * Boot Scene
 * Initial scene that loads basic assets and starts the game
 */
class BootScene extends Phaser.Scene {
    /**
     * Create the boot scene
     */
    constructor() {
        super({
            key: CONSTANTS.SCENES.BOOT
        });
    }

    /**
     * Preload assets needed for the boot scene
     */
    preload() {
        // Create loading text
        this.createLoadingUI();

        // Preload any initial assets here
        // For our simple game, we don't need to preload images
    }

    /**
     * Create the loading UI
     */
    createLoadingUI() {
        // Calculate center position
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Add loading text
        this.loadingText = this.add.text(
            centerX,
            centerY - 20,
            'Loading...',
            {
                font: '24px Arial',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Add progress bar background
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(centerX - 160, centerY, 320, 30);

        // Add loading percentage text
        this.percentText = this.add.text(
            centerX,
            centerY + 15,
            '0%',
            {
                font: '18px Arial',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Add loading event listeners
        this.load.on('progress', this.updateProgress, this);
        this.load.on('complete', this.loadComplete, this);
    }

    /**
     * Update the progress bar
     *
     * @param {number} value - Load progress (0-1)
     */
    updateProgress(value) {
        // Update progress bar
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(
            this.cameras.main.width / 2 - 150,
            this.cameras.main.height / 2 + 5,
            300 * value,
            20
        );

        // Update percentage text
        this.percentText.setText(parseInt(value * 100) + '%');
    }

    /**
     * Handle load completion
     */
    loadComplete() {
        this.loadingText.setText('Load Complete!');

        // Wait a moment then start the game
        this.time.delayedCall(500, this.startGame, [], this);
    }

    /**
     * Create the boot scene
     */
    create() {
        // Create any boot scene content

        // Set up data structures
        this.setupDataStructures();

        // Proceed to loading game data
        this.loadGameData();
    }

    /**
     * Set up data structures
     */
    setupDataStructures() {
        // Create event system and add to registry for global access
        this.game.registry.set('events', new EventSystem());

        // Set up data manager
        this.dataManager = new DataManager(this);
        this.game.registry.set('dataManager', this.dataManager);
    }

    /**
     * Load all game data
     */
    loadGameData() {
        // Update loading text
        this.loadingText.setText('Loading Game Data');

        // Start loading all data
        this.dataManager.loadAll()
            .then(() => {
                console.log('All game data loaded');
                this.startGame();
            })
            .catch(error => {
                console.error('Error loading game data:', error);
                this.loadingText.setText('Error Loading Game Data');
            });
    }

    /**
     * Start the game
     */
    startGame() {
        // Switch to the main game scene
        this.scene.start(CONSTANTS.SCENES.GAME);

        // Also start UI scene in parallel
        this.scene.launch(CONSTANTS.SCENES.UI);
    }
}