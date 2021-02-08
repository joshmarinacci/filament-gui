import {list, scalar, string} from '../ast.js'
import {all, setup_parser, l, s} from './util.js'

beforeAll(() => setup_parser())

describe('complex',() => {

    test("gui examples", async () => {
        await all([
            ['add(1,2)', s(3)],
            [`[1,2,3]`, l(1,2,3)],
            [`add([1,2], [3,4])`, l(4,6)],
            [`range(min:0,max:20,step:5)`, l(0,5,10,15)],
            ['take(range(10),2)', l(0, 1)],
            ['take(range(min:0, max:100,step:10), 4)', l(0,10,20,30)],
            [`join([1,2,3], [4,5,6])`, l(1, 2, 3, 4, 5, 6)],
            [`reverse(range(11))`, l(10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0)],
            // [`range(10000)`],
            // [`chart(range(10))`],
            [`range(10) >> take(2)`, l(0, 1)],
            // [`dataset('alphabet')`],
            [`dataset('alphabet') >> length()`, s(26)],
            [`{
            alpha << dataset('alphabet')
            length(alpha)
            }`, s(26)],
            // [`chart(dataset('alphabet'), x_label:'letter', y:'syllables')`],
            // [ `chart(dataset('elements'), x:'number', y:'weight', type:'scatter')`],
            [`dataset('planets') >> length()`, s(8)],
            // [ `dataset('planets') >> chart(type:'scatter', x:'orbital_radius',y:'mean_radius')`],
            // [ `dataset('tallest_buildings') >> take(count:5) >> chart(y:'height', x_label:'name')`],
            [`{countries << take(dataset('countries'), 10)
           length(countries)}`, s(10)],
            [`{states << dataset('states')
    def first_letter (state:?) {
       take(get_field(state,'name'), 1)
    }
    states << map(states, first_letter)
    take(states,1)
    }`, list([string('A')])],
            // [ `dataset('states') >> timeline(date:'statehood_date', name:'name')`],
            // [ `chart(stockhistory('AAPL'), y:'close')`],
        ])
    })
})
