import {FilamentFunction, REQUIRED} from './parser.js'
import {boolean, list, pack, scalar, unpack} from './ast.js'
import {is_boolean, is_list, is_scalar} from './base.js'


function gv (v) {
    if(v.type === 'scalar') return v.value
    return v
}

function binop(a,b,cb) {
    console.log("binop-ing",a,b)
    if(is_scalar(a) && is_scalar(b)) return pack(cb(unpack(a),unpack(b)))
    if(is_boolean(a) && is_boolean(b)) return pack(cb(unpack(a),unpack(b)))
    if(is_list(a) && is_list(b)) {
        let arr = a.value.map((aa,i)=>{
            return pack(aa.value + b.value[i].value)
        })
        return list(arr)
    }
    console.log("erroring",a,b,cb)
    throw new Error("can't binop " + a.toString() + " " + b.toString())
}

// if((!Array.isArray(a)) && (Array.isArray(b))) return b.map(v => cb(a,v))
    // if((Array.isArray(a)) && (!Array.isArray(b))) return a.map(v => cb(v,b))
    // if((Array.isArray(a)) && (Array.isArray(b))) return a.map((v,i) => cb(v,b[i]))
    // return cb(gv(a),gv(b))
// }
function unop(a,cb) {
    if(Array.isArray(a)) return a.map(v => cb(v))
    return cb(a)
}

// export const add = new FilamentFunction('add',{a:REQUIRED, b:REQUIRED},
//     function(a,b) { return binop(a,b,(a,b)=>a+b) })
export const add = new FilamentFunction('add',{a:REQUIRED, b:REQUIRED},
    function(a,b) { return binop(a,b, (a,b)=>a+b) })
export const subtract = new FilamentFunction('subtract',{a:REQUIRED, b:REQUIRED},
    function (a,b) { return binop(a,b,(a,b)=>a-b) })
export const multiply = new FilamentFunction('multiply',{a:REQUIRED, b:REQUIRED},
    function (a,b) { return binop(a,b,(a,b)=>a*b) })
export const divide = new FilamentFunction('divide',{a:REQUIRED, b:REQUIRED},
    function (a,b) { return binop(a,b,(a,b)=>a/b) })
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

export const sin = (a) => unop(a, a=>Math.sin(a))
export const cos = (a) => unop(a, a=>Math.cos(a))
export const tan = (a) => unop(a, a=>Math.tan(a))

export const mod = make_binop('mod',(a,b)=>a%b)
export const lessthan = make_binop('lessthan',(a,b)=>a<b)
export const greaterthan = new FilamentFunction('greaterthan',{a:REQUIRED, b:REQUIRED},
    (a,b) => binop(a,b,(a,b)=>a>b))
export const equal = new FilamentFunction('equal',{a:REQUIRED, b:REQUIRED},
    (a,b) => binop(a,b,(a,b)=>a===b))
export const notequal = new FilamentFunction('notequal',{a:REQUIRED, b:REQUIRED},
    (a,b) => binop(a,b,(a,b)=>a!==b))
export const lessthanorequal = new FilamentFunction('lessthanorequal',{a:REQUIRED, b:REQUIRED},
    (a,b) => binop(a,b,(a,b)=>a<=b))
export const greaterthanorequal = new FilamentFunction('greaterthanorequal',{a:REQUIRED, b:REQUIRED},
    (a,b) => binop(a,b,(a,b)=>a>=b))
export const and = new FilamentFunction('and',{a:REQUIRED, b:REQUIRED},
    (a,b) => binop(a,b,(a,b)=>a&&b))
export const or = new FilamentFunction('or',{a:REQUIRED, b:REQUIRED},
    (a,b) => binop(a,b,(a,b)=>a||b))

