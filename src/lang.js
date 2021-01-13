import {CanvasResult, NCircle, NColor, NGradient, NList, NScalar, NString, Point, SCOPE} from './test1.js'
import {add, divide, multiply, subtract} from './math.js'
import {drop, join, map, sort, take} from './lists.js'

export const is_error_result = (result) => result instanceof Error
export const is_scalar = (val) => (val instanceof NScalar) || (typeof val === 'number')
export const is_string = (val) => (val instanceof NString || (typeof val === 'string'))
export const is_list   = (val) => val instanceof NList || Array.isArray(val)
export const is_color  = (val) => val instanceof NColor
export const is_canvas_result = (val) => val instanceof CanvasResult
export function is_gradient(result) {
    return result instanceof NGradient
}

export const scope = {
    // foo: () => console.log("doing foo"),
    // scalar: (v) => new NScalar(v),
    // string: v => new NString(v),
    color: v => new NColor(v),
    gradient: v => new NGradient(v),
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide,
    // circle: v => new NCircle(v),
    // point: v => new Point(v.x,v.y),
    // pack_row: SCOPE.pack_row.impl,
    // draw: SCOPE.draw.impl,
    length: SCOPE.length.impl,
    sum: SCOPE.sum.impl,
    range: SCOPE.range.impl,
    map: map,
    take: take,
    drop: drop,
    sort: sort,
    join: join,

    // rando: SCOPE.rando.impl,
}



export function real_eval(code) {

    let lines = code.split("\n")
    lines[lines.length - 1] = 'return ' + lines[lines.length - 1]

    let defines = Object.keys(scope).map(key => {
        return `    const ${key} = scope.${key}`
    }).join("\n")
    let gen_code = `
"use strict"; 
return function(scope) {
${defines}
${lines.join("\n")}
};
`
    console.log("generated code is", gen_code)
    try {
        return Function(gen_code)()(scope)
    } catch (e) {
        console.error(e)
        return e
    }
}