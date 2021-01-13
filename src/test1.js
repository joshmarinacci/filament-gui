
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


import * as tinycolor from "tinycolor2/dist/tinycolor-min.js"
import {length, map, sum, range, sort} from './lists.js'

export class NNull {
    constructor() {
    }
}
class Primitive {
    constructor() {
    }
    log(...args) {
        console.log(this.constructor.name,...args)
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
        this.log("making color from", value)
        if (value.h) {
            this.c = tinycolor(value)
        } else {
            this.r = parseInt(value.substring(1, 3), 16)
            this.g = parseInt(value.substring(3, 5), 16)
            this.b = parseInt(value.substring(5, 7), 16)
            this.log("parsed to", this.r, this.g, this.b)
        }
    }
    toHexColorString() {
        return '#'+[this.r,this.g,this.b]
            .map(c => c.toString(16))
            .map(s => s.length<2?"0"+s:s)
            .join("")
    }
}

export class Point {
    constructor(x,y) {
        this.x = x
        this.y = y
    }
}
class NShape extends Primitive {
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

export class NGradient extends Primitive {
    constructor(list) {
        super();
        this.colors = unbox(list)
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

export class CanvasResult extends Primitive {
    constructor(cb) {
        super()
        this.cb = cb
    }
}

export const EXAMPLES = [
    {
        title:'list',
        code:`[1,2,3]`
    },
    {
        title:"average of list",
        code:`let lis = [1,2,3]
        sum(lis)/length(lis)`
    },
    {
        title:"double list",
        code:`map([1,2,3], x => x*2)`
    },
    {
        title:"add lists",
        code:`add([1,2,3], [4,5,6])`
    },
    {
        title:`list 0 to 20 by 5's`,
        code:`range(0,20,5)`
    },
    {
        title:'last 5 in 0 to 100 by 10s',
        code:`
//-5 to take from the end of the array
take(range(0,100,10), -5)
`
    },
    {
        title:'sort list of people by last name',
        code:`let names = [  
    {first:'Josh', last:'Marinacci'},
    {first:'Billy', last:'Bob'},
    {first:'Zach', last:'Braff'},
]
sort(names,{by:'last'})`
    },
    {
        title:'join two lists',
        code:`join([1,2,3], [4,5,6])`
    },
    {
        title:'select from list where multiple of 7',
        code:`select(range(0,100), {where:x=>x%7===0})`
    },
    {
        title:'count down from 10 to zero',
        code:`reverse(range(0,11))`
    }
    // {
    //     title:'color',
    //     code:`color('#AAFFCC')`
    // },
    // {
    //     title:'color list',
    //     code:`list([color('#FF0000'),color('#00FF00'),color('#0000FF')])`
    // },
    // {
    //     title:'gradient',
    //     code:`gradient(list([color('#FF0000'),color('#00FF00'),color('#0000FF')]))`
    // },
    // {
    //     title:'sample gradient',
    //     code:`sample(gradient(list([color('#FF0000'),color('#00FF00'),color('#0000FF')])),0.5)`
    // },
//     {
//         title:"one circle",
//         code:`circle({radius:scalar(5)})`
//     },
//     {
//         title:'three circles packed',
//         code:`
// let lis1 = list([scalar(1),scalar(2),scalar(3)])
// let lis2 = map(lis1,r=>circle({radius:scalar(r)}))
// let lis3 = pack_row(lis2)
// draw(lis3)`
//     },
//     {
//         title:'genuary4',
//         code:`
// function fillBand(start,size, fill) {
//     return map(range(3),()=>{
//         return circle({
//             radius: scalar(rando(15,15)),
//             center: point({x:rando(0,500),y:rando(start,start+size)}),
//             fill: fill(),
//         })
//     })
// }
// // draw(map(range(1),(i) => {
// //     return fillBand(i*50+25, 0,
// //         () => color({h: 160, s: rando(i*5,i*10), l: rando(0, 100)})
// //         )
// // }))
// draw(fillBand(25,0, ()=> color('#ff00ff')))
// `
//     }

]


function unbox(obj) {
    // console.log("unboxing",obj)
    return obj.value
}
function box(obj) {
    console.log("boxing",obj, obj instanceof Primitive)
    if(obj instanceof Primitive) return obj
    if(typeof obj === 'number') {
        return new NScalar(obj)
    }
    if(Array.isArray(obj)) return new NList(obj)
    if(typeof obj === 'undefined') {
        console.log("undefined it is")
        return new NNull()
    }
    throw new Error(`I cant box ${obj}`)
}

export const SCOPE = {
    "length": {
        title:'length(list)',
        doc:"length of the list",
        type:'function',
        impl: length,
    },
    "sum":{
        title:'sum(list)',
        doc:'add all numbers in the list',
        type:'function',
        impl:sum,
    },
    "map":{
        title:'map(list, fun)',
        doc:'applies `fun` to all elements in the list, returns new list',
        type:"function",
        impl:map
    },
    // "circle":{
    //     type:"function",
    //     title:"circle()",
    //     doc:'makes a circle shape',
    //     args:{
    //         named:{
    //             name:"radius",
    //             type:'scalar'
    //         }
    //     },
    //     returns:'object',
    //     impl:({radius}) => {
    //         let c = new NCircle()
    //         c.fill = 'black'
    //         c.radius = radius
    //         c.center = new Point(0,0)
    //         return c
    //     }
    // },
    // "point":{
    //     type:"function",
    //     title:"point()",
    //     doc:'makes a 2D point',
    //     args:{
    //         named:{
    //             "x":'scalar',
    //             y:'scalar',
    //         }
    //     },
    //     returns:'object',
    //     impl:({x,y}) => {
    //         return new Point(x,y)
    //     }
    // },
    // "pack_row":{
    //     type:'function',
    //     title:'pack_row(list)',
    //     doc:'packs list of shapes left to right, edge to edge',
    //     args:{
    //         indexed:['list']
    //     },
    //     returns:"object",
    //     impl:(lx) => {
    //         let l = unbox(lx).slice()
    //         l.forEach((c,i) => {
    //             if(i===0) {
    //                 c.center = new Point(c.radius,c.radius)
    //                 return
    //             }
    //             let p = l[i-1]
    //             c.center.x = p.center.x+p.radius+c.radius
    //             c.center.y = c.radius
    //         })
    //         return new NList(l)
    //     }
    // },
    // "draw":{
    //     type:'canvas_function',
    //     args:{
    //         indexed:['list']
    //     },
    //     returns:'canvas_result',
    //     impl:(lx) => {
    //         return new CanvasResult(canvas => {
    //             // console.log('drawing to canvas',canvas,lx)
    //             let ll = unbox(lx)
    //             let ctx = canvas.getContext('2d')
    //             ctx.save()
    //             // ctx.translate(0,300)
    //             // ctx.scale(1,-1)
    //             ctx.fillStyle = '#f0f0f0'
    //             ctx.fillRect(0,0,canvas.width,canvas.height)
    //
    //             let canvas_bounds = new Bounds(0,0,canvas.width,canvas.height)
    //             console.log("canvas bounds is",canvas_bounds)
    //             console.log("ll is",ll)
    //             let max_bounds = ll.reduce((acc,shape)=>{
    //                 if(acc.bounds) acc = acc.bounds()
    //                 return acc.union(shape.bounds())
    //             })
    //             if(ll.length === 1) {
    //                 max_bounds = ll[0].bounds()
    //             }
    //             console.log("max bounds is",max_bounds)
    //             let scale = max_bounds.scaleInside(canvas_bounds)
    //             console.log("bounds",canvas_bounds, 'vs',max_bounds,'scales to',scale)
    //
    //             ctx.save()
    //             ctx.scale(scale,scale)
    //             ll.forEach(c => {
    //                 ctx.fillStyle = c.fill
    //                 ctx.beginPath()
    //                 ctx.arc(c.center.x,c.center.y,c.radius,0,Math.PI*2)
    //                 ctx.closePath()
    //                 ctx.fill()
    //             })
    //             ctx.restore()
    //             ctx.restore()
    //         })
    //     }
    // },
    "range":{
        type:'function',
        title:'range(max), range(min,max), range(min,max,step)',
        doc:'generates a list of numbers starting ',
        impl: range,
    },
    "random":{
        type:'function',
        title:'random(min,max)',
        doc:'generate a random number between min and max',
        args:{
            indexed:['min','max'],
        },
        returns:'scalar',
        impl:(min,max) => {
            return Math.random()*(max-min) + min
        }
    }
}