
class Color {
    constructor(red,green,blue) {
        this.red = red,
        this.blue = blue
        this.green = green
    }
}

class Vec3 {
    constructor(x,y,z) {
        this.x = x
        this.y = y
        this.z = z
    }
    scaleBy(s) {
        return new Vec3(this.x*s, this.y*s, this.z*s)
    }
    add(v) {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z)
    }
    sub(v) {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z)
    }

    dot(v) {
        return this.x*v.x + this.y*v.y + this.z*v.z
    }
    magnitude() {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z)
    }
    normalize() {
        let s = 1.0/this.magnitude()
        return new Vec3(this.x*s,this.y*s,this.z*s)
    }
}
class Ray {
    constructor(origin,direction) {
        this.origin = origin
        this.direction = direction
    }
}
class Sphere {
    constructor(center, radius, color) {
        this.center = center
        this.radius = radius
        this.color = color
    }

    intersect(ray) {
        let distance = ray.origin.sub(this.center)
        let b = distance.dot(ray.direction)
        let c = b*b - (distance.magnitude() * distance.magnitude()) + (this.radius*this.radius)
        if(c > 0.0) {
            process.stdout.write("X")
            return -b - Math.sqrt(c)
        } else {
            process.stdout.write(".")
            return -1
        }
    }
}

const scene = {
    fov: 90.0,
    sphere: new Sphere(
            new Vec3(0,0,-5),
            2.0,
            new Color(0.4,1.0,0.4)
    )
}

class Image {
    constructor(w,h) {
        this.width = w
        this.height = h
    }
}

let canvas = new Image(20,40)

function create_prime(x,y,image) {
    let canvas_x = (x+0.5)/image.width * 2.0 - 1.0
    let canvas_y = 1.0 - (y+0.5)/image.height * 2.0
    return new Ray(
        new Vec3(0,0,0),
        new Vec3(canvas_x,canvas_y,-1).normalize(),
    )
}

for( let i=0; i<canvas.width; i++) {
    for(let j=0; j<canvas.height; j++) {
        let ray = create_prime(i,j,canvas)
        if( scene.sphere.intersect(ray)) {
            // drawPx(x,y, scene.sphere.color)
        }
    }
    process.stdout.write("\n")
}

