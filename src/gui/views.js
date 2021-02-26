import {useEffect, useRef} from 'react'

import {CanvasView} from '../canvas.js'
import {is_boolean, is_scalar, is_canvas_result, is_error_result, is_list} from 'filament-lang'
import {is_string} from 'filament-lang'

const ErrorResult = ({result}) => <div>error!!! <b>{result.toString()}</b></div>
const ScalarResult = ({result}) => <div><b>{result.toString()}</b></div>
const StringResult = ({result}) => <div>String <b>{result.toString()}</b></div>
const BooleanResult = ({result}) => <div><b>{result.toString()}</b></div>
const StringView = ({result}) => <div><b>{result.toString()}</b></div>


function ListResult({result}) {
    if(result.value.length > 100) {
        let start = result.value.slice(0,90)
        let end = result.value.slice(result.value.length-10)
        let res1 = start.map((v,i) => [<ResultArea key={i} result={v}/>,','])
        let res2 = end.map((v,i) => [<ResultArea key={i+90} result={v}/>,','])
        return <div className={'list-result'}>list: {res1} ... {res2}</div>
    }
    let res = result.value.map((v,i) => [<ResultArea key={i} result={v}/>,','])
    return <div className={'list-result'}>list: {res}</div>
}

const is_table = (result) => (result && result.type === 'table')?true:false
const is_image = (result) => {
    if(result && result.width && result.height && result.data) return true
    if(result && result instanceof Image) return true
    if(result && result instanceof HTMLCanvasElement) return true
    return false
}
const is_date = (result) => {
    if(result && result.type === 'date') return true
    return false
}
const is_time = (result) => {
    if(result && result.type === 'time') return true
    return false
}


function TableRow({item, schema}) {
    let cells = Object.keys(schema.properties).map(key => {
        return <td key={key}>{item[key]}</td>
    })
    return <tr>{cells}</tr>
}

function TableView({result}) {
    let header = Object.keys(result.schema.properties).map(key => {
        let sch = result.schema.properties[key]
        let title = key
        // if(sch.title) title = sch.title
        return <th key={key}>{title}</th>
    })
    let items = result._map((it,n) => {
        return <TableRow key={n} item={it} schema={result.schema}/>
    })
    return <div className={'table-wrapper'}>
        <table className={'table-result'}>
            <thead>
                <tr>{header}</tr>
            </thead>
            <tbody>
            {items}
            </tbody>
        </table>
    </div>
}

function ImageView({result}) {
    const can = useRef()
    useEffect(()=>{
        if(can.current) {
            if(result.data) {
                let arr = Uint8ClampedArray.from(result.data)
                let id = new ImageData(arr, result.width, result.height)
                let ctx = can.current.getContext('2d')
                ctx.putImageData(id, 0, 0)
            } else {
                if(result instanceof HTMLImageElement) {
                    let ctx = can.current.getContext('2d')
                    ctx.drawImage(result,0,0)
                    // let dt = ctx.getImageData(0,0,result.width,result.height)
                }
                if(result instanceof HTMLCanvasElement) {
                    let ctx = can.current.getContext('2d')
                    ctx.drawImage(result,0,0)
                    // let dt = ctx.getImageData(0,0,result.width,result.height)
                }
            }
        }
    })
    return <div>
        <p>got an image {result.width} x {result.height}</p>
        <canvas ref={can} width={result.width} height={result.height}/>
    </div>
}


export function ResultArea({result}) {
    if (is_error_result(result)) return <ErrorResult result={result}/>
    if (is_scalar(result)) return <ScalarResult result={result}/>
    if (is_boolean(result)) return <BooleanResult result={result}/>
    if (is_string(result)) return <StringResult result={result}/>
    if (is_list(result)) return <ListResult result={result}/>
    if (is_canvas_result(result)) return <CanvasView result={result}/>
    if (is_table(result)) return <TableView result={result}/>
    if (is_image(result)) return  <ImageView result={result}/>
    if (result === null) return <div>result is <b>null</b></div>
    if (is_date(result)) return <StringView result={result}/>
    if (is_time(result)) return <StringView result={result}/>
    console.log('result is',result)
    return <div>unknown result here</div>
}

function ColorResult({result}) {
    let col = result.toHexColorString()
    return <div>Color <b style={{backgroundColor: col}}>{col}</b></div>
}