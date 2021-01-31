import {FilamentFunction, REQUIRED} from './parser.js'


function gv (v) {
    if(v.type === 'scalar') return v.value
    return v
}

function binop(a,b,cb) {
    if((!Array.isArray(a)) && (Array.isArray(b))) return b.map(v => cb(a,v))
    if((Array.isArray(a)) && (!Array.isArray(b))) return a.map(v => cb(v,b))
    if((Array.isArray(a)) && (Array.isArray(b))) return a.map((v,i) => cb(v,b[i]))
    return cb(gv(a),gv(b))
}
function unop(a,cb) {
    if(Array.isArray(a)) return a.map(v => cb(v))
    return cb(a)
}

export const add = new FilamentFunction('add',{a:REQUIRED, b:REQUIRED},
    function(a,b) { return binop(a,b,(a,b)=>a+b) })
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
export const mod = (a,b) => binop(a,b,(a,b)=> a % b)
export const sin = (a) => unop(a, a=>Math.sin(a))
export const cos = (a) => unop(a, a=>Math.cos(a))
export const tan = (a) => unop(a, a=>Math.tan(a))

export const lessthan = new FilamentFunction('lessthan',{a:REQUIRED, b:REQUIRED}, (a,b) => a < b)
export const greaterthan = new FilamentFunction('greaterthan',{a:REQUIRED, b:REQUIRED}, (a,b) => a > b)
export const equal = new FilamentFunction('equal',{a:REQUIRED, b:REQUIRED}, (a,b) => a === b)
export const notequal = new FilamentFunction('notequal',{a:REQUIRED, b:REQUIRED}, (a,b) => a !== b)
export const lessthanorequal = new FilamentFunction('lessthanorequal',{a:REQUIRED, b:REQUIRED}, (a,b) => a <= b)
export const greaterthanorequal = new FilamentFunction('greaterthanorequal',{a:REQUIRED, b:REQUIRED}, (a,b) => a >= b)
