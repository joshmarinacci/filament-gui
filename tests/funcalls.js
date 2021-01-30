import {tests} from './util.js'
import {drop, length, max, reverse, sort, sum, take} from '../src/lang/lists.js'
import {dataset} from '../src/lang/dataset.js'


let scope = {drop, length, max, reverse, sort, sum, take, dataset}

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


],{ scope })

tests("pipelines",[
    ['[4,2,42]',[4,2,42]],
    ['length([4,2,42])',3],
    ['take([4,2,42],count:2)',[4,2]],
    ['take([4,2,42],count:2) >> sort()',[2,4]],
    ['take([4,2,42],count:2) >> sort(order:"descending")',[4,2]],
],{ scope })



tests('async functions',[
    ['length(dataset("alphabet"))',26],
    [`dataset("alphabet") >> length()`,26],
    // [`dataset('tallest_buildings') >> take(count:5) >> length()`,[]]
],{scope})