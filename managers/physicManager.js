export class PhysicManager {
    constructor(mapManager) {
        this.mapManager = mapManager;
        this.objects = []  // Массив объектов UsualObject
    }

    isPassable(x, y) {
        x+=30;
        y+=30;

        if (!this.mapManager.isTilePassable(x, y)) {
            return false;
        }

        for (let obj of this.objects) {
            const coveredTiles = obj.getCoveredTiles();
            for (let tile of coveredTiles) {
                if (Math.abs(tile.x - x) < 1 && Math.abs(tile.y - y) < 1) {
                    return false;
                }
            }
        }

        return true;
    }

    addObject(object) {
        this.objects.push(object);
    }

    removeObject(object) {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
    }
}