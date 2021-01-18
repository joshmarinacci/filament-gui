import {useEffect, useRef} from 'react'

import {CanvasView, is_canvas_result} from './canvas.js'
import {is_error_result, is_list, is_scalar, is_string} from './base.js'

const ErrorResult = ({result}) => <div>error!!! <b>{result.toString()}</b></div>
const ScalarResult = ({result}) => <div><b>{result.toString()}</b></div>
const StringResult = ({result}) => <div>String <b>{result.toString()}</b></div>

function ListResult({result}) {
    if(result.length > 100) {
        let start = result.slice(0,90)
        let end = result.slice(result.length-10)
        let res1 = start.map((v,i) => [<ResultArea key={i} result={v}/>,','])
        let res2 = end.map((v,i) => [<ResultArea key={i+90} result={v}/>,','])
        return <div className={'list-result'}>list: {res1} ... {res2}</div>
    }
    let res = result.map((v,i) => [<ResultArea key={i} result={v}/>,','])
    return <div className={'list-result'}>list: {res}</div>
}

const is_table = (result) => (result && result.data)?true:false

function TableRow({item, schema}) {
    let cells = Object.keys(schema.properties).map(key => {
        return <td key={key}>{item[key]}</td>
    })
    return <tr>{cells}</tr>
}

function TableView({result}) {
    let header = Object.keys(result.data.schema.properties).map(key => {
        let sch = result.data.schema.properties[key]
        let title = key
        // if(sch.title) title = sch.title
        return <th key={key}>{title}</th>
    })
    let items = result.data.items.map((it,n) => {
        return <TableRow key={n} item={it} schema={result.data.schema}/>
    })
    return <table className={'table-result'}>
        <thead>
            <tr>{header}</tr>
        </thead>
        <tbody>
        {items}
        </tbody>
    </table>
}

export function ResultArea({result}) {
    if (is_error_result(result)) return <ErrorResult result={result}/>
    if (is_scalar(result)) return <ScalarResult result={result}/>
    if (is_string(result)) return <StringResult result={result}/>
    if (is_list(result)) return <ListResult result={result}/>
    if (is_canvas_result(result)) return <CanvasView result={result}/>
    if (is_table(result)) return <TableView result={result}/>
    if (result === null) return <div>result is <b>null</b></div>
    console.log('result is',result)
    return <div>unknown result here</div>
}

function ColorResult({result}) {
    let col = result.toHexColorString()
    return <div>Color <b style={{backgroundColor: col}}>{col}</b></div>
}