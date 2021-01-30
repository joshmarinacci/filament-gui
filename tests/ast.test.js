import test from "tape"
import fs from 'fs'
import ohm from 'ohm-js'

const scalar = n => ({
    type:'scalar',
    value:n,
    toString:function() {
        return (""+this.value)
    }
})
const string = n => ({
    type:'string',
    value:n,
    toString:function() {
        return `"${this.value}"`
    }
})
const list = arr => ({
    type:'list',
    value:arr,
    toString:function() {
        return `[${this.value.join(",")}]`
    }
})
const call = (name,...args) => {
    return {
        type:'call',
        name:name,
        args:[...args],
    }
}
const indexed = v => ({type:'indexed', value:v})
const named   = (n,v) => ({type:'named', value:v})



let grammar_source = fs.readFileSync(new URL('../src/lang/grammar.ohm', import.meta.url)).toString();
let grammar = ohm.grammar(grammar_source);
let semantics = grammar.createSemantics();
const strip_under = s => s.replaceAll("_","")
semantics.addOperation('ast',{
    // _terminal: function() {  return this.sourceString;  },
    number_integer:function(a) {
        return scalar(parseInt(strip_under(a.sourceString)))
    },
    number_hex:function(_,a) {
        return scalar(parseInt(strip_under(a.sourceString),16))
    },
    string:function(_1,str,_2) {
        return string(str.sourceString)
    },
    List_full:function(a,b,c,d,e) {
        let arr = d.ast().slice()
        arr.unshift(b.ast())
        return list(arr)
    }
})

function verify_ast_to_string(name, tests) {
    test(name, (t)=>{
        Promise.allSettled(tests.map((tcase) => {
            console.log("tcase",tcase)
            let [code,ans] = tcase
            console.log("case",code,' -> ', ans)
            let match = grammar.match(code)
            let ast = semantics(match).ast()
            console.log("ast",ast)
            console.log("final",ast.toString())
            t.deepEqual(ast.toString(),ans)
        })).then(()=>t.end())
    })
}


function test_literals() {
    verify_ast_to_string("literals", [
        //integers
        ['4', '4'],
        ['42', '42'],
        ['4_2', '42'],

        //floating point
        // ['4.2','4.2'],
        // ['04.2','4.2'],
        // ['4.20','4.2'],
        // ['4_._2','4.2'],

        //hex
        ['0x42', '66'],

        //lists
        ['[4,2,42]', '[4,2,42]'],
        ['[4, 2, 42]', '[4,2,42]'],
        // ['[4.2, 02.4, 4_2]', '[4,2,42]'],

        //underscores
        ['[4_, _2, 4_2]', '[4,2,42]'],

        //strings
        [`"fortytwo"`, `"fortytwo"`],
        [`"forty two"`, `"forty two"`],
        [`'forty two'`, `"forty two"`],

        // [`["forty two", '42']`,`["fortytwo","42"]`]

        //booleans
        // ['true','true'],
        // ['TRUE','true'],
        // ['false','false'],
        // ['_Fa_lSE','false'],
    ])
}


function test_comments() {
    verify_ast_to_string("comments", [
        ['//comment', "//comment"],
        ['//42 * 58',"//42 * 58"],
        ['//    text    ',"//    text    "],
    ])
}

function test_units() {
    verify_ast_to_string("literals", [
        [`42m`,"42 meter"],
        [`42ft`,"42 foot"],
        [`42m/s`,"42 meter/second"],
        ['42%','0.42'],
        ['42 %','0.42'],
        ['42 ft as in','42 foot as inch'],
        ['42 feet as inches','42 foot as inch'],
    ])
}

function test_variable_assignment() {
    verify_ast_to_string("variables and identifiers", [
        [`aprime << 13`, `aprime << 13`],
        [`a_prime<< 13`, `aprime << 13`],
        [`APRIME << 13`, `aprime << 13`],
        [`aPrime << 13`, `aprime << 13`],
        ['42 >> answer','42 >> answer'],
        ['answer << 42','42 >> answer'],
        ['answer24 << 42','42 >> answer24'],
        ['answ24er << 42','42 >> answ24er'],
        ['_a_n_sw24er << 42','42 >> answ24er'],
    ])
}

