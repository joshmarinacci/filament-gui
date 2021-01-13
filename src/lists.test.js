/**
 * @jest-environment jsdom
 */


import {add} from './math.js'
import {drop, length, join, map, range, reverse, select, sort, sum, take} from "./lists.js"

test('make list with range', () => {
    expect(range(3)).toEqual([0,1,2])
    expect(range(10)).toEqual([0,1,2,3,4,5,6,7,8,9])
    expect(range(3,8)).toEqual([3,4,5,6,7])
    expect(range(0,5)).toEqual([0,1,2,3,4])
    expect(range(3,8,3)).toEqual([3,6])
    expect(range(-10,0,3)).toEqual([-10,-7,-4,-1])
})

test('list length', ()=>{
    expect(length([1,2,3])).toEqual(3)
    expect(length(range(10))).toEqual(10)
    expect(length(range(-5,0))).toEqual(5)
})

test("take from list",()=>{
    expect(take([1,2,3],2)).toEqual([1,2])
    expect(take([1,2,3],4)).toEqual([1,2,3])
    expect(take([1,2,3],-1)).toEqual([3])
})

test('drop from list',() => {
    expect(drop([1,2,3],1)).toEqual([2,3])
    expect(drop([1,2,3],-1)).toEqual([1,2])
    expect(drop([1,2,3],4)).toEqual([])
})

test('join lists',() => {
    expect(join([1,2,3],[4,5,6])).toEqual([1,2,3,4,5,6])
    expect(join([1],[4,5,6])).toEqual([1,4,5,6])
    expect(join(1,[4,5,6])).toEqual([1,4,5,6])
    expect(join([1,2,3],[4])).toEqual([1,2,3,4])
    expect(join([1,2,3],4)).toEqual([1,2,3,4])
})

test('map a list',()=>{
    expect(map([1,2,3],x=>x*2)).toEqual([2,4,6])
    expect(map(range(3),x=>x*2)).toEqual([0,2,4])
    expect(map(range(3), (x)=>add(x,5))).toEqual([5,6,7])
})
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
test('select',() => {
    expect(select([1,2,3], {where:(x)=>x>1})).toEqual([2,3])
})
test('sum elements',() => {
    expect(sum([1,2,3])).toEqual(6)
    expect(sum(range(5))).toEqual(0+1+2+3+4)
})