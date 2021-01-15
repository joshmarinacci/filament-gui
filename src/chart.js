import {CanvasResult} from './canvas.js'
import {max} from './lists.js'


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

export function chart(data,{x,x_label,y,y_label}={width:300, height:400,}) {
    return new CanvasResult((canvas)=>{
        let ctx = canvas.getContext('2d')
        ctx.save()
        clear(ctx,canvas)
        if(data.data && data.data.items) data = data.data.items

        // console.log("data is",data,"y is",y)
        if(!x_label) x_label = 'index'
        if(!y_label) {
            if(y) {
                y_label = y
            } else {
                y_label = 'value'
            }
        }
        // ctx.scale(1,-1)
        // ctx.translate(0,-canvas.height)
        // draw_border(ctx, canvas)
        draw_bars(ctx,canvas,data,x_label,y)
        draw_legend(ctx,canvas,data,x_label,y_label)
        ctx.restore()
    })
}

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
    const bar_width = (canvas.width - edge_gap*2)/data.length
    let values = data
    if(y) {
        values = data.map(v => v[y])
    }
    let max_val = max(values)
    // console.log("max is",max_val)
    let scale = (canvas.height-edge_gap*2)/max_val

    data.forEach((datu,i)=>{
        let value = datu
        if(y) {
            value = datu[y]
        }
        let label = i+""
        if(label !== 'index') {
            // console.log("dataum",x_label,datu)
            label = datu[x_label]
        }

        ctx.fillStyle = 'aqua'
        ctx.fillRect(
            edge_gap+bar_width*i,
            canvas.height-value*scale - edge_gap,
            bar_width-bar_gap,
            value*scale)
        ctx.fillStyle = 'black'
        ctx.font = '10px sans-serif'
        ctx.fillText(label,edge_gap+bar_width*i, canvas.height-edge_gap + 15)
    })
}
