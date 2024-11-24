export class SpriteManager {
    constructor(image, frameWidth, frameHeight) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.columns = Math.floor(image.width / frameWidth);
    }

    drawFrame(ctx, frameX, frameY, x, y, scale = 1) {
        ctx.drawImage(
            this.image,
            frameX * this.frameWidth, frameY * this.frameHeight,
            this.frameWidth, this.frameHeight,
            x, y,
            this.frameWidth * scale, this.frameHeight * scale
        );
    }
}
