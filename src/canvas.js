import {useEffect, useRef} from 'react'
import {Primitive} from './base.js'

export class CanvasResult extends Primitive {
    constructor(cb) {
        super()
        this.cb = cb
    }
}

export const is_canvas_result = (val) => val instanceof CanvasResult


export function CanvasView({result}) {
    let ref = useRef()
    useEffect(() => {
        if (ref.current) {
            result.cb(ref.current)
        }
    })
    return <canvas width={600} height={300} ref={ref}/>
}
