import {add, cos, divide, multiply, power, sin, subtract, tan} from './math.js'
import {drop, join, map, reverse, select, sort, sum, take, range, length} from './lists.js'
import {chart, histogram, timeline} from './chart.js'
import {dataset, stockhistory} from './dataset.js'

import {default as src} from "./grammar.ohm"
import {Parser} from './parser.js'
export const scope = {
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide,
    power:power,

    sin:sin,
    cos:cos,
    tan:tan,

    length: length,
    sum: sum,
    range: range,
    map: map,
    take: take,
    drop: drop,
    sort: sort,
    join: join,
    select: select,
    reverse:reverse,

    dataset:dataset,
    stockhistory:stockhistory,

    chart:chart,
    histogram:histogram,
    timeline:timeline,
}


export async function real_eval2(code) {
    console.log("really evaluating",code)
    console.log("src is",src)
    return fetch(src).then(r => r.text()).then(txt => {
        console.log("got the text",txt)
        let parser = new Parser(scope,txt)
        let m = parser.parse(code)
        console.log("match",m)
        if(m.failed()) throw new Error("match failed on: " + code);
        let val = parser.calc(m)
        if(val.type === 'funcall')  val = val.apply()
        console.log("value",val)
        return val
    })
    // let parser = new Parser(scope,src)
    // return -99
}
export async function real_eval(code) {

    let lines = code.split("\n")
    lines[lines.length - 1] = 'return ' + lines[lines.length - 1]

    let defines = Object.keys(scope).map(key => {
        return `    const ${key} = scope.${key}`
    }).join("\n")
    let gen_code = `
${defines}
async function foos() { 
   ${lines.join("\n")}
}
return foos()
`
    console.log("generated code is", gen_code)
    try {
        // let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
        // console.log("async function is",AsyncFunction)
        // let func = new AsyncFunction('scope',gen_code)
        let func = new Function('scope',gen_code)
        console.log("made the function",func)
        return func(scope)
    } catch (e) {
        console.error(e)
        return e
    }
}