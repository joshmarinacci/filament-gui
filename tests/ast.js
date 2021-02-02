class FScalar {
    constructor(value,unit) {
        this.type = 'scalar'
        this.value = value
        this.unit = unit
        if(value instanceof FScalar) this.value = this.value.value
        if(!unit) this.unit = null
        if(Array.isArray(unit)) {
            if (unit.length === 0) this.unit = null
            if (unit.length === 1) this.unit = unit[0]
        }
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
export const scalar = (n,u) => new FScalar(n,u)

class FString {
    constructor(value) {
        this.type = 'string'
        this.value = value
    }
    toString() {
        return `"${this.value}"`
    }
    evalJS() {
        return this.value
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
}
export const boolean = v => new FBoolean(v)

class FList {
    constructor(arr) {
        this.type = 'list'
        this.value = arr
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

function is_number(ret) {
    if(typeof ret === 'number') return true
    return false
}

function is_array(ret) {
    if(Array.isArray(ret)) return true
    return false
}

class FCall {
    log() {
        console.log("## FCall ## ",...arguments)
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
        return fun.apply_function(this.args)
    }
    evalJS_with_pipeline(scope,prepend) {
        if(!scope.lookup(this.name)) throw new Error(`function '${this.name}' not found`)
        let fun = scope.lookup(this.name)
        console.log("eval with prepend args",prepend)
        let args = [prepend].concat(this.args)
        return fun.apply_function(args)
    }
    evalFilament(scope) {
        this.log(`ff evaluating "${this.name}" with args`,this.args)
        let fun = scope.lookup(this.name)
        if(!fun) throw new Error(`function '${this.name}' not found`)
        this.log(`real function ${this.name}`)
        let params = fun.match_args_to_params(this.args)
        this.log("parms are",params)
        let params2 = params.map(a => {
            this.log("evaluating argument",a)
            return a.evalFilament(scope)
        })
        console.log("real final params",params2)
        return Promise.all(params2).then(params2 => {
            let ret = fun.fun.apply(fun,params2)
            console.log("ret is",ret)
            return Promise.resolve(ret)
        })
    }
}
export const call = (name,args) => new FCall(name,args)

class FunctionDefintion {
    constructor(name, args, blocks) {
        this.type = 'function_definition'
        this.name = name
        this.args = args
        this.blocks = blocks
    }
    toString() {
        let args = this.args.map(a => a[0].toString()+":"+a[1].toString())
        return `def ${this.name}(${args.join(",")}) {${this.blocks.toString()}}`
    }
}
export const fundef = (name,args,block) => new FunctionDefintion(name,args,block)

class FIndexedArg {
    log() {
        console.log("## FIndexedArg ## ",...arguments)
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
        console.log("## FNamedArg ## ",...arguments)
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

class Pipeline {
    constructor(dir,first,next) {
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
        return this.first.evalJS(scope).then(fval => {
            return this.next.evalJS_with_pipeline(scope,indexed(fval))
        })
    }
}
export const pipeline_right = (a,b) => new Pipeline('right',a,b)
export const pipeline_left = (a,b) => new Pipeline('left',b,a)

class Identifier {
    constructor(name) {
        this.type = 'identifier'
        this.name = name
    }
    toString() {
        return this.name
    }
}
export const ident = (n) => new Identifier(n)

class Block {
    constructor(sts) {
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
}
export const block = (sts) => new Block(sts)
