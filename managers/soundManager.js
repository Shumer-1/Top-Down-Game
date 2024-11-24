export class SoundManager {
    constructor(backgroundMusicPath, attackMusicPath) {
        this.backgroundMusic = new Audio(backgroundMusicPath);
        this.attackMusic = new Audio(attackMusicPath);

        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.8;

        this.attackMusic.loop = false;
        this.attackMusic.volume = 1;

        this.isMusicStarted = false;
    }

    playBackgroundMusic() {
        if (!this.isMusicStarted) {
            this.backgroundMusic.play().catch(err => console.error('Ошибка при воспроизведении музыки:', err));
            this.isMusicStarted = true;
        }
    }

    playAttackMusic() {
        this.attackMusic.play().catch(err => console.error('Ошибка при воспроизведении музыки:', err));
    }
}
