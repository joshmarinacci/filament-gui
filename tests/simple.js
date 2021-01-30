import {tests} from './util.js'


tests('parsing 42 in different formats', [
    ['42',42],
    ['4.2',4.2],
    ['0x42',0x42],
    ['0XFF',0xFF],
    // ['4.2e2',420],
    // ['42e2',4200],
    ['42_000_000',42*1000*1000],
    // ['42%',0.42],
    // ['66.6%',0.666]
    // ['4.2 ft',[42,'ft']]
    [`"fortytwo"`,"fortytwo"],
    [`'fortytwo'`,"fortytwo"],
    [`[4,2,42]`,[4,2,42]],
]);

//- simple math + - * / using functions
// - math on lists directly

tests('arithmetic',[
    ['42',42],
    ['42+42',42+42],
    ['42-42',42-42],
    ['42*42',42*42],
    ['42/42',42/42],
    ['[1,2,3]+[1,2,3]',[2,4,6]],
    ['!4',2*3*4],
    ['4**2',16],
    ['-42',-42],
    // ['4 mod 2',4%2],
])

tests("strings",[
    [`"fortytwo"`,"fortytwo"],
    [`"forty two"`,"forty two"],
    [`"forty_two"`,"forty_two"],
])

tests("functions",[
    ['42',42],
    ['add(42,42)',84],
    ['subtract(42,42)',0],
    ['sum([1,2,3])',6],
    ['length([1,2,3])',3],
    ['range(5)',[0,1,2,3,4]],
    [`join([1,2,3], [4,5,6])`,[1,2,3,4,5,6]],
    [`range(min:0,max:20,step:5)`,[0,5,10,15]],
    [`length("forty")`,5],
    [`length(data:'forty')`,5],
    //  chart(dataset('alphabet'), x_label:'letter', y:'syllables')
])

tests('function composition', [
    ['take(range(5),2)',[0,1]],
    ['take(range(5),-2)',[3,4]],
    [`reverse(range(min:0,max:11))`,[10,9,8,7,6,5,4,3,2,1,0]],
    [`range(min:0,max:11) >> reverse()`,[10,9,8,7,6,5,4,3,2,1,0]],
    ['range(min:0, max:20, step:5)',[0,5,10,15]],
    // ['dataset(‘tallest_buildings’) >> take(count:5)',[]]
])