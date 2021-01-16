import {Primitive} from './lang.js'

/*class NShape extends Primitive {
    bounds() {
        throw new Error("bounds not implemented on " + this.constructor.name)
    }
}
export class NCircle extends NShape {
    constructor(opts) {
        super();
        this.fill = 'black'

        this.radius = 10;
        this.log("options",opts)
        if(opts.radius) {
            this.radius = unbox(opts.radius)
        }

        this.center = new Point(this.radius,this.radius)
        this.log("made circle",this)
    }
    bounds() {
        let r = this.radius
        let c = this.center
        return new Bounds(c.x - r, c.y - r, r*2,r*2)
    }
}

class Bounds {
    constructor(x,y,w,h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.x2 = this.x+this.w
        this.y2 = this.y+this.h
    }
    union(b) {
        let x = Math.min(this.x,b.x)
        let y = Math.min(this.y,b.y)
        let x2 = Math.max(this.x2,b.x2)
        let y2 = Math.max(this.y2,b.y2)
        return new Bounds(x,y,x2-x,y2-y)
    }
    scaleInside(b) {
        let sx = b.w/this.w
        let sy = b.h/this.h;
        return Math.min(sx,sy)
    }
}



*/