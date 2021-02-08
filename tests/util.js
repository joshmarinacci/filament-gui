import fs from 'fs'
import test from "tape"
import tp from "tape-approximately"
import {
    add, and, convertunit,
    cos,
    divide, equal,
    factorial,
    greaterthan, greaterthanorequal, is_prime,
    lessthan, lessthanorequal, mod,
    multiply,
    negate, not, notequal, or,
    power,
    sin,
    subtract,
    tan
} from '../src/lang/math.js'
import {drop, get_field, join, length, map, range, reverse, select, sort, sum, take} from '../src/lang/lists.js'
import {FilamentFunction, Parser} from '../src/lang/parser.js'
import {scalar, Scope, unpack} from '../src/lang/ast.js'
import {dataset} from '../src/lang/dataset.js'

tp(test)

const func = new FilamentFunction("func",{data:null},(data)=>data)
const funk = new FilamentFunction("funk",{data:null},(data)=>data)


let g2_source = fs.readFileSync(new URL("../src/lang/filament.ohm", import.meta.url)).toString()


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

export function verify_ast(name, tests) {
    let scope = new Scope('verify_ast')
    scope.install(add, subtract, multiply, divide, power, negate, mod, factorial)
    scope.install(lessthan, greaterthan, equal, notequal, lessthanorequal, greaterthanorequal,or,and,not)
    scope.install(func,funk)
    scope.install(convertunit)
    let parser = new Parser(scope,g2_source)
    test(name, (t)=>{
        Promise.allSettled(tests.map((tcase) => {
            // console.log("tcase",tcase)
            let [code,obj,str,val] = tcase
            let match = parser.parse(code)
            let ast = parser.ast(match)
            // console.log("ast",ast)
            t.deepLooseEqual(ast,obj)
            // console.log("to string",ast.toString())
            t.deepEqual(ast.toString(),str)
            let prom = ast.evalJS(scope)
            return Promise.resolve(prom)
                .then(res => {
                    // console.log("final result",res)
                    return unpack(res)
                })
                .then((res)=> t.deepEqual(res,val))
        })).then(()=>t.end())
    })
}

export function eval_ast(name, tests) {
    let scope = new Scope('eval_ast')
    scope.install(add,subtract,multiply,divide, power,mod, negate, factorial, is_prime)
    scope.install(lessthan,lessthanorequal,equal,notequal,greaterthanorequal,greaterthan,and,or,not)
    scope.install(range,length,take,drop,join,reverse,map, get_field, select,sort,sum)
    scope.install(dataset)
    scope.install(convertunit)
    scope.set_var('pi',scalar(Math.PI))
    let parser = new Parser(scope,g2_source)
    test(name, t => {
        Promise.allSettled(tests.map(tcase => {
            // console.log("eval ast test case",tcase)
            let [code,val] = tcase
            let match = parser.parse(code)
            if(match.failed()) t.error()
            let ast = parser.ast(match)
            // console.log("ast",ast)
            return Promise.resolve(ast.evalFilament(scope))
                .then(r => {
                    // console.log("testing",val,'vs',r)
                    if(is_scalar(val)) {
                        t.approximately(r.value,val.value,0.1)
                        t.equal(r.unit,val.unit)
                        return
                    }
                    t.deepEqual(r,val)
                })
                .catch(e => {
                    console.log("error here",e)
                    t.fail()
                })
        })).then(() => t.end())
            .catch(e => {
                console.log("error after")
                console.error(e)
            })
    })
}
