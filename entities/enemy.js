import {Entity} from "./entity.js";
import {SpriteManager} from "../managers/spriteManager.js";

let radius = 200;

let enemy = Entity.extend({
    lifetime: 10,
    move_x: 0,
    move_y: 0,
    pos_x: 500,
    pos_y: 100,
    speed: 0.5,
    health: 10,
    isAttacking: false,
    isDamaged: false,
    damageDirection: 0,
    damageFrame: 0,
    damageDelay: 5,
    damageFrameCounter: 0,
    lifeFlag: true,
    count: 0
});

const enemyImage = new Image();
enemyImage.src = '../tiled/characters/slimes/PNG/Slime3/Run/Slime3_Run_full.png';

const damageImage = new Image();
damageImage.src = '../tiled/characters/slimes/PNG/Slime3/Hurt/Slime3_Hurt_full.png';

const attackImage = new Image();
attackImage.src = '../tiled/characters/slimes/PNG/Slime3/Attack/Slime3_Attack_full.png';

const stayImage = new Image();
stayImage.src = '../tiled/characters/slimes/PNG/Slime3/Idle/Slime3_Idle_full.png';

export let enemySpriteSheet;
export let damageSpriteSheet;
export let attackSpriteSheet;
export let staySpriteSheet;

enemyImage.onload = () => {
    enemySpriteSheet = new SpriteManager(enemyImage, 64, 64);
};

damageImage.onload = () => {
    damageSpriteSheet = new SpriteManager(damageImage, 64, 64);
};

attackImage.onload = () => {
    attackSpriteSheet = new SpriteManager(attackImage, 64, 64);
}

stayImage.onload = () => {
    staySpriteSheet = new SpriteManager(stayImage, 64, 64);
}

enemy.currentFrame = 0;
enemy.frameDelay = 5;
enemy.frameCounter = 0;

enemy.takeDamage = function (damage) {
    this.health -= damage;
    this.isDamaged = true;

    if (this.health <= 0) {
        this.die();
    }
};

enemy.die = function () {
    console.log("Enemy died!");
    this.lifeFlag = false;
};

enemy.update = function (player, physicManager, soundManager) {
    let dx = player.pos_x - this.pos_x;
    let dy = player.pos_y - this.pos_y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (this.isDamaged) {
        this.move_x = 0;
        this.move_y = 0;

        this.damageFrameCounter++;
        if (this.damageFrameCounter >= this.damageDelay) {
            this.damageFrame = (this.damageFrame + 1) % 5;
            this.damageFrameCounter = 0;

            if (this.damageFrame === 0) {
                this.isDamaged = false;
            }
        }
    } else {
        if (distance > 10 && this.isAttacking) {
            this.isAttacking = false;
        }
        else if (distance <= 10 && !this.isAttacking) {
            soundManager.playEnemyMusic();
            player.lifetime -= 10;
            this.isAttacking = true;

            this.attackFrame = 0;
            this.attackFrameCounter = 0;

            if (this.attackFrame === 8) {
                this.isAttacking = false;
            }
        } else if (distance <= radius) {
            let stepX = (dx / distance) * this.speed;
            let stepY = (dy / distance) * this.speed;

            if (physicManager.isPassable(this.pos_x + stepX, this.pos_y)) {
                this.move_x = stepX;
            } else {
                this.move_x = stepX / 2;
            }

            if (physicManager.isPassable(this.pos_x, this.pos_y + stepY)) {
                this.move_y = stepY;
            } else {
                this.move_y = stepY / 2;
            }
        } else {
            this.move_x = 0;
            this.move_y = 0;
        }

        this.pos_x += this.move_x;
        this.pos_y += this.move_y;
    }
};

enemy.draw = function (ctx) {
    if (!enemySpriteSheet || !damageSpriteSheet || !attackSpriteSheet) return;

    let frameY = 0;

    if (this.isDamaged) {
        this.damageFrameCounter++;
        if (this.damageFrameCounter >= this.damageDelay) {
            this.damageFrame = (this.damageFrame + 1) % 5;
            this.damageFrameCounter = 0;

            if (this.damageFrame === 0) {
                this.isDamaged = false;
            }
        }

        this.currentFrame = this.damageFrame;
        damageSpriteSheet.drawFrame(
            ctx,
            this.currentFrame, frameY,
            this.pos_x, this.pos_y
        );
    } else if (this.isAttacking) {
        let frameY = 0;

        this.attackFrameCounter++;
        this.attackFrame = (this.attackFrame + 1) % 9;
        this.attackFrameCounter = 0;

        attackSpriteSheet.drawFrame(
            ctx,
            this.attackFrame, frameY,
            this.pos_x, this.pos_y
        );
    } else {
        if (this.move_y < 0) frameY = 1;
        else if (this.move_y > 0) frameY = 0;
        else if (this.move_x < 0) frameY = 2;
        else if (this.move_x > 0) frameY = 3;
        else frameY = 0;

        if (this.move_x !== 0 || this.move_y !== 0) {
            this.frameCounter++;
            if (this.frameCounter >= this.frameDelay) {
                this.currentFrame = (this.currentFrame + 1) % 6;
                this.frameCounter = 0;
            }
            enemySpriteSheet.drawFrame(
                ctx,
                this.currentFrame, frameY,
                this.pos_x, this.pos_y
            );
        } else {
            this.frameCounter++;
            if (this.frameCounter >= this.frameDelay) {
                this.currentFrame = (this.currentFrame + 1) % 6;
                this.frameCounter = 0;
            }
            staySpriteSheet.drawFrame(
                ctx,
                this.currentFrame, frameY,
                this.pos_x, this.pos_y
            )
        }
    }
};


export {enemy};
