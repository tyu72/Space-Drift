export default class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }
  
    preload() {
        this.load.image('menuBackground', 'assets/spacebackground.png');
    }
  
    create() {
      this.add.image(400, 500, 'menuBackground');  
  
        const title = this.add.text(400, 150, 'Space Drift', {
            fontSize: '64px',
            fill: '#8db600'
        }).setOrigin(0.5);
  
        const instructions = this.add.text(400, 300, 'Press SPACE to Start\nUse Arrow Keys to Move\nCollect Fuel for Immunity!', {
            fontSize: '24px',
            fill: '#8db600',
            align: 'center'
        }).setOrigin(0.5);
  
        const creditsText = this.add.text(400, 400, 'Press C for Credits', {
            fontSize: '24px',
            fill: '#8db600'
        }).setOrigin(0.5);
  
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Play');
        });
  
        this.input.keyboard.once('keydown-C', () => {
            this.scene.start('Credits');
        });
    }
  }
  