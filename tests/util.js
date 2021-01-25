import fs from 'fs'
import ohm from "ohm-js"
import test from "tape"
import tp from "tape-approximately"
import {add, cos, divide, factorial, multiply, power, sin, subtract, tan} from '../src/math.js'
import {drop, join, length, map, range, reverse, select, sort, sum, take} from '../src/lists.js'
export const REQUIRED = Symbol('REQUIRED')
export class FilamentFunction {
    constructor(name,params, fun) {
        this.name = name
        this.params = params
        this.fun = fun
    }
    log() {
        let args = Array.prototype.slice.call(arguments)
        console.log('###',this.name.toUpperCase(),...args)
    }
    apply_function(args) {
        console.log("applying args",args)
        console.log("to the function",this.name)
        let params = Object.entries(this.params).map(([key,value]) =>{
            console.log("looking at",key,'=',value)
            console.log("remaining args",args)
            //look for matching arg
            let n1 = args.findIndex(a => a.type === 'named' && a.name === key)
            if(n1 >= 0) {
                console.log("found named ", args[n1])
                let arg = args[n1]
                args.splice(n1,1)
                return arg.value
            } else {
                //grab the first indexed parameter we can find
                console.log("finding indexed")
                let n = args.findIndex(a => a.type === 'indexed')
                if(n >= 0) {
                    console.log("found", args[n])
                    let arg = args[n]
                    args.splice(n,1)
                    return arg.value
                } else {
                    console.log("no indexed found")
                    console.log("checking for default",value)
                    if(value === REQUIRED) throw new Error(`parameter ${key} is required`)
                    return value
                }
            }
        })
        return this.apply_with_parameters(params)
    }
    apply_with_parameters(params) {
        this.log("running with params",params)
        return this.fun.apply(this,params)
    }
}

// let source, grammar, semantics
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

class Callsite {
    constructor(scope, name, args) {
        this.type = 'funcall'
        this.scope = scope
        this.name = name
        this.args = args
        // console.log("created callsite",name,args)
    }
    apply() {
        // console.log("applying",this.name,this.args)
        //evaluate any function args
        let args = this.args.map(arg => {
            if(arg.type === 'funcall') return arg.apply()
            return arg
        })
        // console.log("applied args",args)
        return this.scope[this.name].apply(null,args)
    }
    applyWithPipeline(val) {
        let args = this.args.slice()
        args.unshift(val)
        //evaluate any function args
        args = args.map(arg => {
            if(arg.type === 'funcall') return arg.apply()
            return arg
        })
        return this.scope[this.name].apply(null,args)
    }
}


function init_parser(scope) {
    let source = fs.readFileSync(new URL('../src/grammar.ohm', import.meta.url)).toString();
    let grammar = ohm.grammar(source);
    let semantics = grammar.createSemantics();
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
            // console.log(`funcall '${fun_name}' args:`,args)
            if(!scope.hasOwnProperty(fun_name)) throw new Error(`no such function ${fun_name}`)
            return scope[fun_name].apply_function(args)
            // return scope[fun_name].fun.apply(null,args)
        },

    })
    return {
        source, grammar, semantics
    }
}

export function tests(msg,arr, opts) {
    let scopes = scope
    if(opts && opts.scope) scopes = opts.scope
    let parser = init_parser(scopes)
    test(msg, (t)=>{
        arr.forEach((tcase) => {
            let str = tcase[0];
            let ans = tcase[1];
            let m = parser.grammar.match(str)
            if(m.failed()) throw new Error("match failed on: " + str);
            let sem = parser.semantics(m);
            // return t.approximately(res.getValue(), ans, 0.001);
            let val = sem.calc()
            return t.deepEqual(val,ans);
        });
        t.end();
    });
}
