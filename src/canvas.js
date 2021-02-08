import {useEffect, useRef} from 'react'

export function CanvasView({result}) {
    let ref = useRef()
    useEffect(() => {
        if (ref.current) {
            result.cb(ref.current)
        }
    })
    return <canvas width={600} height={300} ref={ref}/>
}
