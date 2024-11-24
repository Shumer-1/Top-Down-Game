import {Entity} from "./entity.js";
import {SpriteManager} from "../managers/spriteManager.js";

let player = Entity.extend({
    lifetime: 30,
    move_x: 0, move_y: 0,
    pos_x: 0,
    pos_y: 0,
    speed: 1,
    attackRadius: 50,
    attackDamage: 40,
    attacking: false,
    attackFrame: 0,
    attackDelay: 2,
    attackFrameCounter: 0,
    attackCompleted: false,
    lastDirection: 0,
    death: false,
    teleport: false,
    endGame: false
});

const playerImage = new Image();
playerImage.src = '../tiled/characters/orcs/PNG/Orc2/Orc2_run/orc2_run_full.png';

const attackImage = new Image();
attackImage.src = '../tiled/characters/orcs/PNG/Orc2/Orc2_attack/orc2_attack_full.png';
export let attackSpriteSheet;

attackImage.onload = () => {
    attackSpriteSheet = new SpriteManager(attackImage, 64, 64);
};

export let playerSpriteSheet;

playerImage.onload = () => {
    playerSpriteSheet = new SpriteManager(playerImage, 64, 64);
};

player.currentFrame = 0;
player.frameDelay = 5;
player.frameCounter = 0;

player.draw = function (ctx) {
    if (this.attacking) {

        let frameY = this.lastDirection;

        this.attackFrameCounter++;
        if (this.attackFrameCounter >= this.attackDelay) {
            this.attackFrame = (this.attackFrame + 1) % 8;
            this.attackFrameCounter = 0;
        }

        attackSpriteSheet.drawFrame(
            ctx,
            this.attackFrame, frameY,
            this.pos_x, this.pos_y
        );

        if (this.attackFrame === 7) {
            this.attacking = false;
            this.attackCompleted = true;
        }
    } else {
        let frameY = this.lastDirection;

        if (this.move_x !== 0 || this.move_y !== 0) {
            if (this.move_y < 0) frameY = 1; // Двигается вверх
            else if (this.move_y > 0) frameY = 0; // Двигается вниз
            else if (this.move_x < 0) frameY = 2; // Двигается влево
            else if (this.move_x > 0) frameY = 3; // Двигается вправо

            this.lastDirection = frameY;
            this.frameCounter++;
            if (this.frameCounter >= this.frameDelay) {
                this.currentFrame = (this.currentFrame + 1) % 6;
                this.frameCounter = 0;
            }
        } else {
            this.currentFrame = 0; // Показываем первый кадр
        }

        playerSpriteSheet.drawFrame(
            ctx,
            this.currentFrame, frameY,
            this.pos_x, this.pos_y
        );
    }
};


player.attack = function (enemies, speedObj, healObj) {
    if (this.attacking) return;

    this.attacking = true;
    this.attackFrame = 0;
    this.attackCompleted = false;
    if (speedObj){
        let dx = speedObj.pos_x - this.pos_x;
        let dy = speedObj.pos_y - this.pos_y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (speedObj.flag === false && distance <= this.attackRadius &&
            ((this.lastDirection === 0 && speedObj.pos_y >= this.pos_y)
                || (this.lastDirection === 1 && speedObj.pos_y <= this.pos_y)
                || (this.lastDirection === 2 && speedObj.pos_x <= this.pos_y)
                || (this.lastDirection === 3 && speedObj.pos_y >= this.pos_y))) {
            this.speed *= 3;
            speedObj.flag = true;
        }
    }

    if (healObj){
        let dx = healObj.pos_x - this.pos_x;
        let dy = healObj.pos_y - this.pos_y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (healObj.flag === false && distance <= this.attackRadius &&
            ((this.lastDirection === 0 && healObj.pos_y >= this.pos_y)
                || (this.lastDirection === 1 && healObj.pos_y <= this.pos_y)
                || (this.lastDirection === 2 && healObj.pos_x <= this.pos_y)
                || (this.lastDirection === 3 && healObj.pos_y >= this.pos_y))) {
            this.lifetime = 30;
            healObj.flag = true;
        }
    }


    enemies.forEach(enemy => {
        const dx = enemy.pos_x - this.pos_x;
        const dy = enemy.pos_y - this.pos_y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.attackRadius &&
            ((this.lastDirection === 0 && enemy.pos_y >= this.pos_y)
                || (this.lastDirection === 1 && enemy.pos_y <= this.pos_y)
                || (this.lastDirection === 2 && enemy.pos_x <= this.pos_y)
                || (this.lastDirection === 3 && enemy.pos_y >= this.pos_y))) {
            enemy.takeDamage(this.attackDamage); // Наносим урон врагам в радиусе
        }
    });
};

player.update = function (physicManager, portalEnt, endGameEnt) {
    if (physicManager.isPassable(this.pos_x + this.move_x * this.speed, this.pos_y + this.move_y * this.speed)) {
        this.pos_x += this.move_x * this.speed;
        this.pos_y += this.move_y * this.speed;
    }
    if (this.lifetime <= 0) {
        this.death = true;
    }

    if (endGameEnt){
        const coveredTiles = endGameEnt.getCoveredTiles();
        for (let tile of coveredTiles) {
            if (Math.abs(tile.x - this.pos_x-30) < 1 && Math.abs(tile.y - this.pos_y) < 1) {
                this.endGame = true;
            }
        }
    }

    if (portalEnt){
        const coveredTiles = portalEnt.getCoveredTiles();
        for (let tile of coveredTiles) {
            if (Math.abs(tile.x - this.pos_x) < 1 && Math.abs(tile.y - this.pos_y) < 1) {
                this.teleport = true;
            }
        }
    }
};

export {player};
