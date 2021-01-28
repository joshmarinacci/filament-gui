import {FilamentFunction, REQUIRED} from './parser.js'

function gen_range(min,max,step) {
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
export const length = new FilamentFunction(    'length',
    {
        data:REQUIRED,
    },
    function(data) {
        this.log(data)
        return data.length
    }
)

function is_dataset(list) {
    return list.data?true:false
}

// * __take__: take the first N elements from a list to make a new list `take([1,2,3], 2) = [1,2]`
export const take =  new FilamentFunction(  "take",
    {
        data:REQUIRED,
        count:REQUIRED,
    },
    function (data,count) {
        this.log(data,count)
        if(count < 0) {
            return data.slice(data.length+count,data.length)
        } else {
            return data.slice(0, count)
        }
    })


// * __drop__: return list with the number of elements removed from the start. `drop([1,2,3],1) = [2,3]`
export const drop =  new FilamentFunction(  "drop",
    {
        data:REQUIRED,
        count:REQUIRED,
    },
    function (data,count) {
        this.log('params',data,count)
        if(count < 0) {
            return data.slice(0,data.length+count)
        } else {
            return data.slice(count)
        }
    })




// * __join__: concatentate two lists, returning a new list. is this needed?
export function join(a,b) {
    if(!Array.isArray(a)) a = [a]
    return a.concat(b)
}


// * __map__:  convert every element in a list using a lambda function: `(list, lam)`
export function map(list,cb) {
    if(is_dataset(list)) {
        return map(list.data.items,cb)
    }
    return list.map(cb)
}


// * __for__:  loops over every element in a list with a lambda, but returns the original list: `(list, lam)`

// * __sort__: sort list returning a new list, by: property to use for sorting `sort(data by:"date")` (should we use `order` instead?)
export const sort = new FilamentFunction( "sort",
    {
        data:REQUIRED,
        order:"ascending",
    },
    function(data,order) {
        this.log("params",data,order)
        data = data.slice().sort()
        if(order === 'descending') {
            return data.reverse()
        } else {
            return data
        }
    }
)

// * __reverse__: return a list with the order reversed  `reverse(data)`
export const reverse = new FilamentFunction("reverse",
    {
        data:REQUIRED,
    },
    function(data) {
        this.log("params",data)
        return data.reverse()
    }
)


// * __sum__: adds all data points together
export const sum = new FilamentFunction(
    "sum",
    {
        data:REQUIRED,
    },
    function(data) {
        return data.reduce((a,b)=>a+b)
    }
)


export function select(list, opts) {
    let where = opts.where
    return list.filter(where)
}

export const max = new FilamentFunction(
    "max",
    {
        data:REQUIRED,
    },
    function (data) {
        return data.reduce((a,b)=> a>b?a:b)
    }
)

