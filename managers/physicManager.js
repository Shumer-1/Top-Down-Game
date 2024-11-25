export class PhysicManager {
    constructor(mapManager, level) {
        this.mapManager = mapManager;
        this.objects = [];
        this.level = level;
    }

    isPassable(x, y) {
        x+=30;
        y+=30;

        let maxY;
        let maxX;

        if (this.level === 1){
            maxX = 800;
            maxY = 800;
        }
        else{
            maxX = 960;
            maxY = 640;
        }

        if (x < -1 || y < -1 || x > maxX || y > maxY) {
            return false;
        }


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