function test_operators() {
    verify_ast_to_string("binary operators", [
        ['4+2','add(4,2)'],
        ['4-2','subtract(4,2)'],
        ['4*2','multiply(4,2)'],
        ['4/2','divide(4,2)'],
        ['4**2','power(4,2)'],
        ['4 mod 2','mod(4,2)'],
    ])
    verify_ast_to_string('boolean operators',[
        ['4<2','lessthan(4,2)'],
        ['4 > 2','greaterthan(4,2)'],
        ['4 = 2','equal(4,2)'],
        ['4 <> 2','notequal(4,2)'],
        ['4 <= 2', 'lessthanorequal(4,2)'],
        ['4 >= 2', 'greaterthanorequal(4,2)'],
        ['true and false', 'and(true,false)'],
        ['true or false', 'or(true,false)'],
    ])

    verify_ast_to_string('unary operators',[
        ['-42','-42'],
        ['-4/2','-4/2'],
        ['4!','factorial(4)'],
        ['not x','not(x)'],
    ])
}

function test_function_calls() {
    verify_ast_to_string("function calls", [
        ['func(42)','func(42)'],
        ['func([42])','func([42])'],
        ['func(data:42)','func(data:42)'],
        ['func(data:[42],count:42)','func(data:[42], count:42)'],
        ['func(count:42, data)','func(data, count:42)'],
        ['func(func(42))','func(func(42))'],
        ['func(data,func(42))','func(data,func(42))'],
        //func(count:foo,func())
        ['func(count:data, func(42))','func(func(42), count:data)'],
        //func(count:func(),data:[]),
        ['func(count:func(42), data:[42])','func(count:func(42), data:[42])'],
        ['func(count:func,func(),func)','func(func(),func,count:func)'],
    ])
}

function test_pipelines() {
    verify_ast_to_string("pipelines", [
        ['func() >> funk()','func() >> funk()'],
        ['func([42]) >> funk()','func([42]) >> func()']
        ['func(arg: _42, [4_2 ],) >> func(count:42) >> funk(42) >> answer',
            'func([42], arg:42) >> func(count:42) >> func(42) >> answer']
    ])
}

function test_blocks() {
    verify_ast_to_string("blocks", [
        [`4
          2`,'4\n2'],
        [`4*2
          2+4`,'4*2\n2+4'],
        [`add(4,2)`,`add(4,2)`],
        [`add([4,2,3])`,'add([4,2,3])'],
        ['add(4,2) sub(4,2)','add(4,2)\nsub(4,2)'],
        [`
        foo << 2
        
        foo + 4_0
        `,"foo<<2\nfoo+40"],
        [`pokemons << dataset('pokemon')
          take(pokemon,5) >> chart(pokemon, y:"attack", xLabel:'name')
        `,'dataset("pokemon")\ntake(pokemon,5) >> chart(pokemon, y:"attack", xlabel:"name")'],
    ])
}

function test_unicode_replacement() {
    verify_ast_to_string("unicode", [
        ['ø','theta'],
        ['π','pi'],
        ['','alpha'],
        ['','sigma'],
        ['','<<'],
        ['','>>'],
        ['','<>']
    ])

}
function test_conditionals() {
    verify_ast_to_string('conditionals',[
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
    verify_ast_to_string('function definitions',[
        [`def chart(data=?,x="index",y="value") {
              log("doing a chart")
              42 
              }`,'def chart(data=? x="index", y="value") {\nlog("doing a chart")\n42\n}\n"'],
            [`def get_attack(pokemon) { pokemon.attack }`,"def get_attack(pokemon=?) {\npokemon.attack\n}\n"],
    ])
}
function doAll() {
    test_literals()
    // test_operators()
    // test_units()
    // test_function_calls()
    // test_pipelines()
    // test_comments()
    // test_blocks()
    // test_variable_assignment()
    // test_unicode_replacement()
    // test_conditionals()
    // test_function_definitions()
}

doAll()

