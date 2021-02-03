import test from "tape"
import fs from 'fs'

import {
    add,
    divide,
    equal,
    greaterthan, greaterthanorequal,
    lessthan,
    lessthanorequal,
    multiply, negate,
    notequal,
    power,
    subtract
} from "../src/lang/math.js"
import {FilamentFunction, Parser, REQUIRED} from '../src/lang/parser.js'
import {
    boolean,
    ident,
    list,
    scalar,
    string,
    indexed,
    block,
    call,
    named,
    pipeline_left,
    pipeline_right,
    fundef,
    Scope
} from '../src/lang/ast.js'
import {cached_json_fetch} from '../src/lang/util.js'
import {range, take, join, reverse} from "../src/lang/lists.js"



const strip_under = s => s.replaceAll("_","")
let g2_source = fs.readFileSync(new URL("../src/lang/filament.ohm", import.meta.url)).toString()
// let g2 = ohm.grammar(g2_source)
// let g2_semantics = g2.createSemantics()

const func = new FilamentFunction("func",{data:null},(data)=>data)
const funk = new FilamentFunction("funk",{data:null},(data)=>data)
const convertunit = new FilamentFunction('convertunit',{a:REQUIRED,b:REQUIRED},
    (a,b) => a.value)

function unpack(res) {
    if(res.type === 'scalar') return res.value
    return res
}

function verify_ast(name, tests) {
    let scope = new Scope()
    scope.install(add, subtract, multiply, divide)
    scope.install(power, negate)
    scope.install(lessthan, greaterthan, equal, notequal, lessthanorequal, greaterthanorequal)
    scope.install(func,funk)
    scope.install(convertunit)
    let parser = new Parser(scope,g2_source)
    test(name, (t)=>{
        Promise.allSettled(tests.map((tcase) => {
            console.log("tcase",tcase)
            let [code,obj,str,val] = tcase
            let match = parser.parse(code)
            let ast = parser.ast(match)
            console.log("ast",ast)
            t.deepLooseEqual(ast,obj)
            console.log("to string",ast.toString())
            t.deepEqual(ast.toString(),str)
            let prom = ast.evalJS(scope)
            return Promise.resolve(prom)
                .then(res => {
                    console.log("final result",res)
                    return unpack(res)
                })
                .then((res)=> t.deepEqual(res,val))
        })).then(()=>t.end())
    })
}

const is_scalar = (a) => a.type === 'scalar'

const is_list = (b) => b.type === 'list'





export const real_dataset = new FilamentFunction('dataset', {
        name:REQUIRED,
    },
    async function (name) {
        let url = `https://api.silly.io/api/list/${name.value}`
        this.log("loading",url)
        return await cached_json_fetch(url).then(json => {
            return list(json.data.items)
        })
    }
)

export const real_length = new FilamentFunction('length', {
        data:REQUIRED,
    },
    function(data) {
        this.log(data)
        return scalar(data.value.length)
    }
)


function eval_ast(name, tests) {
    let scope = new Scope()
    scope.install(add)
    scope.install(range)
    scope.install(take)
    scope.install(join)
    scope.install(reverse)
    scope.install(real_dataset)
    scope.install(real_length)
    // scope.install(add, subtract, multiply, divide)
    // scope.install(power, negate)
    // scope.install(lessthan, greaterthan, equal, notequal, lessthanorequal, greaterthanorequal)
    // scope.install(func,funk)
    // scope.install(convertunit)
    let parser = new Parser(scope,g2_source)
    test(name, t => {
        Promise.allSettled(tests.map(tcase => {
            console.log("eval ast test case",tcase)
            let [code,val] = tcase
            let match = parser.parse(code)
            if(match.failed()) t.error()
            let ast = parser.ast(match)
            console.log("ast",ast)
            return Promise.resolve(ast.evalFilament(scope))
                .then(r => t.deepEqual(r,val))
                .catch(e => {
                    console.log("error here",e)
                })
        })).then(() => t.end())
            .catch(e => {
                console.error(e)
            })
    })
}


