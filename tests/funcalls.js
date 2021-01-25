import {tests, REQUIRED, FilamentFunction} from './util.js'


let scope = {}

scope.length = new FilamentFunction(
    'length',
    {
        data:REQUIRED,
    },
    function(data) {
        this.log(data)
        return data.length
    }
)

scope.take =  new FilamentFunction(
    "take",
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

scope.drop =  new FilamentFunction(
    "drop",
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


scope.sort = new FilamentFunction(
    "sort",
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

scope.reverse = new FilamentFunction(
    "reverse",
    {
        data:REQUIRED,
    },
    function(data) {
        this.log("params",data)
        return data.reverse()
    }
)

scope.sum = new FilamentFunction(
    "sum",
    {
        data:REQUIRED,
    },
    function(data) {
        return data.reduce((a,b)=>a+b)
    }
)

scope.max = new FilamentFunction(
    "max",
    {
        data:REQUIRED,
    },
    function (data) {
    return data.reduce((a,b)=> a>b?a:b)
    }
)


tests("functions",[
    ['[4,2,42]',[4,2,42]],
    ['length([4,2,42])',3],
    ['length(data:[4,2,42])',3],

    ['take(data:[4,2,42],count:2)',[4,2]],
    ['take(count:2, data:[4,2,42])',[4,2]],
    ['take([4,2,42],count:2)',[4,2]],
    ['take([4,2,42],2)',[4,2]],

    ['sort(data:[4,2,42])',[2,4,42]],
    ['sort([4,2,42])',[2,4,42]],
    ['sort(data:[4,2,42], order:"ascending")',[2,4,42]],
    ['sort(data:[4,2,42], order:"descending")',[42,4,2]],
    ['sort([4,2,42], order:"descending")',[42,4,2]],
    ['sort(order:"descending",[4,2,42])',[42,4,2]],

    ['sum([4,2,42])',48],
    ['sum(data:[4,2,42])',48],
    ['max(data:[4,2,42])',42],
    ['reverse(data:[4,2,42])',[42,2,4]],
    ['drop(data:[4,2,42],count:1)',[2,42]],

    // ['take([4,2,42],count:2) >> sort()',[2,4]],
    // ['take([4,2,42],count:2) >> sort(order:"descending")',[4,2]],

],{
    scope:scope,
})

