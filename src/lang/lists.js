import {FilamentFunction, REQUIRED} from './parser.js'
import {is_list, list, pack, scalar, unpack} from './ast.js'

function gen_range(min,max,step) {
    let list = []
    for(let i=min; i<max; i+=step) {
        list.push(i)
    }
    return list
}

// * __range__: generate a list of numbers: `(max), (min,max), (min,max,step)`

export const range = new FilamentFunction('range',
    {
        max:REQUIRED,
        min:scalar(0),
        step:scalar(1)
    },
    function(max,min,step) {
        // this.log("making a range",max,min,step)
        function gen_range(min,max,step) {
            let list = []
            for(let i=min; i<max; i+=step) {
                list.push(i)
            }
            return list
        }
        return list(gen_range(min.value,max.value,step.value).map(v => scalar(v)))
    })



// * __length__: returns the length of the list
export const length = new FilamentFunction('length', {
        data:REQUIRED,
    },
    function(data) {
        // this.log(data)
        return scalar(data._get_length())
    }
)



function is_dataset(list) {
    return list.data?true:false
}

// * __take__: take the first N elements from a list to make a new list `take([1,2,3], 2) = [1,2]`
export const take = new FilamentFunction('take',
    {
        data:REQUIRED,
        count:REQUIRED,
    },function(data,count) {
        // this.log("taking from data",data,'with count',count)
        if(count < 0) {
            return data._slice(data._get_length()+unpack(count),data._get_length())
        } else {
            return data._slice(0, unpack(count))
        }
    })


// * __drop__: return list with the number of elements removed from the start. `drop([1,2,3],1) = [2,3]`
export const drop =  new FilamentFunction(  "drop",
    {
        data:REQUIRED,
        count:REQUIRED,
    },
    function (data,count) {
        // this.log('params',data,count)
        if(count < 0) {
            return data._slice(0,data.value.length+unpack(count))
        } else {
            return data._slice(unpack(count))
        }
    })




// * __join__: concatentate two lists, returning a new list. is this needed?
export const join = new FilamentFunction('join',{
        data:REQUIRED,
        more:REQUIRED,
    },
    function(data,more) {
        if(is_list(data) && is_list(more))    return list(data.value.concat(unpack(more.value)))
        if((!is_list(data)) && is_list(more)) return list([data].concat(unpack(more.value)))
        if(is_list(data) && !is_list(more))   return list(data.value.concat([more]))
        return list([data].concat([more]))
    }
)


// * __map__:  convert every element in a list using a lambda function: `(list, lam)`
export const map = new FilamentFunction('map',{
    data:REQUIRED,
    with:REQUIRED,
},function(data,cb) {
    let proms = data._map((el)=>{
        let ret = cb.fun.apply(cb,[el])
        return Promise.resolve(ret).then((ret => {
            return ret
        }))
    })
    return Promise.all(proms).then(vals => {
        return list(vals)
    })
})

export const select = new FilamentFunction('select',{
    data:REQUIRED,
    where:REQUIRED,
},function(data,where) {
    return list(data._filter((el)=>{
        let ret = where.fun.apply(where,[el])
        // console.log("ret is",unpack(ret))
        return unpack(ret)
        // return Promise.resolve(ret).then(ret => {
        //     console.log("returned",unpack(ret))
        //     return ret
        // })
    }))
})

// * __for__:  loops over every element in a list with a lambda, but returns the original list: `(list, lam)`

// * __sort__: sort list returning a new list, by: property to use for sorting `sort(data by:"date")` (should we use `order` instead?)
export const sort = new FilamentFunction( "sort",
    {
        data:REQUIRED,
        order:"ascending",
    },
    function(data,order) {
        // this.log("params",data,order)
        let new_data = data._slice()._sort((a,b)=>{
            let av = unpack(a)
            let bv = unpack(b)
            if(av < bv) return -1
            if(av > bv) return 1
            return 0
        })
        if(unpack(order) === 'descending') {
            return new_data.reverse()
        } else {
            return new_data
        }
    }
)

// * __reverse__: return a list with the order reversed  `reverse(data)`
export const reverse = new FilamentFunction('reverse',{
    data:REQUIRED,
},function(data) {
    // this.log("params",data)
    return list(data.value.reverse())
})

// * __sum__: adds all data points together
export const sum = new FilamentFunction("sum",
    {
        data:REQUIRED,
    },
    function(data) {
        return Promise.resolve(scalar(data._reduce((a,b)=>unpack(a)+unpack(b))))
    }
)




export const max = new FilamentFunction("max",
    {
        data:REQUIRED,
    },
    function (data) {
        return data._reduce((a,b)=> a>b?a:b)
    }
)


export const get_field = new FilamentFunction("get_field",{data:REQUIRED,field:REQUIRED},(data,field)=>{
    // console.log("getting the field",data,field)
    return pack(data[unpack(field)])
})
