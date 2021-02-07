import {FilamentFunction} from './parser.js'
import {to_canonical_unit} from './units.js'

class ASTNode {
    constructor() {
    }
    log() {
        console.log(`## AST Node ${this.type} ## `,...arguments)
    }
    evalFilament() {
        throw new Error(`ASTNode ${this.type}  hasn't implemented evalFilament`)
    }
}

export class Scope {
    constructor(id,parent) {
        this.funs= {}
        this.id = id
        this.parent = parent
    }
    clone(id) {
        return new Scope(id,this)
    }
    lookup(name) {
        // console.log("SCOPE: lookup",name)
        if(!this.funs[name]) {
            if(this.parent) {
                return this.parent.lookup(name)
            } else {
                throw new Error(`no such identifier ${name}`)
            }
        }

        return this.funs[name]
    }
    install(...funs) {
        funs.forEach(fun => {
            this.funs[fun.name] = fun
        })
    }
    set_var(name,value) {
        this.funs[name] = value
        // console.log("SCOPE: set var",name)
        return value
    }
    names() {
        return Object.keys(this.funs)
    }
    dump() {
        console.log(`##### SCOPE == ${this.id} == `,this.names().join(", "))
        if(this.parent)this.parent.dump()
    }
}

class FScalar {
    constructor(value,unit,dim=1) {
        this.type = 'scalar'
        this.value = value
        this.unit = unit
        this.dim = dim
        if(value instanceof FScalar) this.value = this.value.value
        if(!unit) this.unit = null
        if(Array.isArray(unit)) {
            if (unit.length === 0) this.unit = null
            if (unit.length === 1) this.unit = unit[0]
        }
        this.unit = to_canonical_unit(this.unit)
    }
    toString() {
        if(this.unit) return (""+this.value+' '+this.unit)
        return (""+this.value)
    }
    evalJS() {
        return this.value
    }
    evalFilament() {
        return this
    }
}
export const scalar = (n,u,d) => new FScalar(n,u,d)

class FString {
    constructor(value) {
        this.type = 'string'
        this.value = value
    }
    _slice(a,b) {
        return string(this.value.slice(a,b))
    }
    toString() {
        return `"${this.value}"`
    }
    evalJS() {
        return this.value
    }
    evalFilament() {
        return this
    }
}
export const string = n => new FString(n)

class FBoolean {
    constructor(value) {
        this.type = 'boolean'
        this.value = value
    }
    toString() {
        return (this.value === true)?"true":"false"
    }
    evalJS() {
        return this.value
    }
    evalFilament() {
        return this
    }
}
export const boolean = v => new FBoolean(v)

export function pack(val) {
    if(typeof val === 'number') return scalar(val)
    if(typeof val === 'string') return string(val)
    if(typeof val === 'boolean') return boolean(val)
    console.log("can't pack value",val, typeof val)
    return val
}
export function unpack(v) {
    if(v.type === 'scalar') return v.value
    if(v.type === 'string') return v.value
    if(v.type === 'boolean') return v.value
    console.log("can't unpack value",v)
    return v
}


class FList {
    constructor(arr) {
        this.type = 'list'
        this.value = arr
    }

    _get_data_array() {
        return this.value
    }
    _get_length() {
        return this.value.length
    }
    _map(cb) {
        return this.value.map(cb)
    }
    _reduce(cb) {
        return this.value.reduce(cb)
    }
    _forEach(cb) {
        return this.value.forEach(cb)
    }
    _slice(a,b) {
        return new FList(this.value.slice(a,b))
    }
    _sort(cb) {
        return new FList(this.value.sort(cb))
    }
    _filter(cb) {
        return this.value.filter(cb)
    }

    toString() {
        return `[${this.value.join(",")}]`
    }
    evalJS() {
        return this.value.map(obj => obj.evalJS())
    }
    evalFilament() {
        return this
    }
}
export const list = arr => new FList(arr)

export class FTable extends ASTNode {
    constructor(obj) {
        super()
        this.type = 'table'
        // this.log("making using data",obj.data)
        this.schema = obj.data.schema
        this.value = obj.data.items
        Object.entries(this.schema.properties).forEach(([key,val])=>{
            // this.log("schema prop",key,val)
            if(val.type === 'number') {
                // this.log("validating numbers in data")
                this.value.forEach(it => {
                    if(typeof it[key] === 'string') it[key] = parseInt(it[key])
                    // this.log(`converted to number ${it[key]}`)
                })
            }
        })
    }
    evalFilament() {
        return this
    }
    _get_length() {
        return this.value.length
    }
    _map(cb) {
        return this.value.map(cb)
    }
    _forEach(cb) {
        return this.value.forEach(cb)
    }
    _get_field_from(field, datum, index) {
        return pack(this.value[index][unpack(field)])
    }
    _slice(a,b) {
        return new FTable({data:{schema:this.schema, items:this.value.slice(a,b)}})
    }
}

