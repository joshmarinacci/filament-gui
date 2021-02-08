import {all, l, s, b, setup_parser} from './util.js'
import {list, scalar, string} from '../ast.js'

beforeAll(() => setup_parser())

describe('syntax',() => {

    test('case identifier tests', async () => {
        await all([
            ['pi',s(Math.PI)],
            ['Pi',s(Math.PI)],
            ['pI',s(Math.PI)],
            ['p_i',s(Math.PI)],
            ['P_I',s(Math.PI)],
            ['PI_',s(Math.PI)],
            // ['_PI_',s(Math.PI)],
            // ['_PI',s(Math.PI)],
        ])
    })

    test.skip("unicode", async ()=>{
        await all([
            ['foo',ident("foo"),'foo',42],
            ['ø',ident('ø'),'theta',42],
            ['π','pi'],
            ['','alpha'],
            ['','sigma'],
            ['','<<'],
            ['','>>'],
            ['','<>']
        ])
    })

    test.skip('conditionals', async () => {
        await all([
            [`if true { 42 }`,'if(true, {42},{})'],
            [`if _false { 42 }`,'if(false,{42},{})'],
            [`if true { 42 } else { 24 }`,'if(true,{42},{24})'],
            [`value << if true {42} else {24}`,'if(true,{42},{24}) >> value'],
            [`if true {42} else {24} >> value`,'if(true,{42},{24}) >> value'],
            [`if true {42} >> value func()`,'if(true,{42}) >> value\nfunc()'],
            [`if true {func() 42} func()`,'if(true,{func()\n42},{})\nfunc()'],
        ])
    })

    test('function definitions', async () => {
        let s42 = scalar(42)
        let s24 = scalar(24)
        await all([
            ['{def foo() { 42 } foo()}', s42],
            ['{def foo(x:24) { x } foo(42)}', s42],
            ['{def foo(x:24) { x } foo()}', s24],
            ['{def foo(data:?) { take(data,1) } foo([42,24,24])}', list([s42])],
            ['{def double(x:?) { x*2} map([1,2,3],with:double)}', list([s(2), s(4), s(6)])],
            ['{def first_letter(v:?) { take(v,1)} map(["foo","bar"],with:first_letter)}', list([string("f"), string("b")])],
            //TODO: ['range(100, step:10) as jesse',list([string('ten'),string('4D'),'ten twenty thirty 4D fifty 6D 7D AD 9D'])]
            // [`def get_attack(pokemon) { pokemon.attack }`,"def get_attack(pokemon=?) {\npokemon.attack\n}\n"],
        ])
    })

    test.skip('comments', async () => {
        await all([
            ['//comment', null, "//comment", null],
            ['//42 * 58', null, "//42 * 58", null],
            ['//    text    ', null, "//    text    ", null],
        ])
    })

    test('variables and identifiers', async () => {
        await all([
            [`aprime<<13`, s(13)],
            [`a_prime << 13`,s(13)],
            [`APRIME << 13`,s(13)],
            [`13 >> aprime`,s(13)],
            ['42 >> answer', s(42)],
            ['answer << 42',s(42)],
            ['answer24 << 42',s(42)],
            ['answ24er << 42',s(42)],
            // ['42 >> _a_n_sw24er',s(42)],
        ])
    })

    test('variables as arguments', async () => {
        await all([
            [`{ 42 }`, scalar(42)],
            [`{ 42 24 }`, scalar(24)],
            [`{ 42 >> foo }`, scalar(42)],
            [`{ 42 >> foo 43 }`, scalar(43)],
            [`{ 42 >> foo 1+foo}`, scalar(43)],
            [`{ 42 >> foo add(1,foo)}`, scalar(43)],
            [`{ data << [1,2]  length(data)}`, scalar(2)],
        ])
    })

    test.skip('function calls', async () => {
        await all([
            //'func' function returns data or first arg
            ['func()', null],
            ['func(42)', s(42)],
            ['func([42])', call('func', [indexed(list([scalar(42)]))]), 'func([42])', list_42],
            ['func(data:42)', call('func', [named('data', scalar(42))]), 'func(data:42)', 42],
            ['func(data:[42],count:42)', call('func', [named('data', list([scalar(42)])), named('count', scalar(42))]), 'func(data:[42],count:42)', list_42],
            ['func(count:42, [42])', call('func', [named('count', scalar(42)), indexed(list([scalar(42)]))]), 'func(count:42,[42])', list_42],
            ['func(func(42))',call('func',[indexed(call('func',[indexed(scalar(42))]))]),'func(func(42))',_42],
            ['func(42,func(42))',
                call('func', [indexed(scalar(42)), indexed(call('func', [indexed(scalar(42))]))]),
                'func(42,func(42))', 42],
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
    })

    const list_42 = list([scalar(42)])
    test.skip("pipelines", async () => {
        await all([
            // ['func() >> funk()',null],
            ['func([42]) >> funk()',list_42],
            // ['func(42) >> func(count:42)',s(42)],
            // ['func(42) >> func(count:42) >> func(42)', s(42)],
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
    })

    test("blocks", async () => {
        await all([
            [`{4  2}`,s(2)],
            [`{4*2  2+4}`, s(6)],
            [`add(4,2)`,  s(6)],
            // [`add([4,2,3])`,'add([4,2,3])'],
            ['{ add(4,2) subtract(4,2) }', s(2)],
            // [`{ func() << func(2)
            // func(4_0) }`,  s(40)],
            // [`pokemons << dataset('pokemon')
            //   take(pokemon,5) >> chart(pokemon, y:"attack", xLabel:'name')
            // `,'dataset("pokemon")\ntake(pokemon,5) >> chart(pokemon, y:"attack", xlabel:"name")'],
        ])
    })
})
