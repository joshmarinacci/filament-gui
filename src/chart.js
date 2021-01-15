import {CanvasResult} from './canvas.js'
import {max} from './lists.js'


export function chart(data,{width=300, height=400}) {
    return new CanvasResult((canvas)=>{
        let ctx = canvas.getContext('2d')
        ctx.save()
        // ctx.scale(1,-1)
        // ctx.translate(0,-canvas.height)
        // draw_border(ctx, canvas)
        draw_bars(ctx,canvas,data)
        ctx.restore()
    })
}

function draw_border(ctx, canvas) {
    ctx.fillStyle = 'white'
    ctx.lineWidth = 1.0
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.strokeStyle = 'black'
    ctx.strokeRect(3,3,canvas.width-6,canvas.height-6)
}

function draw_bars(ctx, canvas, data) {
    let edge_gap = 25
    let bar_gap = 10
    const bar_width = (canvas.width - edge_gap*2)/data.length
    let max_val = max(data)
    console.log("max is",max_val)
    let scale = (canvas.height-edge_gap*2)/max_val

    data.forEach((datum,i)=>{
        ctx.fillStyle = 'aqua'
        ctx.fillRect(
            edge_gap+bar_width*i,
            canvas.height-datum*scale - edge_gap,
            bar_width-bar_gap,
            datum*scale)
        ctx.fillStyle = 'black'
        ctx.fillText(i+"",edge_gap+bar_width*i+bar_width/2, canvas.height-edge_gap + 15)
    })
}
