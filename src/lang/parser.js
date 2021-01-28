/*

React hands string to parser. Wants result back. Must be async.
wants to use a 'standard' scope.



unit tests hand string to parser, wants result back. wants to use a custom
scope.

if parsing error, hand back an error result?
if function crashes, throw a real error?

option to enable or disable units

scope is an array of functions so we can easily slice and dice it.

*/

import fs from 'fs'
import ohm from 'ohm-js'
import {add, divide, factorial, multiply, power, subtract} from './math.js'

export const REQUIRED = Symbol('REQUIRED')

export class Parser {
    constructor(scope) {
        this.scope = scope
        this.init(this.scope)
    }
    init(scope) {
        this.grammar_source = fs.readFileSync(new URL('grammar.ohm', import.meta.url)).toString();
        this.grammar = ohm.grammar(this.grammar_source);
        this.semantics = this.grammar.createSemantics();
        this.semantics.addOperation('calc',{
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

            Arg_indexed_arg: function(a) {
                return {
                    type:'indexed',
                    value:a.calc(),
                }
            },
            Arg_named_arg: function(a,b,c) {
                // console.log("named arg",a.calc(),b.calc(),c.calc())
                return {
                    type:'named',
                    name:a.calc(),
                    value:c.calc(),
                }
            },
            Funcall_with_args:function(a,_1,c,d,e,_2) {
                let fun_name = a.calc()
                let args = [c.calc()].concat(e.calc())
                if(!scope.hasOwnProperty(fun_name)) throw new Error(`no such function ${fun_name}`)
                return new Callsite(scope, fun_name, args)
            },
            Funcall_noargs:function(a,b,c) {
                let fun_name = a.calc()
                return new Callsite(scope,fun_name,[])
            },
            PriExp_pipeline_right:function(a,_,b) {
                let fa = a.calc()
                let fb = b.calc()
                let va =  fa.apply()
                return fb.applyWithPipeline(va)
            }
        })
    }
    parse(code) {
        return this.grammar.match(code)
    }
    calc(match) {
        let sem = this.semantics(match);
        return sem.calc()
    }
}

class Callsite {
    constructor(scope, name, args) {
        this.type = 'funcall'
        this.scope = scope
        this.name = name
        this.args = args
        console.log("created callsite",name,args)
    }
    apply() {
        return this.scope[this.name].apply_function(this.args)
    }
    applyWithPipeline(val) {
        let args = this.args.slice()
        let arg = {
            type:'indexed',
            value:val,
        }
        args.unshift(arg)
        //evaluate any function args
        return this.scope[this.name].apply_function(args)
    }
}

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