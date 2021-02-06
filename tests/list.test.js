import {boolean, list, scalar} from '../src/lang/ast.js'
import {eval_ast} from './util.js'
import {drop, join, length, map, range, reverse, select, sort, sum, take} from '../src/lang/lists.js'
import {add} from '../src/lang/math.js'

const s = (n,u)=>scalar(n,u)
const t = boolean(true)
const f = boolean(false)

function eval_list_functions() {
    eval_ast("is_prime",[
        ['is_prime(4)',boolean(false)],
        ['is_prime(5)',boolean(true)],
        ['is_prime(53)',boolean(true)],
        ['range(10) >> map(with:is_prime)',list([f,f,t,t,f,t,f,t,f,f])],
        ['range(10) >> select(where:is_prime)',list([s(2),s(3),s(5),s(7)])],
    ])

    eval_ast('range',[
        ['range(3)',list([s(0),s(1),s(2)])],
        ['range(8,min:3)',list([s(3),s(4),s(5),s(6),s(7)])],
        ['range(8,3,step:3)',list([
            s(3),s(6)
        ])],
        ['range(max:0,min:-10,step:3)',list([s(-10),s(-7),s(-4),s(-1)])],
    ])

    eval_ast('list length', [
        ['length([1,2,3])',s(3)],
        ['length(range(10))',s(10)],
        ['length(range(min:-5,max:0))',s(5)],
    ])

    eval_ast("take from list",[
        ['take([1,2,3],2)',list([s(1),s(2)])],
        ['take([1,2,3],4)',list([s(1),s(2),s(3)])],
        ['take([1,2,3],-1)',list([s(3)])],
    ])


    eval_ast('drop from list',[
        ['drop([1,2,3],1)',list([s(2),s(3)])],
        ['drop([1,2,3],-1)',list([s(1),s(2)])],
        ['drop([1,2,3],4)',list([])],
    ])


    eval_ast('join lists',[
        ['join([1,2,3],[4,5,6])',list([s(1),s(2),s(3),s(4),s(5),s(6)])],
        ['join([1],[4,5,6])',list([s(1),s(4),s(5),s(6)])],
        ['join(1,[4,5,6])',list([s(1),s(4),s(5),s(6)])],
        ['join([1,2,3],[4])',list([s(1),s(2),s(3),s(4)])],
        ['join([1,2,3],4)',list([s(1),s(2),s(3),s(4)])],
        ['join(1,2)',list([s(1),s(2)])],
    ])

    // eval_ast('map a list',[
    //     ['map([1,2,3],x=>x*2)',list([2,4,6])],
    //     ['map(range(3),x=>x*2)',list([0,2,4])],
    //     ['map(range(3), (x)=>add(x,5))',list([5,6,7])],
    // ])

    eval_ast('sorting a list',[
        ['sort([3,1,2])',list([s(1),s(2),s(3)])],
        ['reverse(sort([3,1,2]))',list([s(3),s(2),s(1)])],
    //     // ['sort([{name:'josh'},{name:'billy'},{name:'zach'}])).toEqual([{name:'josh'},{name:'billy'},{name:'zach'}])
    // //     expect(sort([{name:'josh'},{name:'billy'},{name:'zach'}],{by:'name'})).toEqual([{name:'billy'},{name:'josh'},{name:'zach'}])
    ])

    // eval_ast('select',[
    // //     expect(select([1,2,3], {where:(x)=>x>1})).toEqual([2,3])
    // ])
    //
    eval_ast('sum elements',[
        ['sum([1,2,3])',s(6)],
        // ['sum(range(5))',s(0+1+2+3+4)],
    ])
}


eval_list_functions()
