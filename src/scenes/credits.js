export default class Credits extends Phaser.Scene {
    constructor() {
        super('Credits');
    }

    create() {
        this.add.text(400, 100, 'Credits', { fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);

        this.add.text(400, 200, 'Art: Tony Yu', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        this.add.text(400, 250, 'Sound Effects: Pixabay', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
        this.add.text(400, 300, 'Background Music: Daniel Sadowski', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);

        this.add.text(400, 400, 'Press SPACE to Return to Menu', { fontSize: '20px', fill: '#ffffff' }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Menu');
        });
    }
}
