# examples

* What's the shortest possible raytracer using vector math. 
    * Loop over every pixel
    * generate primary ray
    * intersect with list of objects
    * find normal at closest intersection
    * calculate shading using lights.
    * project secondary rays and recurse


```javascript
class Color {
    constructor(red,green,blue) {
        this.red = red,
        this.blue = blue
        this.green = green
    }
}
class Sphere {
    center = new Point()
    radius = 1
    color = new Color(0,255,0)
    intersect(ray) {
        let l = this.center.sub(ray.origin)
        let adj2 = l.dot(ray.direction)
        let d2 = l.dot(l).subtract(adj2*adj2)
        if(d2 < this.radius*this.radius) {
            return true
        } else {
            return false            
        }
    }
}

const scene = {
    width: 800,
    height: 600,
    fov: 90.0
    sphere: new Sphere(
            new Point(0,0,-5),
            1.0,
            new Color(0.4,1.0,0.4)
    )
}

class Ray {
    origin: new Point(),
    direction: new Vec3()
}

let canvas = new Image(100,100)

function create_prime(x,y,scene) {
    let canvas_x = (x+0.5)/scene.width * 2.0 - 1.0
    let canvas_y = 1.0 - (y+0.5)/scene.height * 2.0
    return new Ray(
        new Point(0,0,0),
        new Vec3(canvas_x,canvas_y,-1).normalize(),
    )
}

for let i=0; i<canvas.width; i++) {
    for let j=0; j<canvas.width; j++) {
        let V = create_prime()
        canvas.setPixel(i,j,trace(V,0))
    }
}
```

