import {useEffect, useRef} from 'react'
import {is_canvas_result, is_color, is_error_result, is_gradient, is_list, is_scalar, is_string} from './lang.js'

const ErrorResult = ({result}) => <div>error!!! <b>{result.toString()}</b></div>
const ScalarResult = ({result}) => <div>Scalar <b>{result.toString()}</b></div>
const StringResult = ({result}) => <div>String <b>{result.toString()}</b></div>

function ListResult({result}) {
    return <div>List {result.map(v => <ResultArea result={v}/>)}</div>
}

function CanvasResultResult({result}) {
    let ref = useRef()
    useEffect(() => {
        if (ref.current) {
            result.cb(ref.current)
        }
    })
    return <canvas width={600} height={300} ref={ref}/>
}

function GradientResult({result}) {
    return <div>gradient here</div>
}

export function ResultArea({result}) {
    console.log('result is', result)
    if (is_error_result(result)) return <ErrorResult result={result}/>
    if (is_scalar(result)) return <ScalarResult result={result}/>
    if (is_string(result)) return <StringResult result={result}/>
    if (is_list(result)) return <ListResult result={result}/>
    if (is_color(result)) return <ColorResult result={result}/>
    if (is_gradient(result)) return <GradientResult result={result}/>
    if (is_canvas_result(result)) return <CanvasResultResult result={result}/>
    if (result === null) return <div>result is <b>null</b></div>
    return <div>unknown result here</div>
}

function ColorResult({result}) {
    let col = result.toHexColorString()
    return <div>Color <b style={{backgroundColor: col}}>{col}</b></div>
}