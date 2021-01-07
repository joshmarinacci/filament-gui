# notebook lang

This is a language for doing exploratory programming and visualizations.  It is reactive and organized
around flows of data.  

# features

* assign variables only once
* heavy use of functional features like map and foreach
* pipeline operator to chain things together
* built in vis libs for drawing, graphs, random number generation, and vectors
* unit based numbers with conversions
* forgiving syntax


# Standard Functions

* __rando__: random numbers. (), (max), (min,max)
* __map__:  convert every element in a list using a lambda function: (list, lam)
* __sin__, __cos__, __tan__: the usual trig functions
* __point__: a two component vector
* __range__: produces a list of numbers. (min?,max,step=1)

# Examples:


Genuary 5:  a loop of translucent circles

```javascript
const rando = (min, max) => Math.random()*(max-min) + min
let c = document.querySelector(canvas_id).getContext('2d')
let w = 300
c.save()
c.translate(w,600-w)
c.scale(1,-1)
c.fillStyle = 'white'
c.fillRect(0,0,w*2,w*2)
for(let n=0; n<10000; n++) {
    let th = (n/50.0)
    let jit = r(-10,10)
    let s = 10+n/50
    let x = Math.sin(th*2+n/20)*s
    let y = Math.cos(th*3)*s
    c.fillStyle = `hsla(${((n/130)+0)%360},100%,${10+n/130}%,0.2)`
    c.beginPath()
    c.arc(x+jit,y+jit,r(5,10), 0, Math.PI*2)
    c.closePath()
    c.fill()
}
c.restore()
```

```notelang
range(10_000) 
    -> map(n => {
        let Ø = n/50
        return circle (
            fill: hsla(n/130 % 360, 100%, (10+n/130)%,20%)
            center: vec2(  sin(Ø*2+n/20), cos(Ø*3) ) * (10+n/50) + rando(-10,10)
            radius: rando(5,10)
        )
    })
    -> draw()
```


```javascript
    let tri1 = [pt(200,200), pt(400,200), pt(300,400)]
    let triangles = random_split(tri1)

    function draw_circle_triangle(c, t, fill) {
        let A = t[0], B = t[1], C = t[2]
        const circle_line = (A,B) => {
            let AB = B.minus(A)
            let D = AB.rotate(toRad(60)).add(A)
            let LEN = A.distance(B)
    
            c.fillStyle = `hsla(${100+randi(5)*40},100%,50%,0.05)`
            c.beginPath()
            c.arc(D.x,D.y, LEN, 0, Math.PI*2)
            c.fill()
            c.fill()
        }
        circle_line(A,B)
        circle_line(B,C)
        circle_line(C,A)
    }

    function random_split(t) {
        let side = 0//randi(3)
        const pp = (n) => t[(n%t.length)]
        let  p = pt( (pp(side).x + pp(side+1).x)/2, (pp(side).y + pp(side+1).y)/2)
        let t1 = [pp(side),p,pp(side+2)]
        let t2 = [p,pp(side+1),pp(side+2)]
        return [t1,t2]
    }
    
    ts.forEach(t => draw_circle_triangle(c,t,'red'))

```

```notelang

    function split(t) {
        let [A,B,C] = t
        let D = (A+B)/2
        return [
            [A,D,C,
            [D,B,C]
        ]
    }

    function draw_circle_triangle(t) {
        const circle_line = (A,B) => {
            let D = Rot2D(60deg) * (B-A) + A
            let LEN = Magnitude(B-A)
            return circle(
                fill : hsla(100+randi(5)*40, 100%, 50%, 5%))
                center: D,
                radius: LEN,
            )
        }
        let [A,B,C] = t
        return [circle_line(A,B), circle_line(B,C), circle_line(C,A)]
    }
    
    let tri1 = [vec2(200,200), vec2(400,200), vec2(300,400)]
    let triangles = random_split(tri1)
    map(triangles, draw_circle_triangle) -> draw
    
```