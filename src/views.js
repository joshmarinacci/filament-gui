import {useEffect, useRef} from 'react'

import {CanvasView, is_canvas_result} from './canvas.js'
import {is_error_result, is_list, is_scalar, is_string} from './base.js'

const ErrorResult = ({result}) => <div>error!!! <b>{result.toString()}</b></div>
const ScalarResult = ({result}) => <div><b>{result.toString()}</b></div>
const StringResult = ({result}) => <div>String <b>{result.toString()}</b></div>

function ListResult({result}) {
    let res = result.map((v,i) => [<ResultArea key={i} result={v}/>,','])
    return <div className={'list-result'}>list: {res}</div>
}


export function ResultArea({result}) {
    if (is_error_result(result)) return <ErrorResult result={result}/>
    if (is_scalar(result)) return <ScalarResult result={result}/>
    if (is_string(result)) return <StringResult result={result}/>
    if (is_list(result)) return <ListResult result={result}/>
    if (is_canvas_result(result)) return <CanvasView result={result}/>
    if (result === null) return <div>result is <b>null</b></div>
    return <div>unknown result here</div>
}

function ColorResult({result}) {
    let col = result.toHexColorString()
    return <div>Color <b style={{backgroundColor: col}}>{col}</b></div>
}