function binop(a,b,cb) {
    if((!Array.isArray(a)) && (Array.isArray(b))) return b.map(v => cb(a,v))
    if((Array.isArray(a)) && (!Array.isArray(b))) return a.map(v => cb(v,b))
    if((Array.isArray(a)) && (Array.isArray(b))) return a.map((v,i) => cb(v,b[i]))
    return cb(a,b)
}
function unop(a,cb) {
    if(Array.isArray(a)) return a.map(v => cb(v))
    return cb(a)
}

export const add = (a,b) => binop(a,b,(a,b)=>a+b)
export const subtract = (a, b) => binop(a,b,(a,b)=>a-b)
export const multiply = (a,b) => binop(a,b,(a,b)=>a*b)
export const divide = (a,b) => binop(a,b,(a,b)=>a/b)
export const power = (a,b) => Math.pow(a,b)
export const negate = (a) =>unop(a,a=>-a)
export const factorial = (a) => unop(a,(a)=>{
    if(a === 0 || a === 1) return 1
    let sum = 1
    for(let i=1; i<=a; i++) sum *= i
    return sum
})
export const mod = (a,b) => binop(a,b,(a,b)=> a % b)
