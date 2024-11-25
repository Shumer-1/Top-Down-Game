import { player, playerSpriteSheet } from '../entities/player.js';
import { enemy } from '../entities/enemy.js';
import { GameManager } from '../managers/gameManager.js';
import { SoundManager } from '../managers/soundManager.js';

const canvas = document.getElementById('level1');
const soundManager = new SoundManager('../audio/lev1.mp3', '../audio/att.mp3', '../audio/enemy.mp3');

// Создаём врагов
let enemies = [
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
enemies[1].pos_y = 400;

enemies[2].pos_x = 650;
enemies[2].pos_y = 70;

enemies[3].pos_x = 250;
enemies[3].pos_y = 500;

enemies[4].pos_x = 550;
enemies[4].pos_y = 500;

enemies[5].pos_x = 550;
enemies[5].pos_y = 400;


const healthDisplay = document.getElementById("healthDisplay");
healthDisplay.innerText = `Health: ${100}`;
healthDisplay.updateHealthDisplay = function (player) {
    const healthDisplay = document.getElementById("healthDisplay");
    healthDisplay.innerText = `Health: ${player.lifetime}`;
}

const gameManager = new GameManager(canvas, player, enemies, soundManager, healthDisplay, 50, 50, 800, 800, 1);
gameManager.initialize('/my_game/JSON/level1.json');


