import {Parser} from '../src/lang/parser.js'
import fs from 'fs'

const scalar = n => ({ type:'scalar', value:n})
const list = arr => ({ type:'list', value:arr})
const call = (name,...args) => {
    return {
        type:'call',
        name:name,
        args:[...args],
    }
}
const indexed = v => ({type:'indexed', value:v})
const named   = (n,v) => ({type:'named', value:v})

const std_list = list([scalar(4),scalar(2),scalar(42)])


let grammar_source = fs.readFileSync(new URL('../src/lang/grammar.ohm', import.meta.url)).toString();
function verify_ast_to_string(name, tests) {
    let parser = new Parser({}, grammar_source)
    test(name, (t)=>{
        let proms = tests.map((tcase) => {
            console.log("case",tcase)
        })
    })
}

verify_ast_to_string("literals",[
    ['[4,2,42]','[4,2,42]'],
    ['[4, 2, 42]','[4,2,42]'],
    ['[4_, _2, 4_2]','[4,2,42]'],
])
// verify_ast_to_string("funcalls",[

// ])
// verify_ast_objects("literals",[
//     ['[4,2,42]',std_list],
// ])
// verify_ast_objects("funcalls",[
//     ['length([4,2,42])',call('length',indexed(std_list))],
//     ['take(count:2, data:[4,2,42])',call('take',named("count",scalar(2)), named("data",std_list))],
//     ['take([4,2,42],count:2)',call('take',indexed(std_list),named("count",scalar(2)))],
//     ['take([4,2,42],2)',call('take',indexed(std_list),indexed(scalar(2)))],
// ])

