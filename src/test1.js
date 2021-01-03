
/*

- Output numbers strings lists colors, lists of colors
- Nested react views
- Test colors to gradients golden sampling
- Design smallest ray tracer with loop over pixels
- design list functions for size, sum, average, map
- design circle and packing and drawing


4  prints Scalar 4
"foo" prints String "foo"
[1,2,3]  prints List [1,2,3]
#AAFFCC  prints Color AAFFCC [color swatch]

[#FF0000, #00FF00, #0000FF] prints List [red swatch, green swatch, blue swatch]

[#FF0000, #00FF00, #0000FF] => colors    prints colors assigned to List [red swatch, green swatch, blue swatch]

Gradient(colors) => rgb   prints Gradient (visual gradient swatch, width of the notebook) assigned to rgb

sample(rgb, 0.5)    prints color halfway through the gradient as a swatch

[1,2,3] => list prints List [1,2,3] assigned to list
size(list) prints Scalar 3
sum(list) prints Scalar 6
define average(list) as sum(list)/size(list)  prints define function average as sum(list)/size(list)
average(list) prints Scalar 2

map(list, x=>x*2)  prints List [2,4,6]

Circle(radius:5) prints  Circle(center:Point(0,0), radius: 5)

map([1,2,3], r=>Circle(radius:r)) => pack_row() => draw_scaled()    draws three circles to scale, no bigger than 600x300

open questions
* syntax for the anonymous inline functions that is compact but understandable
* how does the pipeline operator work
* how do you get docs for the functions?
* how do named arguments work for the implementation of the functions?

*/

class Primitive {
    constructor() {
    }
    log(...args) {
        console.log("Prim",...args)
    }
}

export class NScalar extends Primitive {
    constructor(value) {
        super()
        this.log("Making scalar",value)
        this.value = value
    }
}
export class NString extends Primitive {
    constructor(value) {
        super();
        this.log("Making string",value)
        this.value = value
    }
}

export class NList extends Primitive {
    constructor(value) {
        super()
        this.log("making list from",value)
        this.value = value
    }
}


export class NColor extends Primitive {
    constructor(value) {
        super();
        this.log("making color from",value)
        this.value = parseInt(value.substring('#'.length),16)
        this.log("parsed to",this.value)
    }
}

class Point {
    constructor(x,y) {
        this.x = x
        this.y = y
    }
}
class Circle extends Primitive {
    constructor() {
        super();
        this.radius = 10;
        this.center = new Point(0,0)
    }
}

class Bounds {
    constructor(x,y,w,h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
}

class CanvasResult extends Primitive {
    constructor(cb) {
        super()
        this.cb = cb
    }
}

export const EXAMPLES = [
    {
        title:'number',
        code:`scalar(4)`
    },
    {
        title:'string',
        code:`string("foo")`
    },
    {
        title:'list',
        code:`list([scalar(1),scalar(2),scalar(3)])`
    },
    {
        title:'color',
        code:`color('#AAFFCC')`
    },
    {
        title:'color list',
        code:`list([color('#FF0000'),color('#00FF00'),color('#0000FF')])`
    },
    {
        title:'gradient',
        code:`gradient(list([color('#FF0000'),color('#00FF00'),color('#0000FF')]))`
    },
    {
        title:'sample gradient',
        code:`sample(gradient(list([color('#FF0000'),color('#00FF00'),color('#0000FF')])),0.5)`
    },
    {
        title:"size of list",
        code:`
            let lis = list([scalar(1),scalar(2),scalar(3)])
            size(lis)
        `
    },
    {
        title:"sum of list",
        code:`
            let lis = list([scalar(1),scalar(2),scalar(3)])
            sum(lis)
        `
    },
    {
        title:"average of list",
        code:`
            let lis = list([scalar(1),scalar(2),scalar(3)])
            average(lis)
        `
    },
    {
        title:"double list",
        code:`
            let lis = list([scalar(1),scalar(2),scalar(3)])
            map(lis, x => x*2)
        `
    },
    {
        title:"one circle",
        code:`
            circle({radius:scalar(5)})
        `
    },
    {
        title:'three circles packed',
        code:`
            let lis1 = list([scalar(1),scalar(2),scalar(3)])
            let lis2 = map(lis1,r=>circle({radius:scalar(r)))
            let lis3 = pack_row(lis2),
            draw_scaled(lis3)
        `
    }

]



export const SCOPE = {
    "size": {
        title:'size',
        type:'function',
        args:{
            indexed:["List"]
        },
        returns:'scalar',
        impl:(l) => new NScalar(l.value.length),
    },
    "sum":{
        type:'function',
        args:{
            indexed:["List"]
        },
        returns:'scalar',
        impl:(l) => new NScalar(l.value.reduce((acc,v)=>(acc + v.value),0))
    },
    "average":{
        type:'function',
        args:{
            indexed:["List"]
        },
        returns:"scalar",
        impl:(l) => new NScalar(SCOPE.sum.impl(l).value/SCOPE.size.impl(l).value)
    },
    "map":{
        type:"function",
        args:{
            indexed:["List","lambda"]
        },
        returns:"list",
        impl:(l,lam) => new NList(l.value.map((v)=>{
            return new NScalar(lam(v.value))
        }))
    },
    "circle":{
        type:"function",
        args:{
            named:{
                name:"radius",
                type:'scalar'
            }
        },
        returns:'object',
        impl:({radius}) => {
            let c = new Circle()
            c.fill = 'black'
            c.radius = radius
            c.center = new Point(0,0)
        }
    },
    "pack_row":{
        type:'function',
        args:{
            indexed:['list']
        },
        returns:"object",
        impl:(l) => {
            l = l.slice()
            l.forEach((c,i) => {
                if(i===0) {
                    c.center = new Point(c.radius,c.radius)
                    return
                }
                let p = l[i-1]
                c.center.x = p.center.x+p.radius+c.radius
                c.center.y = c.radius
            })
        }
    },
    "draw":{
        type:'canvas_function',
        args:{
            indexed:['list']
        },
        returns:'canvas_result',
        impl:(l) => {
            return new CanvasResult(canvas => {
                let ctx = canvas.getContext('2d')
                ctx.fill = 'gray'
                ctx.fillRect(0,0,canvas.width,canvas.height)

                let canvas_bounds = new Bounds(0,0,canvas.width,canvas.height)

                let max_bounds = l.reduce((a,b)=>{
                    if(!a) return b.bounds()
                    return a.bounds().union(b.bounds())
                })
                let scale = max_bounds.scaleInside(canvas_bounds)

                ctx.save()
                ctx.scale(scale,scale)
                l.forEach(c => {
                    ctx.fill = c.fill
                    ctx.beginPath()
                    ctx.arc(c.center.x,c.center.y,c.radius,0,Math.PI*2)
                    ctx.close()
                    ctx.fill()
                })
                ctx.restore()
            })
        }
    }

}