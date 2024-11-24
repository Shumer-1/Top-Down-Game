export class Entity {
    constructor() {
        this.pos_x = 0;
        this.pos_y = 0;
        this.size_x = 0;
        this.size_y = 0;
    }

    static extend(extendProto) {
        let object = Object.create(this.prototype);
        for (let property in extendProto) {
            if (extendProto.hasOwnProperty(property)) {
                object[property] = extendProto[property];
            }
        }
        return object;
    }
}
