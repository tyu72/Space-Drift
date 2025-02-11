export default class Play extends Phaser.Scene {
    constructor() {
        super('Play');
        this.survivalTime = 0;
        this.asteroidSpawnRate = 800;  // Faster initial spawn rate (milliseconds)
        this.asteroidsPerSpawn = Phaser.Math.Between(2, 3);  // Randomly spawn 2 to 3 asteroids at the start
    }

    preload() {
        this.load.image('background', 'assets/spacebackground_play.png');
        this.load.spritesheet('ship', 'assets/shipspritesheet.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('shipNitro', 'assets/shipnitrospritesheet.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('asteroid', 'assets/asteroid.png');
        this.load.image('fuel', 'assets/fuel.png');
        this.load.audio('backgroundMusic', 'assets/backgroundmusic.mp3');
        this.load.audio('fuelPickup', 'assets/fuelpickup.mp3');
        this.load.audio('nitroOff', 'assets/nitrooff.mp3');
        this.load.audio('nitroSmash', 'assets/nitrosmash.mp3');
        this.load.audio('shipExplosion', 'assets/shipexplosion.mp3');
    }

    create() {
        // Reset survival time, asteroid spawn rate, and number of asteroids on game start
        this.survivalTime = 0;
        this.asteroidSpawnRate = 800;  // Faster spawn rate at game start
        this.asteroidsPerSpawn = Phaser.Math.Between(2, 3);  // Randomly spawn 2 to 3 asteroids at game start

        // Background
        this.background = this.add.tileSprite(400, 300, 800, 600, 'background');

        // Music
        this.music = this.sound.add('backgroundMusic', { loop: true, volume: 0.3 });
        this.music.play();

        // Sound Effects
        this.fuelPickupSound = this.sound.add('fuelPickup');
        this.nitroOffSound = this.sound.add('nitroOff', { volume: 2.0 });
        this.nitroSmashSound = this.sound.add('nitroSmash');
        this.shipExplosionSound = this.sound.add('shipExplosion');

        // Player setup
        this.player = this.physics.add.sprite(400, 500, 'ship');
        this.player.setCollideWorldBounds(true);

        // Adjust spaceship hitbox
        this.player.setSize(40, 50);
        this.player.setOffset(12, 7);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Asteroids
        this.asteroids = this.physics.add.group();
        this.spawnAsteroidEvent = this.time.addEvent({ delay: this.asteroidSpawnRate, callback: this.spawnAsteroid, callbackScope: this, loop: true });

        // Fuel
        this.fuels = this.physics.add.group();
        this.time.addEvent({ delay: 5000, callback: this.spawnFuel, callbackScope: this, loop: true });

        // Collision
        this.physics.add.overlap(this.player, this.asteroids, this.hitAsteroid, null, this);
        this.physics.add.overlap(this.player, this.fuels, this.collectFuel, null, this);

        // Survival Timer (UI stays fixed)
        this.timerText = this.add.text(16, 50, 'Time: 0', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#000000'  // Add background for better visibility
        });

        // Ensure timer is rendered on top
        this.children.bringToTop(this.timerText);

        // Timer Event
        this.timerEvent = this.time.addEvent({ delay: 1000, callback: this.updateTimer, callbackScope: this, loop: true });

        // Nitro effect flag
        this.isNitro = false;
    }

    update() {
        this.background.tilePositionY -= 2;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.setFrame(2);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.setFrame(0);
        } else {
            this.player.setVelocityX(0);
            this.player.setFrame(1);
        }
    }

    spawnAsteroid() {
        for (let i = 0; i < this.asteroidsPerSpawn; i++) {
            const x = Phaser.Math.Between(50, 750);
            const asteroid = this.asteroids.create(x, 0, 'asteroid');

            // Random asteroid size
            const scale = Phaser.Math.FloatBetween(1.0, 2.0);
            asteroid.setScale(scale);
            asteroid.setVelocityY(Phaser.Math.Between(300, 500));

            // Shrink hitboxes more aggressively
            const shrinkFactor = 0.7;
            const hitboxWidth = 40 * scale * shrinkFactor;
            const hitboxHeight = 30 * scale * shrinkFactor;

            asteroid.setSize(hitboxWidth, hitboxHeight);
            asteroid.setOffset((asteroid.width - hitboxWidth) / 2, (asteroid.height - hitboxHeight) / 2);
        }
    }

    spawnFuel() {
        const x = Phaser.Math.Between(50, 750);
        const fuel = this.fuels.create(x, 0, 'fuel');
        fuel.setVelocityY(200);
    }

    hitAsteroid(player, asteroid) {
        if (this.isNitro) {
            this.nitroSmashSound.play();  // Play nitro smash sound
            asteroid.destroy();
        } else {
            this.shipExplosionSound.play();  // Play ship explosion sound
            this.music.stop();
            this.scene.start('GameOver', { timeSurvived: this.survivalTime });
        }
    }

    collectFuel(player, fuel) {
        fuel.destroy();
        this.fuelPickupSound.play();  // Play fuel pickup sound

        if (this.isNitro) {
            this.nitroTimer.remove(false);  // Cancel previous timer without stopping other game logic
        } else {
            this.isNitro = true;
            this.player.setTexture('shipNitro');
        }

        // Nitro now lasts 3 seconds instead of 5
        this.nitroTimer = this.time.delayedCall(3000, () => {
            this.isNitro = false;
            this.player.setTexture('ship');
            this.nitroOffSound.play();  // Play nitro off sound
        });
    }

    updateTimer() {
        this.survivalTime++;
        if (this.timerText) {
            this.timerText.setText('Time: ' + this.survivalTime);
        }

        if (this.survivalTime % 15 === 0) {
            // Increase asteroid speed continuously
            this.asteroids.children.iterate(asteroid => {
                asteroid.setVelocityY(asteroid.body.velocity.y + 50);
            });

            // Cap the number of asteroids after 40 seconds
            if (this.survivalTime <= 40) {
                this.asteroidsPerSpawn++;
            }

            // Cap spawn rate to prevent overwhelming spawns
            if (this.asteroidSpawnRate > 400) {
                this.asteroidSpawnRate = Math.max(400, this.asteroidSpawnRate - 100);
                this.spawnAsteroidEvent.remove();
                this.spawnAsteroidEvent = this.time.addEvent({ delay: this.asteroidSpawnRate, callback: this.spawnAsteroid, callbackScope: this, loop: true });
            }
        }
    }
}
