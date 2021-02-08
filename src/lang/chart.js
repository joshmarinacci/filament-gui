import {compareAsc, compareDesc, parse as parseDate, eachYearOfInterval, differenceInYears, format as formatDate} from 'date-fns'
import {FilamentFunction, REQUIRED} from './parser.js'
import {CanvasResult, is_string, string, unpack} from './ast.js'


function draw_legend(ctx, canvas, data, x_label, y_label) {
    let font_height = 20
    ctx.fillStyle = 'black'
    ctx.font = `${font_height}px sans-serif`
    let legend =`${x_label} vs ${y_label}`
    let metrics = ctx.measureText(legend)

    let xx = (canvas.width-metrics.width)/2
    let yy = font_height
    ctx.fillText(legend,xx,yy)
}

const max = (data) => data.reduce((a,b)=> unpack(a)>unpack(b)?a:b)


function draw_scatter(ctx, canvas, data, x, y) {
    let x_values = data._map((d,i) => data._get_field_from(x,d,i))
    let y_values = data._map((d,i) => data._get_field_from(y,d,i))
    let max_x = max(x_values)
    let max_y = max(y_values)
    let x_scale = canvas.width/max_x
    let y_scale = canvas.height/max_y

    data._forEach((datum,i) => {
        let vx = x_values[i]
        let vy = y_values[i]
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(vx*x_scale,canvas.height-vy*y_scale,2, 0, Math.PI*2)
        ctx.fill()
    })
}

export const chart = new FilamentFunction('chart',
    {
        data:REQUIRED,
        x:null,
        // x_label:null,
        y:null,
        // y_label:null,
        type:string('bar'),
    },
    function (data, x, y, type) {
    // this.log("running the chart with data",data,'y is',y)
    return new CanvasResult((canvas)=>{
        let ctx = canvas.getContext('2d')
        ctx.save()
        clear(ctx,canvas)
        if(data.data && data.data.items) data = data.data.items

        let x_label = 'index'
        let y_label = 'value'
        // if(!x_label) x_label = x?x:x_label
        // if(!x_label) x_label = 'index'
        // if(!y_label) y_label = y?y:y_label
        // if(!y_label) y_label = 'value'
        // ctx.scale(1,-1)
        // ctx.translate(0,-canvas.height)
        // draw_border(ctx, canvas)
        if(type.value === 'bar') {
            draw_bars(ctx,canvas,data,x_label,y)
            draw_legend(ctx,canvas,data,x_label,y_label)
        }
        if(type.value === 'scatter') {
            draw_scatter(ctx,canvas,data,x,y)
            draw_legend(ctx,canvas,data,x_label,y_label)
        }
        ctx.restore()
    })
})

function clear(ctx,canvas) {
    ctx.fillStyle = 'white'
    ctx.fillRect(0,0,canvas.width,canvas.height)
}

function draw_border(ctx, canvas) {
    ctx.fillStyle = 'white'
    ctx.lineWidth = 1.0
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.strokeStyle = 'black'
    ctx.strokeRect(3,3,canvas.width-6,canvas.height-6)
}

function draw_bars(ctx, canvas, data, x_label, y) {
    let edge_gap = 25
    let bar_gap = 10
    const bar_width = (canvas.width - edge_gap*2)/data._get_length()
    let get_y = (datum) => datum
    if(typeof y === 'function') get_y = y
    if(is_string(y)) get_y = (d,i) => data._get_field_from(y,d,i)
    // console.log("data is",data)
    let values = data._map(get_y)
    // console.log("values are",values)

    let max_val = max(values)
    // console.log("max is",max_val)
    let scale = (canvas.height-edge_gap*2)/max_val
    // console.log("scale is",scale)

    data._forEach((datu,i)=>{
        let value = get_y(datu,i)
        let label = i+""
        if(x_label !== 'index') label = datu[x_label]

        ctx.fillStyle = 'aqua'
        ctx.fillRect(
            edge_gap+bar_width*i,
            canvas.height-value*scale - edge_gap,
            bar_width-bar_gap,
            value*scale)
        ctx.fillStyle = 'black'
        ctx.font = '30px sans-serif'
        ctx.fillText(label,edge_gap+bar_width*i, canvas.height-edge_gap + 15)
    })
}

export const histogram = new FilamentFunction('histogram',{
    data:REQUIRED
}, function(data) {
    //count frequency of each item in the list
    //draw a barchart using frequency for height
    //use the key for the name
    return new CanvasResult((canvas)=>{
        let ctx = canvas.getContext('2d')
        ctx.save()
        clear(ctx,canvas)
        let freqs = {}
        data._map(datum => {
            let letter = unpack(datum)
            if(!freqs[letter]) freqs[letter] = 0
            freqs[letter] += 1
        })
        console.log(freqs)
        let entries = Object.entries(freqs)
        let w = canvas.width / entries.length
        let max_y = max(entries.map(pair => pair[1]))
        let hh = canvas.height/max_y
        entries.forEach((pair,i) => {
            const [name,count] = pair
            // console.log(name,count)
            ctx.fillStyle = 'aqua'
            let x = i*w
            let y = canvas.height - hh*count
            ctx.fillRect(x,y,w-5,hh*count)
            ctx.fillStyle = 'black'
            ctx.font = '10px sans-serif'
            ctx.fillText(name,i*w+5, canvas.height-20)
            ctx.fillText(count+"",i*w+5, canvas.height-10)
        })
        ctx.restore()
    })
})

export const timeline = new FilamentFunction('timeline',
    {
        data:REQUIRED,
        date:REQUIRED,
        name:REQUIRED,
    },
    function(data, date, name) {
    let get_date = (datum) => datum
    if(is_string(date)) get_date = (d,i) => {
        let dt = data._get_field_from(date,d,i)
        if(is_string(dt)) return parseDate(unpack(dt),'MMMM dd, yyyy', new Date())
        return dt
    }

    let date_values = data._map(get_date)
    date_values.sort((a,b)=>compareAsc(a,b))
    let min = date_values[0]
    let max = data._map(get_date)
    max.sort((a,b)=> compareDesc(a,b))
    max = max[0]
    let interval = {
        start:min,
        end:max,
    }
    return new CanvasResult((canvas)=>{
        let ctx = canvas.getContext('2d')
        ctx.save()
        clear(ctx,canvas)
        let width = canvas.width
        let height = canvas.height
        let pairs = data._map((datum,i) => {
            return {
                name:data._get_field_from(name,datum,i),
                date:get_date(datum,i)
            }
        })

        pairs.forEach((datum,i) => {
            ctx.fillStyle = 'aqua'
            ctx.fillStyle = 'black'
            let diff_x = differenceInYears(datum.date,min)
            let x = diff_x*10
            let y = 0
            ctx.fillRect(x,y,2,canvas.height-30)
            ctx.fillText(datum.name,x+2, (i%20)*10)
        })

        ctx.fillText(formatDate(min,'yyyy'),0,height-10)
        ctx.fillText(formatDate(max,'yyyy'),width-20,height-10)
        ctx.restore()
    })
}
)