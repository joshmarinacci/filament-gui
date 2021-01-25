import {tests, REQUIRED, FilamentFunction} from './util.js'



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

    // ['take([4,2,42],count:2) >> sort()',[2,4]],
    // ['take([4,2,42],count:2) >> sort(order:"descending")',[4,2]],

],{
    scope:{
        length: new FilamentFunction('length',{
                data:REQUIRED,
            },
            function(data) {
                this.log(data)
                return data.length
            }
        ),
        take: new FilamentFunction("take",{
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
            }),
        sort: new FilamentFunction(
            "sort",
            {
                data:REQUIRED,
                order:"ascending",
            },
            function(data,order) {
                this.log("### sort:",data,order)
                data = data.slice().sort()
                if(order === 'descending') {
                    return data.reverse()
                } else {
                    return data
                }
            }
        )
    }
})

