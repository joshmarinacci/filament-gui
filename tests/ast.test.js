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
    eval_case_under_conversion()
}

doAll()
