import { player } from '../entities/player.js';
import { enemy } from '../entities/enemy.js';
import { GameManager } from '../managers/gameManager.js';
import { SoundManager } from '../managers/soundManager.js';

const canvas = document.getElementById('level2');

const soundManager = new SoundManager('../audio/lev1.mp3', '../audio/att.mp3');

let enemies = [
    Object.create(enemy),
    Object.create(enemy),
    Object.create(enemy),
    Object.create(enemy),
    Object.create(enemy),
    Object.create(enemy),
    Object.create(enemy),
    Object.create(enemy)
];

enemies[0].pos_x = 100;
enemies[0].pos_y = 300;

enemies[1].pos_x = 300;
enemies[1].pos_y = 320;

enemies[2].pos_x = 650;
enemies[2].pos_y = 70;

enemies[3].pos_x = 250;
enemies[3].pos_y = 220;

enemies[4].pos_x = 550;
enemies[4].pos_y = 320;

enemies[5].pos_x = 550;
enemies[5].pos_y = 300;

enemies[6].pos_x = 600;
enemies[6].pos_y = 290;

enemies[7].pos_x = 630;
enemies[7].pos_y = 285;


const healthDisplay = document.getElementById("healthDisplay");
healthDisplay.innerText = `Health: ${100}`;
healthDisplay.updateHealthDisplay = function (player) {
    const healthDisplay = document.getElementById("healthDisplay");
    healthDisplay.innerText = `Health: ${player.lifetime}`;
}

const gameManager = new GameManager(canvas, player, enemies, soundManager, healthDisplay, 60, 40, 960, 640);
gameManager.initialize('/my_game/JSON/level2.json');