function test_literals() {
    verify_ast("literals", [
        //integers
        ['4', scalar(4), '4', 4],
        ['42', scalar(42), '42', 42],
        ['4_2', scalar(42), '42', 42],

        //floating point
        ['4.2',scalar(4.2), '4.2', 4.2],
        ['04.2',scalar(4.2),'4.2',4.2],
        ['4.20',scalar(4.2),'4.2',4.2],
        ['4_._2',scalar(4.2),'4.2',4.2],

        //hex
        ['0x42', scalar(0x42), '66',0x42],

        //lists
        ['[4,2,42]', list([scalar(4),scalar(2),scalar(42)]), '[4,2,42]',[4,2,42]],
        ['[4, 2, 42]', list([scalar(4),scalar(2),scalar(42)]), '[4,2,42]',[4,2,42]],
        ['[4.2, 02.4, 4_2]', list([scalar(4.2),scalar(2.4),scalar(42)]), '[4.2,2.4,42]',[4.2,2.4,42]],

        //underscores
        ['[4_, _2, 4_2]',list([scalar(4),scalar(2),scalar(42)]), '[4,2,42]', [4,2,42]],

        //strings
        [`"fortytwo"`, string('fortytwo'), `"fortytwo"`,'fortytwo'],
        [`"forty two"`, string('forty two'), `"forty two"`,'forty two'],
        [`'forty two'`, string('forty two'),`"forty two"`,'forty two'],

        [`["fortytwo", 42]`,
            list([string("fortytwo"),scalar(42)]),
            `["fortytwo",42]`,
            ['fortytwo',42],
        ],

        //booleans
        ['true',boolean(true),'true',true],
        // ['TRUE',boolean(true),'true',true],
        ['false', boolean(false), 'false',false],
        // ['FalSE',boolean(false),'false',false],
    ])
}
function test_comments() {
    verify_ast("comments", [
        ['//comment', null, "//comment", null],
        ['//42 * 58', null, "//42 * 58", null],
        ['//    text    ', null, "//    text    ", null],
    ])
}
function test_units() {
    verify_ast("numbers with units", [
        [`42m`,scalar(42,'meter'),"42 meter",42],
        [`42ft`,scalar(42,'foot'),"42 foot",42],
        [`42mps`,scalar(42,'meter/second'),"42 meter/second",42],
        [`42mpss`,scalar(42,'meter/second/second'),"42 meter/second/second",42],
        ['42%', scalar(42,'percent'),'42 percent',42],
        // ['42 %',scalar(42,'percent'),'42 percent',42],
        ['42ft as inch',
            call('convertunit',[indexed(scalar(42,'foot')),indexed(ident("inch"))]),
            'convertunit(42 foot,inch)',42],
        ['42feet as inches',
            call('convertunit',[indexed(scalar(42,'foot')),indexed(ident("inches"))]),
            'convertunit(42 foot,inches)',42],
    ])
}
function test_variable_assignment() {
    verify_ast("variables and identifiers", [
        [`aprime<<13`,pipeline_left(scalar(13),'aprime'), `aprime<<13`,13],
        [`a_prime << 13`,pipeline_left(scalar(13),'aprime'), `aprime<<13`,13],
        [`APRIME << 13`,pipeline_left(scalar(13),'aprime'), `aprime<<13`,13],
        [`13 >> aPrime`,pipeline_right(scalar(13),'aprime'), `13>>aprime`,13],
        ['42 >> answer',pipeline_right(scalar(42),'answer'), '42>>answer',42],
        ['answer << 42',pipeline_left(scalar(42),'answer'), 'answer<<42',42],
        ['answer24 << 42',pipeline_left(scalar(42),'answer24'),'answer24<<42',42],
        ['answ24er << 42',pipeline_left(scalar(42),'answ24er'),'answ24er<<42',42],
        // ['42 >> _a_n_sw24er',pipeline_right(scalar(42),'answ24er'),'42>>answ24er',42],
    ])
}
function test_operators() {
    verify_ast("binary operators", [
        ['4+2',call('add',[indexed(scalar(4)),indexed(scalar(2))]),'add(4,2)',6],
        ['4-2',call('subtract',[indexed(scalar(4)),indexed(scalar(2))]),'subtract(4,2)',2],
        ['4*2',call('multiply',[indexed(scalar(4)),indexed(scalar(2))]),'multiply(4,2)',8],
        ['4/2',call('divide',[indexed(scalar(4)),indexed(scalar(2))]),'divide(4,2)',2],
        ['4**2',call('power',[indexed(scalar(4)),indexed(scalar(2))]),'power(4,2)',16],
        // ['4 mod 2',call('mod',[indexed(scalar(4)),indexed(scalar(2))]),'mod(4,2)',0],
    ])
    verify_ast('boolean operators',[
        ['4 < 2',call('lessthan',[indexed(scalar(4)),indexed(scalar(2))]),'lessthan(4,2)',false],
        ['4 > 2',call('greaterthan',[indexed(scalar(4)),indexed(scalar(2))]),'greaterthan(4,2)',true],
        ['4 = 2',call('equal',[indexed(scalar(4)),indexed(scalar(2))]),'equal(4,2)',false],
        ['4 <> 2',call('notequal',[indexed(scalar(4)),indexed(scalar(2))]),'notequal(4,2)',true],
        ['4 <= 2',call('lessthanorequal',[indexed(scalar(4)),indexed(scalar(2))]), 'lessthanorequal(4,2)',false],
        ['4 >= 2',call('greaterthanorequal',[indexed(scalar(4)),indexed(scalar(2))]), 'greaterthanorequal(4,2)',true],
        // ['true and false',call('and',[indexed(scalar(4)),indexed(scalar(2))]), 'and(true,false)',false],
        // ['true or false',call('or',[indexed(scalar(4)),indexed(scalar(2))]), 'or(true,false)',true],
    ])

    verify_ast('unary operators',[
        // ['-42',call('negate',[indexed(scalar(42))]),'negate(42)',-42],
        // ['-4/2',call('divide',[indexed(call('negate',[indexed(scalar(4))])),indexed(scalar(2))]),'divide(negate(4),2)',-2],
        // ['4!',call('factorial',[indexed(scalar(4))]),'factorial(4)',1*2*3*4],
        // ['not true',call('not',[indexed(boolean(true))]),'not(x)',false],
    ])
}
let _42 = scalar(42)
let list_42 = list([scalar(42)])
function test_function_calls() {
    verify_ast("function calls", [
        //'func' function returns data or first arg
        ['func()',call('func',[]),'func()',null],
        ['func(42)',call('func',[indexed(scalar(42))]),'func' +
        '(42)',42],
        ['func([42])',call('func',[indexed(list([scalar(42)]))]),'func([42])',list_42],
        ['func(data:42)',call('func',[named('data',scalar(42))]),'func(data:42)',42],
        ['func(data:[42],count:42)',call('func',[named('data',list([scalar(42)])),named('count',scalar(42))]),'func(data:[42],count:42)',list_42],
        ['func(count:42, [42])',call('func',[named('count',scalar(42)),indexed(list([scalar(42)]))]),'func(count:42,[42])',list_42],
        // ['func(func(42))',call('func',[indexed(call('func',[indexed(scalar(42))]))]),'func(func(42))',_42],
        ['func(42,func(42))',
            call('func',[indexed(scalar(42)),indexed(call('func',[indexed(scalar(42))]))]),
            'func(42,func(42))',42],
        // ['func(count:func,func(),func)',
        //     call('func',[
        //         named('count','func'),
        //         indexed(call('func',[])),
        //         indexed('func'),
        //     ])
        //     ,'func(count:func,func(),func)',
        //     call('func',[])
        // ],
    ])
}
function test_pipelines() {
    verify_ast("pipelines", [
        ['func() >> funk()',
            pipeline_right(
                call('func',[]),
                call('funk',[]),
            ),
            'func()>>funk()',null],
        ['func([42]) >> funk()',
            pipeline_right(
                call('func',[indexed( list([scalar(42)]) )]),
                call('funk',[])
            )
            ,'func([42])>>funk()',list_42],
        ['func(42) >> func(count:42)',
            pipeline_right(
                call('func',[indexed(scalar(42))]),
                call('func',[named('count',scalar(42))]),
            ),
            'func(42)>>func(count:42)', 42 ],
        ['func(42) >> func(count:42) >> func(42)',
            pipeline_right(
                call('func',[indexed(scalar(42))]),
                pipeline_right(
                    call('func',[named('count',scalar(42))]),
                    call('func',[indexed(scalar(42))]),
                ),
            ),
            'func(42)>>func(count:42)>>func(42)', 42],
        // ['func(arg: _42, [4_2 ]) >> func(count:42) >> funk(42) >> answer',
        //     pipeline_right(
        //         call('func',[
        //             named('arg',scalar(42)),
        //             indexed(list(scalar(42)))
        //         ])
        //     ),
        //     'func([42], arg:42) >> func(count:42) >> func(42) >> answer',
        // ]
    ])
}
function test_blocks() {
    verify_ast("blocks", [
        [`{4
          2}`,
            block([scalar(4),scalar(2)]),
            '4\n2',
            2
        ],
        [`{4*2
          2+4}`,
            block([
                call('multiply',[indexed(scalar(4)),indexed(scalar(2))]),
                call('add',[indexed(scalar(2)),indexed(scalar(4))]),

            ]),
            'multiply(4,2)\nadd(2,4)',
            6
        ],
        [`add(4,2)`,
            call('add',[indexed(scalar(4)),indexed(scalar(2))]),
            `add(4,2)`,
            6
        ],
        // [`add([4,2,3])`,'add([4,2,3])'],
        ['{ add(4,2) subtract(4,2) }',
            block([
                call('add',[indexed(scalar(4)),indexed(scalar(2))]),
                call('subtract',[indexed(scalar(4)),indexed(scalar(2))]),
            ]),
            'add(4,2)\nsubtract(4,2)',
            2
        ],
        // [`{ func() << func(2)
        // func(4_0) }`,
        //     block([
        //         pipeline_left(
        //             call("func",[]),
        //             call("func",[scalar(2)]),
        //         ),
        //         call('func',[indexed(scalar(40))])
        //     ]),
        //     "foo()<<2\nfunc(40)",
        //     scalar(40)
        // ],
        // [`pokemons << dataset('pokemon')
        //   take(pokemon,5) >> chart(pokemon, y:"attack", xLabel:'name')
        // `,'dataset("pokemon")\ntake(pokemon,5) >> chart(pokemon, y:"attack", xlabel:"name")'],
    ])
}
function test_unicode_replacement() {
    verify_ast("unicode", [
        ['foo',ident("foo"),'foo',42],
        ['ø',ident('ø'),'theta',42],
        ['π','pi'],
        ['','alpha'],
        ['','sigma'],
        ['','<<'],
        ['','>>'],
        ['','<>']
    ])

}
function test_conditionals() {
    verify_ast('conditionals',[
        [`if true { 42 }`,'if(true, {42},{})'],
        [`if _false { 42 }`,'if(false,{42},{})'],
        [`if true { 42 } else { 24 }`,'if(true,{42},{24})'],
        [`value << if true {42} else {24}`,'if(true,{42},{24}) >> value'],
        [`if true {42} else {24} >> value`,'if(true,{42},{24}) >> value'],
        [`if true {42} >> value func()`,'if(true,{42}) >> value\nfunc()'],
        [`if true {func() 42} func()`,'if(true,{func()\n42},{})\nfunc()'],
   ])
}
function test_function_definitions() {
    verify_ast('function definitions',[
        [
            `def chart(data:?,x:"index",y:"value") {
              42 
              }`,
            fundef("chart",[
                ['data','?'],
                ['x',string('index')],
                ['y',string('value')],
            ],block([scalar(42)])),
            'def chart(data:?,x:"index",y:"value") {42}',
            null
        ],
            // [`def get_attack(pokemon) { pokemon.attack }`,"def get_attack(pokemon=?) {\npokemon.attack\n}\n"],
    ])
}

