export default class GameOver extends Phaser.Scene {
  constructor() {
      super('GameOver');
  }

  init(data) {
      this.timeSurvived = data.timeSurvived;
  }

  preload() {
      this.load.image('menuBackground', 'assets/spacebackground.png');
  }

  create() {
      this.add.image(400, 500, 'menuBackground');

      this.add.text(400, 150, 'Game Over', {
          fontSize: '64px',
          fill: '#8B0000'
      }).setOrigin(0.5);

      this.add.text(400, 300, `You survived: ${this.timeSurvived} seconds`, {
          fontSize: '32px',
          fill: '#8B0000'
      }).setOrigin(0.5);

      this.add.text(400, 495, 'Press SPACE to Restart', {
          fontSize: '24px',
          fill: '#8B0000'
      }).setOrigin(0.5);

      this.input.keyboard.once('keydown-SPACE', () => {
          this.scene.start('Play');
      });
  }
}
