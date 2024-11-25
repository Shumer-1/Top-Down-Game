export class EventManager {
    constructor(player, enemies, soundManager, healObj, speedObj) {
        this.player = player;
        this.enemies = enemies;
        this.soundManager = soundManager;
        this.healObj = healObj;
        this.speedObj = speedObj;
        this.count = 0;
    }

    initialize() {
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));
    }

    handleKeyDown(event) {
        //this.soundManager.playBackgroundMusic();
        switch (event.key) {
            case 'ArrowUp':
                this.player.move_y = -1;
                break;
            case 'ArrowDown':
                this.player.move_y = 1;
                break;
            case 'ArrowLeft':
                this.player.move_x = -1;
                break;
            case 'ArrowRight':
                this.player.move_x = 1;
                break;
            case ' ':
                this.count++;
                console.log(this.count);
                this.player.attack(this.enemies, this.speedObj, this.healObj);
                this.soundManager.playAttackMusic();
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                this.player.move_y = 0;
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                this.player.move_x = 0;
                break;
        }
    }
}
