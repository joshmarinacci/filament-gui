export const EXAMPLES = [
    {
        type:'group',
        title:'Arithmetic & Units',
        content:[
            {
                title:'basic arithmetic',
                code:`// follows standard precedence rules. mul > add
4*5 + 2*8`,
            },
            {
                title:'factorial',
                code:` // ! means factorial instead of NOT
!8`,
            },
            {
                title:'power',
                code:`// two to the 8th
2 ** 8
`,
            },
            {
                title:'convert feet to meters',
                code:`64ft as meters`
            },
            {
                title:'convert length to volume gallons',
                code:`8ft * 9ft * 10ft as gallons`
            },
            {
                title:'make random number between 0 and 10',
                code:`random(max:10)`
            },
            {
                title:'make 10 random number between 5 and 10',
                code:`//make 10 random numbers, each between 5 and 10
range(10) >> map(range, with: x->random(min: 5, max:10))`
            }
        ]
    },
    {
        type:'group',
        title:'dates and times',
        content:[
            {
                title:"make some dates",
                code:`
[
    date("July 27 2021", format:"MMMM dd yyyy"),
    date("8/8/08",       format:"MM/dd/yy"),
    date(year:2021, month:7, day:27)
]
`,
            },
            {
                title:"make some times",
                code:`
[
    time("3:42",format:"kk:mm"),
    time("14:42:33",format:"kk:mm:ss"),
    time("3:42pm",format:"hh:mmaa")
]
            `
            },
            {
                title:"duration math",
                code:`
[
    23hours + 60minutes as days,
    23min - 8s,
    80min * 6
]
                `,
            },
            {
                title:"math with dates and times",
                code:`
                [
//days until next christmas
date(month:12, day:25, year:2021) - today() as days,

// 8pm - 2am
time("8pm",format:"hhaa") - time("2am",format:"hhaa") as hours
]
`,
            },
        ]
    },
    {
        type:'group',
        title:'Lists',
        content:[
            {
                title:'simple list of numbers',
                code:`[5, 8, 44, 16]`
            },
            {
                title:'huge list',
                code:`//long lists will be rendered with ... in the middle
range(10000)`,
            },
            {
                title:"average of list of numbers",
                code:`data << [1,2,3,4]
sum(data)/length(data)`
            },
            {
                title:"double list with a lambda ",
                code:`map([1,2,3], x -> x*2)`
            },
            {
                title:"add two lists",
                code:`[1,2,3] + [4,5,6]`
            },
            {
                title:'list * number',
                code:`2 * [1,2,3]`
            },
            {
                title:'last 5 of 0 to 100 by 10s',
                code:`take(range(100,step:10), -5)`
            },
            {
                title:'all primes under 100',
                code:'range(100) >> select(where:is_prime)',
            },
            {
                title:'select from list where multiple of 7',
                code:`select(range(0,100), {where:x=>x%7===0})`
            },
        ]
    },
    {
        type:'group',
        title:'Charts and Datasets',
        content:[
            {
                title:'simple chart of 10 to zero ',
                code:`chart(reverse(range(10)))`,
            },
            {
                title:'alphabet data',
                code: `//info on ever letter in the alphabet\ndataset('alphabet')`
            },
            {
                title:'how many syllables in each letter',
                code:`dataset('alphabet') >> chart(x_label:'letter', y:'syllables')`
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
                  y:'mean_radius',
               size:'mean_radius',
               name:'name'
    )                  
                  `
            },
            {
                title:'5 tallest buildings. name vs height',
                code:`dataset('tallest_buildings') 
  >> take(count:5) 
  >> chart(y:'height', x_label:'name')`
            },
            {
                title:'most populous countries',
                code:
                    `top_countries << take(dataset('countries'), 10)
chart(top_countries, x_label:'name', y:'population', y_label:'population')
`
            },
            {
                title:'First Letters of US State Names',
                code:
                    `states << dataset('states')
def first_letter (state:?) {
   take(get_field(state,'name'), 1)
}
states << map(states, first_letter)
histogram(states)`
            },
            {
                title:'Timeline of US States entering the Union',
                code: `dataset('states') >> timeline(date:'statehood_date', name:'name')`
            },
            {
                title:'History of Apple stock closing price',
                code: `stockhistory('AAPL') >> chart(y:'close')`
            }
        ]
    },
    {
        type:'group',
        title:'Plotting Equations',
        content:[
            {
                title:'quadratic equation',
                code:`
quad << (x) -> x**2 - 3*x - 4
plot(y:quad)
`
            },
            {
                title:'sin() 0->10',
                code:`plot(y: x->sin(x))`
            },
        ]
    },
    {
        type:'group',
        title:'Image manipulation',
        content:[
            {title:'make red image',
            code:`
make_image(width:100,height:100) >> map_image(with:(x,y) -> {
    [1,0,0]
})
`},
            {
                title:'vertical stripes',
                code:`
red << [1,0,0]
green << [0,1,0]

stripe << (x,y,color) -> {
    if x mod 2 = 0 then red else green
}

// make red and green stripes
make_image(width:100,height:100) >> map_image(with:stripe)
        `
             },


            {
                title:'whitenoise',
                code:`
make_image(width:100, height: 100)
    >> map_image(with:(x,y,color) -> {
            n << random(min:0,max:1)
            [n,n,n]
    })`
            },

            {
                title:'load remote image',
                code:`load_image(src:'https://placekitten.com/200/300')`
            }

        ]
    }
]
