import {
    add,
    and,
    cos,
    divide,
    equal, factorial,
    greaterthan, greaterthanorequal, lessthan, lessthanorequal,
    mod,
    multiply,
    negate, not,
    notequal,
    or,
    power,
    sin,
    subtract,
    tan
} from './math.js'
import {drop, join, map, reverse, select, sort, sum, take, range, length, get_field} from './lists.js'
import {chart, histogram, timeline} from './chart.js'
import {dataset, stockhistory} from './dataset.js'

import {default as src} from "./filament.ohm"
import {Parser} from './parser.js'
import {Scope} from './ast.js'
import {convertunit} from './units.js'

let scope = new Scope("lang")
scope.install(add, subtract, multiply, divide, power, negate, mod, factorial)
scope.install(lessthan, greaterthan, equal, notequal, lessthanorequal, greaterthanorequal,or,and,not)
scope.install(range,length,take,drop,join,reverse,map, sort, sum, get_field)
scope.install(dataset, stockhistory)
scope.install(convertunit)
scope.install(chart, timeline, histogram)

export async function real_eval2(code) {
    // console.log("really evaluating",code)
    // console.log("src is",src)
    return fetch(src).then(r => r.text()).then(txt => {
        // console.log("got the text",txt)
        let parser = new Parser(scope,txt)
        let m = parser.parse('{'+code+'}')
        // console.log("match",m)
        if(m.failed()) throw new Error("match failed on: " + code);
        let ast = parser.ast(m)
        return Promise.resolve(ast.evalFilament(scope))
    })
}