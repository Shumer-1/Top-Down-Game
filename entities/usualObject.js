import { Entity } from './entity.js';

export class UsualObject extends Entity {
    static dictionary = {
        'Big skelet': 1,
        "green_crystal": 2,
        "pile_of_bones": 4,
        "tree": 6
    };
    constructor(data, tilesetImage) {
        super();

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
            console.error('Изображение для UsualObject отсутствует');
        }
    }
    getCoveredTiles() {
        const tiles = [];
        for (let i = 0; i < this.size_x; i++) {
            for (let j = 0; j < this.size_y; j++) {
                tiles.push({
                    x: this.pos_x + i,
                    y: this.pos_y + j
                });
            }
        }
        return tiles;
    }
}
