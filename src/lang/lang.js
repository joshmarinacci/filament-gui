import {add, cos, divide, multiply, power, sin, subtract, tan} from './math.js'
import {drop, join, map, reverse, select, sort, sum, take, range, length} from './lists.js'
import {chart, histogram, timeline} from './chart.js'
import {dataset, stockhistory} from './dataset.js'

import {default as src} from "./filament.ohm"
import {Parser} from './parser.js'
import {Scope} from './ast.js'

let scope = new Scope()
scope.install(add,subtract,multiply,divide, power)
scope.install(range)
scope.install(take)
scope.install(join)
scope.install(reverse)
scope.install(length)
scope.install(chart)
scope.install(dataset)
scope.install(timeline)

export async function real_eval2(code) {
    // console.log("really evaluating",code)
    // console.log("src is",src)
    return fetch(src).then(r => r.text()).then(txt => {
        // console.log("got the text",txt)
        let parser = new Parser(scope,txt)
        let m = parser.parse(code)
        // console.log("match",m)
        if(m.failed()) throw new Error("match failed on: " + code);
        let ast = parser.ast(m)
        return Promise.resolve(ast.evalFilament(scope))
    })
}