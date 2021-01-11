
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
            return b - Math.sqrt(c)
        } else {
            return 10000
        }
    }
    getNormal(point) {
        return point.sub(this.center).normalize()
    }
}

const scene = {
    fov: 90.0,
    spheres: [
        new Sphere(
            new Vec3(0,0,-5),
            1.5,
            new Color(0.4,1.0,0.4)
        ),
        new Sphere(
            new Vec3(3,0,-5),
            1.0,
            new Color(0.4,1.0,0.4)
        )
        ]
}

class Image {
    constructor(w,h) {
        this.width = w
        this.height = h
    }
}

let canvas = new Image(40,15)

function create_prime(x,y,image) {
    let canvas_x = (x+0.5)/image.width * 2.0 - 1.0
    let canvas_y = 1.0 - (y+0.5)/image.height * 2.0
    return new Ray(
        new Vec3(0,0,0),
        new Vec3(canvas_x,canvas_y,-1).normalize(),
    )
}

for(let j=0; j<canvas.height; j++) {
    for( let i=0; i<canvas.width; i++) {
        let ray = create_prime(i,j,canvas)
        //see if hit
        let min_t = 10000
        let obj = null
        //record the closest hit
        scene.spheres.forEach(sph => {
            let inter = sph.intersect(ray)
            if(inter < min_t) min_t = inter
            obj = sph
        })
        // let t = scene.sphere.intersect(ray)
        if( min_t < 0) {
            process.stdout.write('x')
            //shade
            // let origin = ray.origin.add(ray.direction.scaleBy(t))
            // let normal = scene.sphere.getNormal(origin)
            // console.log(normal)
            // let direction = scene.sphere.bounce(ray,normal)
            // console.log(origin)
        } else {
            process.stdout.write('.')
        }
    }
    process.stdout.write("\n")
}

