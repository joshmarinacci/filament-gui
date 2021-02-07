import {boolean, list, scalar, Scope} from '../ast.js'
import fs from 'fs'
import {
    add, and, convertunit,
    divide, equal,
    factorial, greaterthan, greaterthanorequal,
    is_prime,
    lessthan,
    lessthanorequal,
    mod,
    multiply,
    negate, not, notequal, or,
    power,
    subtract
} from '../math.js'
import {drop, get_field, join, length, map, range, reverse, select, sort, sum, take} from '../lists.js'
import {dataset} from '../dataset.js'
import {Parser} from '../parser.js'

//objects should be same
export const t = async (s,a) => expect(eval_code(s)).resolves.toEqual(a)
export const s = (v,u) => scalar(v,u)
export const b = (v) => boolean(v)
export const l = (...vals) => list(vals.map(v => scalar(v)))
export const all = async (tests) => await tests.map(tt => t(tt[0],tt[1]))
export const all_close_scalar = async (tests) => await tests.map(tt => ta(tt[0],tt[1]))
// objects should be close to the same
export const ta = async (s,a) => {
    return Promise.resolve(eval_code(s)).then(v=>{
        expect(v.value).toBeCloseTo(a.value)
        expect(v.unit).toEqual(v.unit)
    })
}

let parser
let scope


export function setup_parser() {
    let g2_source = fs.readFileSync("src/lang/filament.ohm").toString()
    scope = new Scope('eval_ast')
    scope.install(add,subtract,multiply,divide, power,mod, negate, factorial, is_prime)
    scope.install(lessthan,lessthanorequal,equal,notequal,greaterthanorequal,greaterthan,and,or,not)
    scope.install(range,length,take,drop,join,reverse,map, get_field, select,sort,sum)
    scope.install(dataset)
    scope.install(convertunit)
    scope.set_var('pi',scalar(Math.PI))
    parser = new Parser(scope,g2_source)

}

async function eval_code(code) {
    let match = parser.parse(code)
    if(match.failed()) throw new Error("match failed")
    let ast = parser.ast(match)
    return await ast.evalFilament(scope)
}

