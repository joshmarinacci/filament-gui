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
} from '../src/lang/ast.js'
import {eval_ast, verify_ast} from './util.js'


function test_comments() {
    verify_ast("comments", [
        ['//comment', null, "//comment", null],
        ['//42 * 58', null, "//42 * 58", null],
        ['//    text    ', null, "//    text    ", null],
    ])
}
function eval_simple_unit_conversion() {
    eval_ast('numbers with units',[
        ['42m',scalar(42,'meter')],
        ['42m as feet',scalar(137.795,'foot')],
        ['42ft',scalar(42,'foot')],
    ])
}

function verify_var_assignment() {
    verify_ast("variables and identifiers", [
        [`aprime<<13`,pipeline_left(ident('aprime'),scalar(13)), `aprime<<13`,13],
        // [`a_prime << 13`,pipeline_left(ident('aprime'),scalar(13)), `aprime<<13`,13],
        // [`APRIME << 13`,pipeline_left(scalar(13),'aprime'), `aprime<<13`,13],
        [`13 >> aprime`,pipeline_right(scalar(13),ident('aprime')), `13>>aprime`,13],
        ['42 >> answer',pipeline_right(scalar(42),ident('answer')), '42>>answer',42],
        // ['answer << 42',pipeline_left(scalar(42),'answer'), 'answer<<42',42],
        // ['answer24 << 42',pipeline_left(scalar(42),'answer24'),'answer24<<42',42],
        // ['answ24er << 42',pipeline_left(scalar(42),'answ24er'),'answ24er<<42',42],
        // ['42 >> _a_n_sw24er',pipeline_right(scalar(42),'answ24er'),'42>>answ24er',42],
    ])
}
function eval_var_assignment() {
    eval_ast('variables as arguments',[
        [`{ 42 }`, scalar(42) ],
        [`{ 42 24 }`, scalar(24) ],
        [`{ 42 >> foo }`,scalar(42)],
        [`{ 42 >> foo 43 }`,scalar(43)],
        [`{ 42 >> foo 1+foo}`,scalar(43)],
        [`{ 42 >> foo add(1,foo)}`,scalar(43)],
        [`{ data << [1,2]  length(data)}`,scalar(2)],
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
function verify_pipeline() {
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
                pipeline_right(
                    call('func',[indexed(scalar(42))]),
                    call('func',[named('count',scalar(42))]),
                ),
                call('func',[indexed(scalar(42))]),
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
function eval_function_definitions() {
    let s42 = scalar(42)
    let s24 = scalar(24)
    const s = (v) => scalar(v)

    eval_ast('function definitions',[
        ['{def foo() { 42 } foo()}',s42],
        ['{def foo(x:24) { x } foo(42)}',s42],
        ['{def foo(x:24) { x } foo()}',s24],
        ['{def foo(data:?) { take(data,1) } foo([42,24,24])}',list([s42])],
        ['{def double(x:?) { x*2} map([1,2,3],with:double)}',list([s(2),s(4),s(6)])],
        ['{def first_letter(v:?) { take(v,1)} map(["foo","bar"],with:first_letter)}',list([string("f"),string("b")])],
        //TODO: ['range(100, step:10) as jesse',list([string('ten'),string('4D'),'ten twenty thirty 4D fifty 6D 7D AD 9D'])]
          // [`def get_attack(pokemon) { pokemon.attack }`,"def get_attack(pokemon=?) {\npokemon.attack\n}\n"],
    ])
}

const s = (n,u)=>scalar(n,u)
function test_gui_examples() {
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
        [ `{countries << take(dataset('countries'), 10)
           length(countries)}`,s(10)],
        [ `{states << dataset('states')
    def first_letter (state:?) {
       take(get_field(state,'name'), 1)
    }
    states << map(states, first_letter)
    take(states,1)
    }`,list([string('A')])],
    // [ `dataset('states') >> timeline(date:'statehood_date', name:'name')`],
        // [ `chart(stockhistory('AAPL'), y:'close')`],
    ])


}



function eval_case_under_conversion() {
    eval_ast('case identifier tests',[
        ['pi',s(Math.PI)],
        ['Pi',s(Math.PI)],
        ['pI',s(Math.PI)],
        ['p_i',s(Math.PI)],
        ['P_I',s(Math.PI)],
        ['PI_',s(Math.PI)],
        // ['_PI_',s(Math.PI)],
        // ['_PI',s(Math.PI)],
    ])
}

function doAll() {
    test_gui_examples()
    test_function_calls()
    verify_pipeline()
    test_blocks()
    eval_simple_unit_conversion()
    verify_var_assignment()
    eval_var_assignment()
    eval_function_definitions()
    eval_case_under_conversion()
}
function doTest() {
    // test_comments()
    // test_unicode_replacement()
    // test_conditionals()
}

doAll()
doTest()
