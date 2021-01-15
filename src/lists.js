function gen_range(min,max,step) {
    console.log("generating",min,max,step)
    let list = []
    for(let i=min; i<max; i+=step) {
        list.push(i)
    }
    return list
}

// * __range__: generate a list of numbers: `(max), (min,max), (min,max,step)`

export function range(a,b,step) {
    if(!step) step = 1
    if(typeof a === 'undefined' || a === null) throw new Error("range requires at least one argument")
    if(typeof b === 'undefined') {
        return gen_range(0,a,step)
    } else {
        return gen_range(a,b,step)
    }
}


// * __length__: returns the length of the list
export function length(list) {
    if(!list) throw new Error("length(list) missing list")
    return list.length
}


// * __take__: take the first N elements from a list to make a new list `take([1,2,3], 2) = [1,2]`
export function take(list,num) {
    if(!list) throw new Error("take needs a list to take from")
    if(typeof num === 'undefined') num = 1
    if(num < 0) {
        return list.slice(list.length+num,list.length)
    }
    return list.slice(0,num)
}

// * __drop__: return list with the number of elements removed from the start. `drop([1,2,3],1) = [2,3]`
export function drop(list, num) {
    if(!list) throw new Error("take needs a list to take from")
    if(typeof num === 'undefined') num = 1
    if(num < 0) return list.slice(0,list.length+num)
    return list.slice(num)
}


// * __join__: concatentate two lists, returning a new list. is this needed?
export function join(a,b) {
    if(!Array.isArray(a)) a = [a]
    return a.concat(b)
}


// * __map__:  convert every element in a list using a lambda function: `(list, lam)`
export function map(list,cb) {
    return list.map(cb)
}


// * __for__:  loops over every element in a list with a lambda, but returns the original list: `(list, lam)`

// * __sort__: sort list returning a new list, by: property to use for sorting `sort(data by:"date")` (should we use `order` instead?)
export function sort(list,opts) {
    if(opts && opts.by) {
        return list.slice().sort((a,b)=>{
            a = a[opts.by]
            b = b[opts.by]
            //special case for strings
            if(a.localeCompare) return a.localeCompare(b)
            return a-b
        })
    }
    return list.slice().sort()
}
// * __reverse__: return a list with the order reversed  `reverse(data)`
export function reverse(list) {
    return list.reverse()
}


// * __sum__: adds all data points together
export function sum(list) {
    return list.reduce((a,b)=>a+b)
}


export function select(list, opts) {
    let where = opts.where
    return list.filter(where)
}

export function max(list) {
    return list.reduce((a,b)=> a>b?a:b)
}