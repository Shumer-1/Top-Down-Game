import {UsualObject} from '../entities/usualObject.js';
import {HealEnt} from "../entities/healEnt.js";
import {PortalEnt} from "../entities/portalEnt.js";
import {SpeedEnt} from "../entities/speedEnt.js";
import {EndGameEnt} from "../entities/endGameEnt.js";

export class MapManager {
    constructor(xCount, yCount, x, y) {
        this.mapData = null;
        this.layers = [];
        this.xCount = xCount;
        this.yCount = yCount;
        this.tSize = {x: 16, y: 16};
        this.mapSize = {x: x, y: y};
        this.tilesets = [];
        this.objectGroups = [];
        this.imgLoadCount = 0;
        this.imgLoaded = false;
        this.jsonLoaded = false;
        this.usualObjects = [];
        this.speedObj = null;
        this.healObj = null;
        this.portalObj = null;
        this.endGameObg = null;
    }

    loadMap(path) {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    this.parseMap(request.responseText);
                } else {
                    console.error(`Failed to load map: ${path}`);
                }
            }
        };
        request.open("GET", path, true);
        request.send();
    }

    parseMap(tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = 16;
        this.tSize.y = 16;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;

        for (const tileset of this.mapData.tilesets) {
            const images = [];

            if (tileset.image) {
                const img = new Image();
                img.onload = () => {
                    this.imgLoadCount++;
                    if (this.imgLoadCount === this.mapData.tilesets.length) {
                        this.imgLoaded = true;
                    }
                };
                img.onerror = () => {
                    console.error(`Failed to load tileset image: ${tileset.image}`);
                };
                img.src = tileset.image;
                images.push(img);
            }

            if (tileset.tiles) {
                for (const tile of tileset.tiles) {
                    const img = new Image();
                    img.onload = () => {
                        this.imgLoadCount++;
                        if (this.imgLoadCount === this.mapData.tilesets.length) {
                            this.imgLoaded = true;
                        }
                    };
                    img.onerror = () => {
                        console.error(`Failed to load tile image: ${tile.image}`);
                    };
                    img.src = tile.image;
                    images.push(img);
                }
            }

            const ts = {
                firstgid: tileset.firstgid,
                images: images,
                name: tileset.name,
                xCount: Math.floor(tileset.imagewidth / this.tSize.x),
                tiles: tileset.tiles || [],
            };
            this.tilesets.push(ts);
        }

        this.layers = this.mapData.layers.filter(layer => layer.type === "tilelayer");
        this.objectGroups = this.mapData.layers.filter(layer => layer.type === "objectgroup");

        this.jsonLoaded = true;
    }

    getTile(tileIndex) {
        const tile = {img: null, px: 0, py: 0};
        const tileset = this.getTileset(tileIndex);
        if (!tileset) {
            console.error(`No tileset found for tileIndex: ${tileIndex}`);
            return tile;
        }

        if (tileset.tiles.length > 0) {
            const id = tileIndex - tileset.firstgid;
            const tileData = tileset.tiles.find(t => t.id === id);
            if (tileData && tileData.image) {
                tile.img = new Image();
                tile.img.onload = () => {
                    tile.px = 0;
                    tile.py = 0;
                };
                tile.img.onerror = () => {
                    console.error(`Failed to load tile image: ${tileData.image}`);
                };
                tile.img.src = tileData.image;
            } else {
                console.error(`Tile data not found for tileIndex: ${tileIndex}`);
            }
        } else {
            if (tileset.images[0]) {
                tile.img = tileset.images[0];
                const id = tileIndex - tileset.firstgid;

                const x = id % tileset.xCount;
                const y = Math.floor(id / tileset.xCount);
                tile.px = x * this.tSize.x;
                tile.py = y * this.tSize.y;
            } else {
                console.error(`No images found in tileset for tileIndex: ${tileIndex}`);
            }
        }

        if (!tile.img || !(tile.img instanceof HTMLImageElement)) {
            console.error(`Image not found or not loaded for tileIndex: ${tileIndex}`);
        }

        return tile;
    }

    draw(ctx) {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => {
                this.draw(ctx);
            }, 100);
        } else {
            for (const layer of this.layers) {
                for (let i = 0; i < layer.data.length; i++) {
                    const tileIndex = layer.data[i];
                    if (tileIndex !== 0) {
                        const tile = this.getTile(tileIndex);

                        if (tile.img instanceof HTMLImageElement) {
                            const pX = (i % this.xCount) * this.tSize.x;
                            const pY = Math.floor(i / this.xCount) * this.tSize.y;

                            ctx.drawImage(
                                tile.img,
                                tile.px, tile.py, this.tSize.x, this.tSize.y,
                                pX, pY, this.tSize.x, this.tSize.y
                            );
                        } else {
                            console.error(`Tile image not available for tileIndex: ${tileIndex}`);
                        }
                    }
                }
            }
        }
    }

    getTileset(tileIndex) {
        for (let i = this.tilesets.length - 1; i >= 0; i--) {
            if (this.tilesets[i].firstgid <= tileIndex) {
                return this.tilesets[i];
            }
        }
        console.error(`No tileset found for tileIndex: ${tileIndex}`);
        return null;
    }

    createEntities() {
        const entities = [];

        for (const group of this.objectGroups) {
            if (group && group.objects) {
                for (const object of group.objects) {
                    const tileset = this.getTileset(object.gid);
                    if (['eye_skulls'].includes(object.type)) {
                        object.y -= 128;
                        const object1 = new UsualObject(object, tileset.images[0]);
                        this.usualObjects.push(object1);
                        entities.push(object1);
                    }
                    if ('fallen_tree' === object.type) {
                        object.y -= 128;
                        const object1 = new UsualObject(object, tileset.images[122]);
                        this.usualObjects.push(object1);
                        entities.push(object1);
                    }
                    if ('heal2' === object.type && 'heal' === object.name) {
                        object.y -= 128;
                        const object2 = new HealEnt(object, tileset.images[40]);
                        entities.push(object2);
                        this.healObj = object2;
                    }
                    if ('terrible_tree' === object.type) {
                        object.y -= 128;
                        const object1 = new UsualObject(object, tileset.images[35]);
                        this.usualObjects.push(object1);
                        entities.push(object1);
                    }
                    if ('strange_mushrooms' === object.type) {
                        object.y -= 60;
                        const object1 = new UsualObject(object, tileset.images[116]);
                        this.usualObjects.push(object1);
                        entities.push(object1);
                    }
                    if ('portal' === object.type && object.name === 'portal2') {
                        object.y -= 128;
                        const object1 = new EndGameEnt(object, tileset.images[127]);
                        this.endGameObg = object1;
                        entities.push(object1);
                    }
                    if (['Big skelet', 'green_crystal', 'pile_of_bones', 'tree'].includes(object.type)) {
                        const object1 = new UsualObject(object, tileset.images[UsualObject.dictionary[object.type]]);
                        this.usualObjects.push(object1);
                        entities.push(object1);
                    }
                    if (object.type === 'heal' && object.name === 'heal') {
                        const object2 = new HealEnt(object, tileset.images[HealEnt.number]);
                        entities.push(object2);
                        this.healObj = object2;
                    }
                    if (object.type === 'portal' && object.name === 'portal1') {
                        const object2 = new PortalEnt(object, tileset.images[PortalEnt.number]);
                        entities.push(object2);
                        this.portalObj = object2;

                    }
                    if (object.type === 'speed_up') {
                        const object2 = new SpeedEnt(object, tileset.images[SpeedEnt.number]);
                        entities.push(object2);
                        this.speedObj = object2;
                    }
                }
            }
        }

        return entities;
    }

    getTileSetIdx(x, y) {
        let wX = x;
        let wY = y;
        const groundLayer = this.layers.find(layer => layer.name === 'ground');
        let idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);
        return groundLayer.data[idx];
    }

    isTilePassable(x, y) {
        const groundLayer = this.layers.find(layer => layer.name === 'ground');
        if (!groundLayer) {
            console.error("Ground layer not found");
            return false;
        }

        const tileIndex = this.getTileSetIdx(x, y)
        return tileIndex !== 0 && tileIndex !== 320;
    }


}
