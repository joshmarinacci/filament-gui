import {useEffect, useRef} from 'react'

export function CanvasView({result}) {
    let ref = useRef()
    useEffect(() => {
        if (ref.current) {
            result.cb(ref.current)
        }
    })
    return <canvas width={1200} height={600} ref={ref}/>
}
