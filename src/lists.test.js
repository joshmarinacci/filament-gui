/**
 * @jest-environment jsdom
 */


import {add, subtract, multiply, divide, factorial, mod, power, negate} from './math.js'


function gen_range(min,max,step) {
    console.log("generating",min,max,step)
    let list = []
    for(let i=min; i<max; i+=step) {
        list.push(i)
    }
    return list
}
function range(a,b,step) {
    if(!step) step = 1
    if(typeof a === 'undefined' || a === null) throw new Error("range requires at least one argument")
    if(typeof b === 'undefined') {
        return gen_range(0,a,step)
    } else {
        return gen_range(a,b,step)
    }
}
// * __range__: generate a list of numbers: `(max), (min,max), (min,max,step)`
test('make list with range', () => {
    expect(range(3)).toEqual([0,1,2])
    expect(range(10)).toEqual([0,1,2,3,4,5,6,7,8,9])
    expect(range(3,8)).toEqual([3,4,5,6,7])
    expect(range(0,5)).toEqual([0,1,2,3,4])
    expect(range(3,8,3)).toEqual([3,6])
    expect(range(-10,0,3)).toEqual([-10,-7,-4,-1])
})
// * __length__: returns the length of the list
function length(list) {
    if(!list) throw new Error("length(list) missing list")
    return list.length
}
test('list length', ()=>{
    expect(length([1,2,3])).toEqual(3)
    expect(length(range(10))).toEqual(10)
    expect(length(range(-5,0))).toEqual(5)
})

function take(list,num) {
    if(!list) throw new Error("take needs a list to take from")
    if(typeof num === 'undefined') num = 1
    if(num < 0) {
        return list.slice(list.length+num,list.length)
    }
    return list.slice(0,num)
}
// * __take__: take the first N elements from a list to make a new list `take([1,2,3], 2) = [1,2]`
test("take from list",()=>{
    expect(take([1,2,3],2)).toEqual([1,2])
    expect(take([1,2,3],4)).toEqual([1,2,3])
    expect(take([1,2,3],-1)).toEqual([3])
})

function drop(list, num) {
    if(!list) throw new Error("take needs a list to take from")
    if(typeof num === 'undefined') num = 1
    if(num < 0) return list.slice(0,list.length+num)
    return list.slice(num)
}
// * __drop__: return list with the number of elements removed from the start. `drop([1,2,3],1) = [2,3]`
test('drop from list',() => {
    expect(drop([1,2,3],1)).toEqual([2,3])
    expect(drop([1,2,3],-1)).toEqual([1,2])
    expect(drop([1,2,3],4)).toEqual([])
})

function join(a,b) {
    if(!Array.isArray(a)) a = [a]
    return a.concat(b)
}
// * __join__: concatentate two lists, returning a new list. is this needed?
test('join lists',() => {
    expect(join([1,2,3],[4,5,6])).toEqual([1,2,3,4,5,6])
    expect(join([1],[4,5,6])).toEqual([1,4,5,6])
    expect(join(1,[4,5,6])).toEqual([1,4,5,6])
    expect(join([1,2,3],[4])).toEqual([1,2,3,4])
    expect(join([1,2,3],4)).toEqual([1,2,3,4])
})

function map(list,cb) {
    return list.map(cb)
}
// * __map__:  convert every element in a list using a lambda function: `(list, lam)`
test('map a list',()=>{
    expect(map([1,2,3],x=>x*2)).toEqual([2,4,6])
    expect(map(range(3),x=>x*2)).toEqual([0,2,4])
})
// * __for__:  loops over every element in a list with a lambda, but returns the original list: `(list, lam)`

// * __sort__: sort list returning a new list, by: property to use for sorting `sort(data by:"date")` (should we use `order` instead?)
function sort(list,opts) {
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
function reverse(list) {
    return list.reverse()
}
test('sorting a list',()=>{
    expect(sort([3,1,2])).toEqual([1,2,3])
    expect(reverse(sort([3,1,2]))).toEqual([3,2,1])
    expect(sort([{name:'josh'},{name:'billy'},{name:'zach'}])).toEqual([{name:'josh'},{name:'billy'},{name:'zach'}])
    expect(sort([{name:'josh'},{name:'billy'},{name:'zach'}],{by:'name'})).toEqual([{name:'billy'},{name:'josh'},{name:'zach'}])
})


//TODO: how can I test this?
// __pick__: take random elements from list `pick(data,5)` get five random elements
test('pick randomly from a list',()=>{
    // expect(pick([1,2,3],2))
})

// * __select__: select items from list using where: lambda function returning false. `select(data, where=(t)=>t.amount>0)`
// * __sum__: adds all data points together
function sum(list) {
    return list.reduce((a,b)=>a+b)
}
test('sum elements',() => {
    expect(sum([1,2,3])).toEqual(6)
    expect(sum(range(5))).toEqual(0+1+2+3+4)
})