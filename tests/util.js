import fs from 'fs'
import ohm from "ohm-js"
import test from "tape"
import tp from "tape-approximately"
import {add, cos, divide, factorial, multiply, power, sin, subtract, tan} from '../src/math.js'
import {drop, join, length, map, range, reverse, select, sort, sum, take} from '../src/lists.js'


let source, grammar, semantics
const scope = {
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
}


tp(test)

function init_parser() {
    source = fs.readFileSync(new URL('../src/grammar.ohm', import.meta.url)).toString();
    grammar = ohm.grammar(source);
    semantics = grammar.createSemantics();
    semantics.addOperation('calc',{
        ident:function(first,rest) {
            return first.calc() + "" + rest.calc().join("")
        },
        number_integer:function(a) {
            return parseInt(a.sourceString)
        },
        number_float:function(a,b,c) {
            return parseFloat(a.sourceString + b.sourceString + c.sourceString)
        },
        string:function(a,b,c) {
            return b.sourceString
        },
        List_full:function(a,b,c,d,e) {
            let list = d.calc().slice()
            list.unshift(b.calc())
            return list
        },
        _terminal: function() {
            // console.log("terminal",this)
            return this.sourceString;
        },


        OprExp_binop:function(a,b,c) {
            let op = b.calc()
            let va = a.calc()
            let vc = c.calc()
            if(op === '+') return add(va,vc)
            if(op === '-') return subtract(va,vc)
            if(op === '*') return multiply(va,vc)
            if(op === '/') return divide(va,vc)
            if(op === '**') return power(va,vc)
            throw new Error(`unknown binary operator ${op}`)
        },
        OprExp_unop:function(a,b) {
            let op = a.calc()
            let val = b.calc()
            if(op === '!') return factorial(val)
            throw new Error(`unknown unary operator ${op}`)
        },
        PriExp_neg:function(a,b) {
            return -b.calc()
        },

        Funcall_with_args:function(a,_1,c,d,e,_2) {
            let fun_name = a.calc()
            let args = [c.calc()].concat(e.calc())
            console.log("funcall",fun_name,args)
            if(scope[fun_name]) {
                return scope[fun_name].apply(null,args)
            } else {
                throw new Error(`no such function ${fun_name}`)
            }
        },

    })
}

init_parser()

export function tests(msg,arr) {
    test(msg, (t)=>{
        arr.forEach((tcase) => {
            let str = tcase[0];
            let ans = tcase[1];
            let m = grammar.match(str)
            // console.log("m is",m)
            if(m.failed()) throw new Error("match failed on: " + str);
            let sem = semantics(m);
            // console.log(sem.calc())

            // if(res.type === 'funcall') {
            //     res = res.invoke();
            // }
            // if(res.type === 'string') {
            //     return t.equal(res.string, ans);
            // }
            // return t.approximately(res.getValue(), ans, 0.001);
            let val = sem.calc()
            // console.log("comparing",val,ans)
            return t.deepEqual(val,ans);
        });
        t.end();
    });
}
