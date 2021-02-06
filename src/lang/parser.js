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
import {is_valid_unit, to_canonical_unit} from './units.js'

export const REQUIRED = Symbol('REQUIRED')

const strip_under = s => s.replaceAll("_", "")

function do_bin_op(op, a, c) {
    if (BINOPS[op]) return call(BINOPS[op], [indexed(a), indexed(c)])
    throw new Error(`Unknown operator: ${op}`)
}
function do_un_op(op,val) {
    if (UNOPS[op]) return call(UNOPS[op], [indexed(val)])
    throw new Error(`Unknown operator: ${op}`)
}
export class Parser {
    constructor(scope, grammar_source) {
        this.scope = scope
        this.grammar_source = grammar_source
        this.init(this.scope)
    }

    init(scope) {
        this.grammar = ohm.grammar(this.grammar_source)
        this.semantics = this.grammar.createSemantics()
        this.semantics.addOperation('ast', {
            _terminal() { return this.sourceString },

            //primitives
            ident(i, i2) { return ident(this.sourceString)  },
            bool: (a) => boolean(parseBoolean(a.sourceString)),
            string: (_1, str, _2) => string(str.sourceString),

            // number literals and units
            number_whole: a => scalar(parseInt(strip_under(a.sourceString))),
            number_hex: (_, a) => scalar(parseInt(strip_under(a.sourceString), 16)),
            number_fract: (a, b, c) => scalar(parseFloat(strip_under(a.sourceString + b.sourceString + c.sourceString))),
            unit: u => {
                let name = u.sourceString
                if (is_valid_unit(name)) return to_canonical_unit(name)
                throw new Error(`unknown unit type '${name}'`)
            },
            unitnumber: (v, u) => scalar(v.ast(), u.ast()),

            // lists
            NonemptyListOf: (a, b, c) => [a.ast()].concat(c.ast()),
            EmptyListOf: () => [],
            List: (a, b, c) => list(b.ast()),

            // all binary operators
            AsExp_convert: (v1, op, v2) => do_bin_op(op.ast(),v1.ast(),v2.ast()),
            BoolExp_bool: (v1, op, v2) => do_bin_op(op.ast(),v1.ast(),v2.ast()),
            AddExp_add: (a, op, c) => do_bin_op(op.ast(),a.ast(),c.ast()),
            MulExp_mul: (a, op, c) => do_bin_op(op.ast(),a.ast(),c.ast()),
            PipeOp_right: (first, _, next) => pipeline_right(first.ast(), next.ast()),
            PipeOp_left:(next, _, first) => pipeline_left(next.ast(), first.ast()),

            // all unary operators
            UnExp: (op, val) => do_un_op(op.ast(),val.ast()),

            GroupExp: (_1, e, _2) => e.ast(),

            // function definitions and calls
            Arg_named: (a, _, c) => named(a.ast().name, c.ast()),
            Arg_indexed: a => indexed(a.ast()),
            FuncallExp: (ident, _1, args, _2) => call(ident.ast().name, args.ast()),
            DefArg: (a, _, c) => [a.ast().name, c.ast()],
            FundefExp: (def, name, _1, args, _2, block) => fundef(name.ast().name, args.ast(), block.ast()),

            Block: (_1, statements, _2) => block(statements.ast()),
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
    constructor(name, params, fun) {
        this.name = strip_under(name.toLowerCase())
        this.params = params
        this.fun = fun
    }

    log() {
        let args = Array.prototype.slice.call(arguments)
        console.log('###', this.name.toUpperCase(), ...args)
    }

    match_args_to_params(args) {
        let params = Object.entries(this.params).map(([key, value]) => {
            // console.log("looking at",key,'=',value)
            // console.log("remaining args",args)
            //look for matching arg
            let n1 = args.findIndex(a => a.type === 'named' && a.name === key)
            if (n1 >= 0) {
                // console.log("found named ", args[n1])
                let arg = args[n1]
                args.splice(n1, 1)
                return arg.value
            } else {
                //grab the first indexed parameter we can find
                // console.log("finding indexed")
                let n = args.findIndex(a => a.type === 'indexed')
                if (n >= 0) {
                    // console.log("found", args[n])
                    let arg = args[n]
                    args.splice(n, 1)
                    return arg.value
                } else {
                    // console.log("no indexed found")
                    // console.log("checking for default",value)
                    if (value === REQUIRED) throw new Error(`parameter ${key} is required in function ${this.name}`)
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
            if (p && p.type === 'callsite') {
                // console.log("must evaluate argument")
                return Promise.resolve(p.apply())
            }
            return Promise.resolve(p)
        })
        // console.log("final params",params)
        return Promise.all(params).then(params => {
            // console.log("real final params",params)
            return this.fun.apply(this, params)
        })
    }
}

function parseBoolean(sourceString) {
    if (sourceString.toLowerCase() === 'true') return true
    if (sourceString.toLowerCase() === 'false') return false
    throw new Error(`invalid boolean '${sourceString}'`)
}

const UNOPS = {
    '-': 'negate',
    '!': 'factorial',
    'not': 'not'
}
const BINOPS = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
    '**': 'power',
    '<': 'lessthan',
    '>': 'greaterthan',
    '=': 'equal',
    '<>': 'notequal',
    '<=': 'lessthanorequal',
    '>=': 'greaterthanorequal',
    'as': 'convertunit',
    'and': 'and',
    'or': 'or',
    'mod': 'mod'
}

