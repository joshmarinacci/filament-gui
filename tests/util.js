import fs from 'fs'
import test from "tape"
import tp from "tape-approximately"
import {add, cos, divide, factorial, multiply, power, sin, subtract, tan} from '../src/lang/math.js'
import {drop, join, length, map, range, reverse, select, sort, sum, take} from '../src/lang/lists.js'
import {Parser} from '../src/lang/parser.js'

// let source, grammar, semantics
const SCOPE = {
    add, subtract, multiply, divide, power,
    // sin:sin,
    // cos:cos,
    // tan:tan,
    drop, length, sum, range, join, take, reverse,
}


tp(test)


let grammar_source = fs.readFileSync(new URL('../src/lang/grammar.ohm', import.meta.url)).toString();

export function tests(msg,arr, opts) {
    let scope = SCOPE
    if(opts && opts.scope) scope = opts.scope
    let parser = new Parser(scope, grammar_source)
    test(msg, (t)=>{
        arr.forEach((tcase) => {
            let str = tcase[0];
            let ans = tcase[1];
            let m = parser.parse(str)
            if(m.failed()) throw new Error("match failed on: " + str);
            // let sem = parser.semantics(m);
            // return t.approximately(res.getValue(), ans, 0.001);
            let val = parser.calc(m)
            if(val.type === 'funcall')  val = val.apply()
            return t.deepEqual(val,ans);
        });
        t.end();
    });
}
