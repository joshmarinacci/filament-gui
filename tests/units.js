import {scalar} from '../src/lang/ast.js'
import {eval_ast} from './util.js'

function eval_simple_unit_conversion() {
    eval_ast('numbers with units',[
        ['42m',scalar(42,'meter')],
        ['42m as feet',scalar(137.795,'foot')],
        ['42ft',scalar(42,'foot')],
    ])
}

eval_simple_unit_conversion()
