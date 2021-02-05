export const EXAMPLES = [
    // {
    //     title:'list',
    //     code:`[1,2,3]`
    // },
    {
        title:"average of list",
        code:`data << [1,2,3]
sum(data)/length(data)`
    },
    // {
    //     title:"double list",
    //     code:`map([1,2,3], x => x*2)`
    // },
    {
        title:"add lists",
        code:`[1,2,3] + [4,5,6]`
    },
    {
        title:`list 0 to 20 by 5's`,
        code:`range(min:0,max:20,step:5)`
    },
    {
        title:'last 5 in 0 to 100 by 10s',
        code:`
take(range(min:0, max:100,step:10), -5)
`
    },
//     {
//         title:'sort list of people by last name',
//         code:`let names = [
//     {first:'Josh', last:'Marinacci'},
//     {first:'Billy', last:'Bob'},
//     {first:'Zach', last:'Braff'},
// ]
// sort(names,{by:'last'})`
//     },
    {
        title:'join two lists',
        code:`join([1,2,3], [4,5,6])`
    },
    // {
    //     title:'select from list where multiple of 7',
    //     code:`select(range(0,100), {where:x=>x%7===0})`
    // },
    {
        title:'count down from 10 to zero',
        code:`reverse(range(11))`
    },
    {
        title:'huge list',
        code:`range(10000)`,
    },
    {
        title:'simple chart ',
        code:`chart(range(10))`,
    },
    {
        title:'pipeline example',
        code:`range(10) >> chart()`
    },
    // {
    //     title:'bars of x**2',
    //     code:`chart(map(range(0,10), x=>power(x,2)))`
    // },
    // {
    //     title:'bars of sin() 0->10',
    //     code:`chart(map(divide(range(0,100),10), x=>cos(x)))`
    // },
    {
        title:'alphabet data',
        code: `dataset('alphabet')`
    },
    {
        title:'length of data',
        code:`dataset('alphabet') >> length()`
    },
    {
        title:'syllables for each letter',
        code:`chart(dataset('alphabet'), x_label:'letter', y:'syllables')`
    },
    {
        title:"elements number vs weight",
        code: `chart(dataset('elements'), x:'number', y:'weight', type:'scatter')`
    },
    {
        title:"planets radius vs orbit radius",
        code:
`planets << dataset('planets')
chart(planets, type:'scatter', 
                  x:'orbital_radius',
                   y:'mean_radius')`
    },
    {
        title:'5 tallest buildings. name vs height',
        code:
`dataset('tallest_buildings') >> buildings
take(buildings,count:5) >> chart(y:'height', x_label:'name')
`
    },
    {
        title:'most populous countries',
        code:
`top_countries << take(dataset('countries'), 10)
chart(top_countries, x_label:'name', y:'population', y_label:'population')
`
    },
    {
        title:'histogram of states first letters',
        code:
`states << dataset('states')
def first_letter (state:?) {
   take(get_field(state,'name'), 1)
}
states << map(states, first_letter)
histogram(states)`
    },
    {
        title:'timeline of states entering the union',
        code: `dataset('states') >> timeline(date:'statehood_date', name:'name')`
    },
    {
        title:'history of apple stock last 5 years',
        code: `stockhistory('AAPL') >> chart(y:'close')`
    }
]
