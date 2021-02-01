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
}
export const list = arr => new FList(arr)

class FCall {
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
}
export const call = (name,args) => new FCall(name,args)

class FIndexedArg {
    constructor(value) {
        this.type = 'indexed'
        this.value = value
    }
    toString() {
        return this.value.toString()
    }
}
export const indexed = v => new FIndexedArg(v)

class FNamedArg {
    constructor(name,value) {
        this.type = 'named'
        this.name = name
        this.value = value
    }
    toString() {
        return this.name.toString() + ":" + this.value.toString()
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
