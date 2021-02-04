/*

// React hands string to parser. Wants result back. Must be async.
// wants to use a 'standard' scope.
// unit tests hand string to parser, wants result back. wants to use a custom
// scope.

hook up simple tests too
Use parser to run code in react
rewrite all std lib using filament functions

if parsing error, hand back an error result?
if function crashes, throw a real error?
option to enable or disable units?
scope is an array of functions so we can easily slice and dice it.
assemble a scope separate from the parser / evaluator

*/

import ohm from 'ohm-js'
import {
    block,
    boolean,
    call,
    fundef,
    ident,
    indexed,
    list,
    named,
    pipeline_left,
    pipeline_right,
    scalar,
    string
} from './ast.js'

export const REQUIRED = Symbol('REQUIRED')

const strip_under = s => s.replaceAll("_","")
export class Parser {
    constructor(scope, grammar_source) {
        this.scope = scope
        this.grammar_source = grammar_source
        this.init(this.scope)
    }
    init(scope) {
        this.grammar = ohm.grammar(this.grammar_source);
        this.semantics = this.grammar.createSemantics();
        this.semantics.addOperation('ast',{

            _terminal: function() {  return this.sourceString;  },
            unitnumber:(v,u) => scalar(v.ast(),u.ast()),
            number_whole:function(a) {
                return scalar(parseInt(strip_under(a.sourceString)))
            },
            number_hex:function(_,a) {
                return scalar(parseInt(strip_under(a.sourceString),16))
            },
            number_fract:function(a,b,c) {
                return scalar(parseFloat(strip_under(a.sourceString + b.sourceString + c.sourceString)))
            },
            unit:function(u) {
                let name = u.sourceString
                if(UNITS[name]) return UNITS[name]
                throw new Error(`unknown unit type '${name}'`)
            },
            bool: (a) => boolean(parseBoolean(a.sourceString)),

            string: (_1,str,_2) => string(str.sourceString),

            ident: function(i,i2) {
                return ident(this.sourceString)
            },

            NonemptyListOf:function(a,b,c) {
                return [a.ast()].concat(c.ast())
            },
            EmptyListOf:function() {
                return []
            },
            List:function(a,b,c) {
                return list(b.ast())
            },

            BinExp:function(a,b,c) {
                let op = b.ast()
                if(BINOPS[op]) return call(BINOPS[op],[indexed(a.ast()),indexed(c.ast())])
                throw new Error(`Unknown operator: ${op}`)
            },

            UnExp:function(a,b) {
                let op = a.ast()
                if(UNOPS[op]) return call(UNOPS[op],[indexed(b.ast())])
                throw new Error(`Unknown operator: ${op}`)
            },

            Arg_named: function(a,b,c) {
                return named(a.ast().name,c.ast())
            },
            Arg_indexed: function(a) {
                return indexed(a.ast())
            },

            FuncallExp:function(ident,_1,args,_2) {
                let name = ident.ast()
                let list = args.ast()
                return call(name.name,list)
            },

            Pipeline_right:function(first,_,next) {
                return pipeline_right(first.ast(),next.ast())
            },
            Pipeline_left:function(next,_,first) {
                return pipeline_left(next.ast(),first.ast())
            },

            Block:function(_1,statements,_2) {
                return block(statements.ast())
            },

            DefArg:function(a,_,c) {
                return [a.ast().name,c.ast()]
            },
            FundefExp:function(def,name,_1,args,_2,block) {
                return fundef(name.ast().name, args.ast(),block.ast())
            },

        })
    }
    parse(code) {
        return this.grammar.match(code)
    }
    ast(match) {
        return this.semantics(match).ast()
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
    match_args_to_params(args) {
        let params = Object.entries(this.params).map(([key,value]) =>{
            // console.log("looking at",key,'=',value)
            // console.log("remaining args",args)
            //look for matching arg
            let n1 = args.findIndex(a => a.type === 'named' && a.name === key)
            if(n1 >= 0) {
                // console.log("found named ", args[n1])
                let arg = args[n1]
                args.splice(n1,1)
                return arg.value
            } else {
                //grab the first indexed parameter we can find
                // console.log("finding indexed")
                let n = args.findIndex(a => a.type === 'indexed')
                if(n >= 0) {
                    // console.log("found", args[n])
                    let arg = args[n]
                    args.splice(n,1)
                    return arg.value
                } else {
                    // console.log("no indexed found")
                    // console.log("checking for default",value)
                    if(value === REQUIRED) throw new Error(`parameter ${key} is required in function ${this.name}`)
                    return value
                }
            }
        })
        return params
    }
    apply_function(args) {
        // this.log("applying args",args)
        // this.log("to the function",this.name)
        let params = this.match_args_to_params(args)
        return this.apply_with_parameters(params)
    }
    apply_with_parameters(params) {
        params = params.map(p => {
            // console.log("parameter",p)
            if(p&&p.type === 'callsite') {
                // console.log("must evaluate argument")
                return Promise.resolve(p.apply())
            }
            return Promise.resolve(p)
        })
        // console.log("final params",params)
        return Promise.all(params).then(params=>{
            // console.log("real final params",params)
            return this.fun.apply(this,params)
        })
    }
}

function parseBoolean(sourceString) {
    if(sourceString.toLowerCase()==='true') return true
    if(sourceString.toLowerCase()==='false') return false
    throw new Error(`invalid boolean '${sourceString}'`)
}

const UNOPS = {
    '-':'negate',
    '!':'factorial',
    'not':'not',
}
const BINOPS = {
    '+':'add',
    '-':'subtract',
    '*':'multiply',
    '/':'divide',
    '**':'power',
    '<':'lessthan',
    '>':'greaterthan',
    '=':'equal',
    '<>':'notequal',
    '<=':'lessthanorequal',
    '>=':'greaterthanorequal',
    'as':'convertunit',
    'and':'and',
    'or':'or',
    'mod':'mod',
}

const UNITS = {
    'meter':'meter',
    'm':'meter',
    'meters':'meter',
    'foot':'foot',
    'ft':'foot',
    'feet':'foot',
    '%':'percent',
    'percent':'percent',
    'in':'inch',
    'mps':'meter/second',
    'meter/second':'meter/second',
    'mpss':'meter/second/second',
    'meter/second/second':'meter/second/second',
}

