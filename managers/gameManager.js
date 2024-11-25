import { MapManager } from './mapManager.js';
import { EventManager } from './eventManager.js';
import {PhysicManager} from "./physicManager.js";
import {SpeedEnt} from "../entities/speedEnt.js";
import {player} from "../entities/player.js";
import {HealEnt} from "../entities/healEnt.js";

export class GameManager {
    constructor(canvas, player, enemies, soundManager, healthDisplay, xCount, yCount, x, y, level) {
        this.startTime = new Date();
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.enemies = enemies || [];
        this.soundManager = soundManager;
        this.mapManager = new MapManager();
        this.physicManager = new PhysicManager(this.mapManager, level);
        this.player = player;
        this.lastUpdateTime = 0;
        this.frameRate = 60;
        this.frameDuration = 1000 / this.frameRate;
        this.healthDisplay = healthDisplay;
        this.level = level;
        this.isGameInitialized = false;
        this.entities = [];
    }

    initialize(mapPath) {
        try {
            this.mapManager.loadMap(mapPath);

            this.checkResourcesLoaded(() => {
                this.isGameInitialized = true;

                this.entities = this.mapManager.createEntities();

                this.eventManager = new EventManager(this.player, this.enemies, this.soundManager, this.mapManager.healObj, this.mapManager.speedObj);
                this.eventManager.initialize();
                for (let i = 0; i < this.mapManager.usualObjects.length; i++) {
                    this.physicManager.addObject(this.mapManager.usualObjects[i]);
                }

                this.startGameLoop();
            });

        } catch (error) {
            console.error("Ошибка при инициализации игры:", error);
        }
    }

    checkResourcesLoaded(callback) {
        const interval = setInterval(() => {
            if (this.mapManager.imgLoaded && this.mapManager.jsonLoaded) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    }

    startGameLoop() {
        const loop = (timestamp) => {
            if (!this.isGameInitialized) {
                return;
            }

            if (this.isGameInitialized) {
                const deltaTime = timestamp - this.lastUpdateTime;

                if (deltaTime >= this.frameDuration) {
                    this.updateGame(deltaTime);
                    if (!this.isGameInitialized) {
                        return;

                    }
                    this.renderGame();
                    this.lastUpdateTime = timestamp;
                }
            }

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }


    updateGame(deltaTime) {
        this.player.update(this.physicManager, this.mapManager.portalObj, this.mapManager.endGameObg);

        if (player.teleport === true){
            localStorage.setItem('level1Time', new Date() - this.startTime);
            window.location.href = "../level2/level2.html";
            return;
        }

        if (player.endGame === true){
            localStorage.setItem('level2Time', new Date() - this.startTime);
            window.location.href = "../liderBoard/liderBoard.html";
            this.isGameInitialized = false;
            return;
        }

        if (this.player.lifetime <= 0) {
            this.endGame("Game Over! You died.");
            setTimeout(() => window.location.href = "../start/start.html", 2000)
            return;
        }

        this.healthDisplay.updateHealthDisplay(this.player);

        this.enemies.forEach(enemy => {
            if (enemy.lifeFlag) {
                enemy.update(this.player, this.physicManager, this.soundManager);
            }
        });

        this.entities.forEach(entity => {
            if (entity.update) {
                entity.update(deltaTime);
            }
        });
    }

    endGame(message) {
        this.isGameInitialized = false;
        this.healthDisplay.updateHealthDisplay(player);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = "48px Arial";
        this.ctx.fillStyle = "red";
        this.ctx.textAlign = "center";
        this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);

        console.log("Game Over!");
    }


    renderGame() {
        const ctx = this.ctx;

        // Очищаем экран
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.mapManager.draw(ctx);

        this.entities.forEach(entity => {
            if (entity.draw) {
                if (entity instanceof SpeedEnt || entity instanceof HealEnt){
                    if (!entity.flag){
                        entity.draw(ctx);
                    }
                }
                else {
                    entity.draw(ctx);
                }
            }
        });

        this.player.draw(ctx);

        this.enemies.forEach(enemy => {
            if (enemy.lifeFlag) {
                enemy.draw(ctx)
            }
        });
    }
}
