//Tony Yu
//Space Drift
// ~35 hours
// I added a nitro mechanic where picking up fuel makes the spaceship immune to asteroids for a short amount of time. I had to figure out how to stack the nitro effect if the player collects more fuel while already in nitro mode. I had a problem where the effect would cancel if I was in nitro mode and picked up more fuel. I also made the game harder over time by increasing the speed and number of falling asteroids every 15 seconds, and I added sound effects for things like fuel pickups, collisions, and nitro turning off. I had a lot of fun looking for sound effects that I thought would fit my game. 
//The theme music and art style is just everything I enjoy put together. The looping background during the game is a refrence to Star Wars when the ships go into hyperspace. The background music is also from one of my favorite games of all time (CSGO). Im extremely proud of the sprites and background images because I drew them myself and I put alot of effort into it.
import Menu from './scenes/menu.js';
import Play from './scenes/play.js';
import GameOver from './scenes/gameover.js';
import Credits from './scenes/credits.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [Menu, Play, GameOver, Credits]  
};

const game = new Phaser.Game(config);
