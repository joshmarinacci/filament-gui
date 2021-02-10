import {scalar, Scope} from '../../filament-lang/src/ast.js'
import {
    add, and, convertunit,
    divide, equal,
    factorial, greaterthan, greaterthanorequal,
    is_prime,
    lessthan,
    lessthanorequal,
    mod,
    multiply,
    negate, not, notequal, or,
    power,
    subtract
} from '../../filament-lang/src/math.js'
import {drop, get_field, join, length, map, range, reverse, select, sort, sum, take} from '../../filament-lang/src/lists.js'
import {dataset} from '../../filament-lang/src/dataset.js'
import {Parser} from '../../filament-lang/src/parser.js'
import fs from 'fs'

let g2_source = fs.readFileSync(new URL("../src/lang/filament.ohm", import.meta.url)).toString()

function eval_unicode(name, tests) {
    let scope = new Scope('unicode')
    scope.install(add,subtract,multiply,divide, power,mod, negate, factorial, is_prime)
    scope.install(lessthan,lessthanorequal,equal,notequal,greaterthanorequal,greaterthan,and,or,not)
    scope.install(range,length,take,drop,join,reverse,map, get_field, select,sort,sum)
    scope.install(dataset)
    scope.install(convertunit)
    scope.set_var('pi',scalar(Math.PI))
    let parser = new Parser(scope,g2_source)
    tests.map(tcase => {
        console.log("eval ast test case",tcase)
        let [code,val] = tcase
        let match = parser.parse(code)
        let ast = parser.semantics(match).unicode()
        console.log("unicode: ",ast)
    })
}

eval_unicode('simple pipeline',[
    ['4*5 >> 7'],
    ['x <> y'],
])
