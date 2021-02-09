import {FilamentFunction, REQUIRED} from './parser.js'
import {is_boolean, is_list, is_scalar, list, pack, scalar, unpack} from './ast.js'
import {convert_unit, find_conversion, to_canonical_unit} from './units.js'

function binop(a,b,cb) {
    // console.log("binop-ing",a,b)
    if(is_scalar(a) && is_scalar(b)) return pack(cb(unpack(a),unpack(b)))
    if(is_boolean(a) && is_boolean(b)) return pack(cb(unpack(a),unpack(b)))
    if(is_list(a) && is_list(b)) {
        return list(a.value.map((aa,i)=> pack(cb(unpack(a.value[i]),unpack(b.value[i])))))
    }
    if(is_list(a) && is_scalar(b)) {
        return list(a.value.map((_,i)=> pack(cb(unpack(a.value[i]),unpack(b)))))
    }
    if(is_scalar(a) && is_list(b)) {
        return list(b.value.map((_,i)=> pack(cb(unpack(a),unpack(b.value[i])))))
    }
    console.log("erroring",a,b,cb)
    throw new Error("can't binop " + a.toString() + " " + b.toString())
}

function unop(a,cb) {
    if(Array.isArray(a)) return a.map(v => cb(v))
    return pack(cb(unpack(a)))
}

export const add = new FilamentFunction('add',{a:REQUIRED, b:REQUIRED},
    function(a,b) {
    if(is_scalar_with_unit(a) && is_scalar_without_unit(b)) throw new Error(`cannot add incompatible units ${a.toString()} and ${b.toString()}`)
    if(is_scalar_with_unit(a) && is_scalar_with_unit(b)) {
        let conv = find_conversion(a,b)
        console.log('final conversion is',conv)
        if(conv) return scalar(a.value/conv.ratio + b.value, conv.to)
    }

    return binop(a,b, (a,b)=>a+b)
})
export const subtract = new FilamentFunction('subtract',{a:REQUIRED, b:REQUIRED},
    function (a,b) {
        if(is_scalar_with_unit(a) && is_scalar_without_unit(b)) throw new Error(`cannot subtract incompatible units ${a.toString()} and ${b.toString()}`)
        if(is_scalar_with_unit(a) && is_scalar_with_unit(b)) {
            let conv = find_conversion(a,b)
            if(conv) return scalar(a.value/conv.ratio - b.value, conv.to)
        }

    return binop(a,b,(a,b)=>a-b)
})

function is_scalar_with_unit(a) {
    if(a.unit === 'none') return false
    if(is_scalar(a) && a.unit !== null) return true
    return false
}

function is_scalar_without_unit(a) {
    if(is_scalar(a) && (a.unit === null || a.unit === 'none') ) return true
    return false
}

export const multiply = new FilamentFunction('multiply',{a:REQUIRED, b:REQUIRED},
    function (a,b) {
        //if one has a unit and one does
        if(is_scalar_with_unit(a) && is_scalar_without_unit(b)) {
            return scalar(a.value*b.value,a.unit)
        }
        if(is_scalar_with_unit(b) && is_scalar_without_unit(a)) {
            return scalar(b.value*a.value,b.unit)
        }
        if(is_scalar_with_unit(a) && is_scalar_with_unit(b)) {
            return scalar(a.value*b.value,a.unit,a.dim+b.dim)
        }
    return binop(a,b,(a,b)=>a*b)
})
export const divide = new FilamentFunction('divide',{a:REQUIRED, b:REQUIRED},
    function (a,b) {
        if(is_scalar_with_unit(a) && is_scalar_without_unit(b)) {
            return scalar(a.value/b.value,a.unit)
        }
        if(is_scalar_with_unit(b) && is_scalar_without_unit(a)) {
            return scalar(b.value/a.value,b.unit)
        }
    return binop(a,b,(a,b)=>a/b)
})
export const power = new FilamentFunction('power',{a:REQUIRED, b:REQUIRED},
    function (a,b) { return binop(a,b,(a,b)=>Math.pow(a,b)) })
export const negate = new FilamentFunction('negate', {a:REQUIRED}, (a) =>unop(a,a=>-a))
export const factorial = new FilamentFunction('factorial', {a:REQUIRED}, (a) => unop(a,(a)=>{
    if(a === 0 || a === 1) return 1
    let sum = 1
    for(let i=1; i<=a; i++) sum *= i
    return sum
}))

function make_binop(name, cb) {
    return new FilamentFunction(name,{a:REQUIRED, b:REQUIRED}, (a,b) => binop(a,b,cb))
}

function make_unop(name, cb) {
    return new FilamentFunction(name,{a:REQUIRED}, (a) => unop(a,cb))
}

// export const sin = (a) => unop(a, a=>Math.sin(a))
// export const cos = (a) => unop(a, a=>Math.cos(a))
// export const tan = (a) => unop(a, a=>Math.tan(a))

export const mod = make_binop('mod',(a,b)=>a%b)
export const lessthan = make_binop('lessthan',(a,b)=>a<b)
export const greaterthan = make_binop('greaterthan',(a,b)=>a>b)
export const equal = make_binop('equal',(a,b)=>a===b)
export const notequal = make_binop('notequal',(a,b)=>a!==b)
export const lessthanorequal = make_binop('lessthanorequal',(a,b)=>a<=b)
export const greaterthanorequal = make_binop('greaterthanorequal',(a,b)=>a>=b)
export const and = make_binop('and',(a,b)=>a&&b)
export const or = make_binop('or',(a,b)=>a||b)
export const not = make_unop('not',a => !a)


export const convertunit = new FilamentFunction('convertunit',
    {a:REQUIRED,b:REQUIRED},
    (a,b) => {
        return scalar(
            convert_unit(a.value,a.unit,to_canonical_unit(b)),
            to_canonical_unit(b))
    })


export const is_prime = new FilamentFunction('is_prime', {n:REQUIRED},function(n) {
    let num = unpack(n)
    for(let i = 2; i < num; i++)
        if(num % i === 0) return pack(false);
    return pack(num > 1);
})