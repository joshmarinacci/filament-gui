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
            // console.log("funcall",fun_name,args)
            //evaluate any function args
            args = args.map(arg => {
                if(arg.type === 'funcall') return arg.apply()
                return arg
            })
            if(scope[fun_name]) {
                return {
                    fun:scope[fun_name],
                    name:fun_name,
                    args:args,
                    apply:()=>scope[fun_name].apply(null,args),
                    type:'funcall',
                }
                // return scope[fun_name].apply(null,args)
            } else {
                throw new Error(`no such function ${fun_name}`)
            }
        },

        Funcall_noargs:function(a,_1,_2) {
            let fun_name = a.calc()
            let args = []
            return {
                fun:scope[fun_name],
                name:fun_name,
                args:[],
                apply:()=>scope[fun_name].apply(null,args),
                type:'funcall',
            }
        },

        PriExp_pipeline_right:function(a,b,c) {
            let f1 = a.calc()
            let f2 = c.calc()
            // console.log("pipeline right", f1, f2)

            let r1 = f1.fun.apply(null,f1.args)
            // console.log("r1",r1)
            let a2 = f2.args.slice()
            a2.unshift(r1)
            let r2 = f2.fun.apply(null,a2)
            // console.log("r2",r2)
            return r2
        }

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
            if(val.type === 'funcall') {
                console.log("doing funcall",str)
                val = val.apply()
            }
            // console.log("comparing",val,ans)
            return t.deepEqual(val,ans);
        });
        t.end();
    });
}
