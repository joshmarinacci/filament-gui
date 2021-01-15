import {CanvasResult} from './canvas.js'

export function chart(data,{width=300, height=400}) {
    return new CanvasResult((canvas)=>{
        let ctx = canvas.getContext('2d')
        ctx.fillStyle = 'blue'
        ctx.fillRect(0,0,100,100)
    })
}