function test_gui_examples() {
    const s = (n,u)=>scalar(n,u)
    const scalar_list = (...nums) => list(nums.map(n => scalar(n)))
    eval_ast('gui_examples',[
        ['add(1,2)',scalar(3)],
        [`[1,2,3]`,list([scalar(1),scalar(2),scalar(3)])],
        [`add([1,2], [3,4])`,list([scalar(4),scalar(6)])],
        [`range(min:0,max:20,step:5)`,list([scalar(0),scalar(5),scalar(10),scalar(15)])],
        ['take(range(10),2)',scalar_list(0,1)],
        ['take(range(min:0, max:100,step:10), 4)', list([scalar(0),scalar(10),scalar(20),scalar(30)])],
        [`join([1,2,3], [4,5,6])`,scalar_list(1,2,3,4,5,6)],
        [`reverse(range(11))`,scalar_list(10,9,8,7,6,5,4,3,2,1,0)],
        // [`range(10000)`],
        // [`chart(range(10))`],
        [`range(10) >> take(2)`,scalar_list(0,1)],
        // [`dataset('alphabet')`],
        [`dataset('alphabet') >> length()`,s(26)],
        [`{
            alpha << dataset('alphabet')
            length(alpha)
            }
        `,s(26)],
        // [`chart(dataset('alphabet'), x_label:'letter', y:'syllables')`],
        // [ `chart(dataset('elements'), x:'number', y:'weight', type:'scatter')`],
        [`dataset('planets') >> length()`,s(8)],
        // [ `dataset('planets') >> chart(type:'scatter', x:'orbital_radius',y:'mean_radius')`],
        // [ `dataset('tallest_buildings') >> take(count:5) >> chart(y:'height', x_label:'name')`],
        // [ `let countries = take(await dataset('countries'), 10)
        //    chart(countries, x_label:'name', y:(y)=>parseInt(y.population), y_label:'population')`],
        // [ `let states = await dataset('states')
        //     const first_letter = (s) => take(s.name, 1)
        //     states = map(states, first_letter)
        //     histogram(states)`],
        // [ `dataset('states') >> timeline(date:'statehood_date', name:'name')`],
        // [ `chart(stockhistory('AAPL'), y:'close')`],
    ])


}

function doAll() {
    test_gui_examples()
    test_literals()
    test_operators()
    test_units()
    test_function_calls()
    test_pipelines()
    // test_comments()
    test_blocks()
    // test_variable_assignment()
    // test_unicode_replacement()
    // test_conditionals()
    // test_function_definitions()
}

doAll()

