import { StaticEntity } from "./static-entity";
import { Assets } from "../../gfx/assets";

export default class Machine extends StaticEntity {
    constructor(handler, x, y){
        super(handler, x, y);
        this.type = 'm';
        // this.target = null;
        this.keys = [];
        this.assets.p = Assets.getAssets('all').anim['p_mright'];
        this.assets.g = Assets.getAssets('all').anim['g_mright'];
        this.assets.y = Assets.getAssets('all').anim['y_mright'];
        this.assets.b = Assets.getAssets('all').anim['b_mright'];

        /* COLLISION BOUNDS */
        this.b.x = 0;
        this.b.y = 0;
        this.b.s = 128; // size
        /* COLLISION BOUNDS */
    }

    tick() {
        if (this.keys.length > 3) {
            console.log('machine has ' + this.keys.length + ' keys!');
        }
    }

    render(g) {
        // let t = this.anim ? this.texture.getCurrentFrame() : this.texture;
        g.myDrawImage(this.assets.p.getCurrentFrame(), this.x, this.y, TILE_SIZE, TILE_SIZE);
        g.myDrawImage(this.assets.g.getCurrentFrame(), this.x + TILE_SIZE, this.y, TILE_SIZE, TILE_SIZE);
        g.myDrawImage(this.assets.y.getCurrentFrame(), this.x + TILE_SIZE, this.y + TILE_SIZE, TILE_SIZE, TILE_SIZE);
        g.myDrawImage(this.assets.b.getCurrentFrame(), this.x, this.y + TILE_SIZE, TILE_SIZE, TILE_SIZE);


        // ****** DRAW BOUNDING BOX DON'T DELETE!!
        // g.fillStyle = 'orange';
        // g.fillRect(this.b.x + this.x, this.b.y + this.y, this.b.s, this.b.s);
        // ****** DRAW BOUNDING BOX DON'T DELETE!!
    }

    addKey(item) {
        this.keys.push(item);
    }

    // tick() {
    //     if (this.target) {
    //     this.x = this.target.x + 4;
    //     this.y = this.target.y - 62;
    //     }
    // }

    // setTarget(e) {
    //     this.target = e;
    // }
    // getType() {
        // return this.type;
    // }
}