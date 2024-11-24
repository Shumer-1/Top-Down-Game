import { Entity } from './entity.js';

export class SpeedEnt extends Entity {
    static number = 9;

    constructor(data, tilesetImage) {
        super();

        this.flag = false;
        this.pos_x = data.x;
        this.pos_y = data.y;
        this.size_x = data.width;
        this.size_y = data.height;
        this.image = tilesetImage;
        this.gid = data.gid;
    }


    draw(ctx) {
        if (this.image) {
            ctx.drawImage(
                this.image,
                this.pos_x,
                this.pos_y,
                this.size_x,
                this.size_y
            );
        } else {
            console.error('Изображение для SpeedEnt отсутствует');
        }
    }
}