class FCall {
    log() {
        // console.log("## FCall ## ",this.name,...arguments)
    }
    constructor(name,args) {
        // console.log("#### making call",name,args)
        this.type = 'call'
        this.name = name
        this.args = args
    }
    toString() {
        return `${this.name}(${this.args.map(a => a.toString()).join(",")})`
    }
    evalJS(scope) {
        if(!scope.lookup(this.name)) throw new Error(`function '${this.name}' not found`)
        let fun = scope.lookup(this.name)
        // console.log('args',this.args)
        return fun.apply_function(this.args).then(res => {
            this.log("result of evalJS",res)
            return res
        })
    }
    evalJS_with_pipeline(scope,prepend) {
        if(!scope.lookup(this.name)) throw new Error(`function '${this.name}' not found`)
        let fun = scope.lookup(this.name)
        // console.log("eval with prepend args",prepend)
        let args = [prepend].concat(this.args)
        return fun.apply_function(args)
    }
    evalFilament(scope, prepend) {
        this.log(`ff evaluating "${this.name}" with args`,this.args)
        let fun = scope.lookup(this.name)
        // console.log(scope.id,scope.names())
        if(!fun) throw new Error(`function '${this.name}' not found`)
        this.log(`real function ${this.name}`)
        let args = this.args.slice()
        if(prepend) args.unshift(prepend)
        this.log("args to match are",args)
        let params = fun.match_args_to_params(args)
        this.log("parms are",params)
        let params2 = params.map(a => {
            if(a === null || typeof a === 'undefined') return a
            if(typeof a === 'string') return a
            this.log("evaluating argument",a)
            return a.evalFilament(scope)
        })
        return Promise.all(params2).then(params2 => {
            this.log(`real final params for ${this.name}:`,params2)
            let ret = fun.fun.apply(fun,params2)
            this.log(`return value`,ret)
            return Promise.resolve(ret)
        })
    }
}
export const call = (name,args) => new FCall(name,args)

class FunctionDefintion extends ASTNode {
    constructor(name, args, block) {
        super()
        this.type = 'function_definition'
        this.name = name
        this.args = args
        this.block = block
    }
    toString() {
        let args = this.args.map(a => a[0].toString()+":"+a[1].toString())
        return `def ${this.name}(${args.join(",")}) {${this.block.toString()}}`
    }
    evalFilament(scope) {
        // this.log("fun def returning self")
        // this.log("function def args",this.args)
        let args = {}
        this.args.forEach(arg => {
            // console.log("arg",arg)
            args[arg[0]] = arg[1]
        })
        // this.log("making function with args",args)
        scope.install(new FilamentFunction(this.name,args,(...params)=>{
            // this.log("inside the function", this.name,params)
            let scope2 = scope.clone(this.name)
            this.args.forEach((arg,i) => {
                // this.log("arg defs",arg)
                let name = arg[0]
                let value = params[i]
                // this.log("final vals",name,value)
                scope2.set_var(name,value)
            })
            return Promise.resolve(this.block.evalFilament(scope2)).then(v => {
                // this.log("value of block is",v)
                return v
            })
        }))
        return this
    }
}
export const fundef = (name,args,block) => new FunctionDefintion(name,args,block)

class FIndexedArg {
    log() {
        // console.log("## FIndexedArg ## ",...arguments)
    }
    constructor(value) {
        this.type = 'indexed'
        this.value = value
    }
    toString() {
        return this.value.toString()
    }
    evalFilament(scope) {
        this.log("evaluating value",this.value)
        return this.value.evalFilament(scope)
    }
}
export const indexed = v => new FIndexedArg(v)

class FNamedArg {
    log() {
        // console.log("## FNamedArg ## ",...arguments)
    }
    constructor(name,value) {
        this.type = 'named'
        this.name = name
        this.value = value
    }
    toString() {
        return this.name.toString() + ":" + this.value.toString()
    }
    evalFilament(scope) {
        this.log("evaluating",this.value)
    }
}
export const named   = (n,v) => new FNamedArg(n,v)


class Pipeline extends ASTNode {
    constructor(dir,first,next) {
        super()
        this.type = 'pipeline'
        this.direction = dir
        this.first = first
        this.next = next
    }
    toString() {
        if(this.direction === 'right') {
            return this.first.toString() + ">>" + this.next.toString()
        }
        if(this.direction === 'left') {
            return this.next.toString() + "<<" + this.first.toString()
        }
    }
    evalJS(scope) {
        // this.log("first is",this.first)
        return Promise.resolve(this.first.evalJS(scope)).then(fval => {
            return this.next.evalJS_with_pipeline(scope,indexed(fval))
        })
    }
    evalFilament(scope) {
        // this.log(`evaluating ${this.direction} `, this.first, 'then',this.next)
        return Promise.resolve(this.first.evalFilament(scope))
            .then(val1 => {
                // this.log("val1 is",val1)
                // this.log("next is",this.next)
                if(this.next.type === 'identifier') {
                    // this.log("this is a variable assignment")
                    return scope.set_var(this.next.name, val1)
                } else {
                    return this.next.evalFilament(scope, indexed(val1))
                }
            })
            // .then(val2 => {
            //     // this.log("second returned",val2)
            //     return val2
            // })
    }
}
export const pipeline_right = (a,b) => new Pipeline('right',a,b)
export const pipeline_left = (a,b) => new Pipeline('left',b,a)

const strip_under = s => s.replaceAll("_","")
class Identifier extends ASTNode {
    constructor(name) {
        super()
        this.type = 'identifier'
        this.name = strip_under(name.toLowerCase())
    }
    toString() {
        return this.name
    }
    evalFilament(scope) {
        return scope.lookup(this.name)
    }
}
export const ident = (n) => new Identifier(n)

class FBlock extends ASTNode{
    constructor(sts) {
        super()
        this.type = 'block'
        this.statements = sts
    }
    toString() {
        return this.statements.map(s => s.toString()).join("\n")
    }
    evalJS(scope) {
        let res = this.statements.map(s => s.evalJS(scope))
        return res[res.length-1]
    }
    evalFilament(scope) {
        // this.log("running the block")
        let  scope2 = scope.clone("block")
        let p = Promise.resolve(); // Q() in q

        this.statements.forEach(statement =>
            p = p.then(() => {
                // this.log("statement",statement)
                return statement.evalFilament(scope2)
            })
        )
        return p.then(res => {
            return res
        })

    }
}
export const block = (sts) => new FBlock(sts)
