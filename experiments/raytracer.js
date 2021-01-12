
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
            return Infinity
        }
    }
    getNormal(point) {
        return point.sub(this.center).normalize()
    }
}

const scene = {
    fov: 90.0,
    lights: [
        {
            center: new Vec3(-30,-10,20)
        },
    ],
    spheres: [
        new Sphere(
            new Vec3(-1,0,-4),
            1.5,
            new Color(0.4,1.0,0.4)
        ),
        new Sphere(
            new Vec3(2,0,-4),
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

let canvas = new Image(100,40)

function create_prime(x,y,image) {
    let canvas_x = (x+0.5)/image.width * 2.0 - 1.0
    let canvas_y = 1.0 - (y+0.5)/image.height * 2.0
    return new Ray(
        new Vec3(0,0,0),
        new Vec3(canvas_x,canvas_y,-1).normalize(),
    )
}



function surface(ray, scene, obj, pointAtTime, normal, depth) {
    let b = obj.color
    let c = new Vec3(0,0,0)
    let lambertAmount = 0
    scene.lights.forEach(light => {
        // unit(light.center - pat) dot normal
        let contrib = light.center.sub(pointAtTime).normalize().dot(normal)
        if(contrib < 0) return
        lambertAmount += contrib
    })
    //clamp to above 1
    lambertAmount = Math.min(1,lambertAmount)
    //multiply times sphere color and material.lambert + ambient
    return lambertAmount
}

for(let j=0; j<canvas.height; j++) {
    for( let i=0; i<canvas.width; i++) {
        let ray = create_prime(i,j,canvas)
        //see if hit
        let closest = {
            distance: Infinity,
            obj:null
        }
        //record the closest hit
        scene.spheres.forEach(obj => {
            let distance = obj.intersect(ray)
            if(distance < closest.distance) {
                closest = {distance, obj}
            }
        })
        if( closest.distance < 0) {
            let pointAtTime = ray.origin.add( ray.direction.scaleBy(closest.distance))
            let color = surface(ray,
                scene,
                closest.obj,
                pointAtTime,
                closest.obj.getNormal(pointAtTime)
                )
            let colors = ['.',':','*','%','#','@','x','X','W','Q']
            let n = Math.floor(color*10)
            process.stdout.write(colors[n])
        } else {
            process.stdout.write(' ')
        }
    }
    process.stdout.write("\n")
}

