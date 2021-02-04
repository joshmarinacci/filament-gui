import fs from 'fs'
import test from "tape"
import tp from "tape-approximately"
import {
    add, and,
    cos,
    divide, equal,
    factorial,
    greaterthan, greaterthanorequal,
    lessthan, lessthanorequal, mod,
    multiply,
    negate, notequal, or,
    power,
    sin,
    subtract,
    tan
} from '../src/lang/math.js'
import {drop, join, length, map, range, reverse, select, sort, sum, take} from '../src/lang/lists.js'
import {Parser} from '../src/lang/parser.js'
import {Scope} from '../src/lang/ast.js'

tp(test)

let grammar_source = fs.readFileSync(new URL('../src/lang/filament.ohm', import.meta.url)).toString();

export function tests(msg,arr, opts) {
    let scope = new Scope()
    scope.install(add, subtract, multiply, divide, power, negate, mod)
    scope.install(sum, length, range, join, take, reverse)
    scope.install(lessthan, greaterthan, equal, notequal, lessthanorequal, greaterthanorequal, and,or)

    let parser = new Parser(scope, grammar_source)
    test(msg, (t)=>{
        let proms = arr.map((tcase) => {
            let str = tcase[0];
            let ans = tcase[1];
            let m = parser.parse(str)
            if(m.failed()) throw new Error("match failed on: " + str);
            let val = parser.ast(m).evalJS(scope)
            return Promise.resolve(val).then(v => {
                if(v.evalJS) v = v.evalJS()
                t.deepEqual(v,ans);
            })
        });
        Promise.allSettled(proms)
            .then(()=> t.end())
            .catch(e =>console.log("error",e))
    });
}
