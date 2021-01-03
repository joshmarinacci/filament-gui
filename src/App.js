import {useState} from 'react'
import './App.css'

import {EXAMPLES, NString, NScalar, NList} from "./test1.js"
import {SCOPE} from "./test1.js"


function real_eval(code) {
    let scope = {
        foo: () => console.log("doing foo"),
        scalar: (v) => new NScalar(v),
        string: v => new NString(v),
        list: v => new NList(v),
    }
    let defines = Object.keys(scope).map(key => {
        return `    const ${key} = scope.${key}`
    }).join("\n")
    let gen_code = `
"use strict"; 
return function(scope) {
    console.log('scope is',scope)
${defines}
    return ${code}
};
`
    console.log("generated code is", gen_code)
    try {
        return Function(gen_code)()(scope)
    } catch (e) {
        console.error(e)
        return e
    }
}

function App() {
    const [code, setCode] = useState('5+6')
    const [result, setResult] = useState(null)

    const doEval = (code) => {
        console.log("evaluating", code)
        let res = real_eval(code)
        console.log("result is", res)
        setResult(res)
    }

    return (
        <HBox fill>
            <VBox>
                {EXAMPLES.map(ex => <button
                    onClick={() => setCode(ex.code.split("\n")
                        .map(t => t.trim())
                        .filter(t => t.length > 0)
                        .join("\n"))}
                >{ex.title}</button>)}
            </VBox>
            <VBox grow>
                <textarea value={code}>some code is here</textarea>
                <button onClick={() => doEval(code)}>eval</button>
                <ResultArea result={result}/>
            </VBox>
            <VBox>
                {Object.values(SCOPE).map(fn => <div>docs for <b>{fn.title}</b> is </div>)}
            </VBox>
        </HBox>
    )
}

const VBox = ({children, grow=false}) => {
    let style = {
        display: 'flex',
        flexDirection: 'column'
    }
    let clsses = {
        grow:grow,
    }
    let clssstr = Object.keys(clsses).filter(k => clsses[k]).join(" ")
    return <div className={clssstr} style={style}>{children}</div>
}
const HBox = ({children, fill=false}) => {
    let style = {
        display: 'flex',
        flexDirection: 'row',
    }
    let clsses = {
        fill:fill,
    }
    let clssstr = Object.keys(clsses).filter(k => clsses[k]).join(" ")
    return <div className={clssstr} style={style}>{children}</div>
}

const is_error_result = (result) => result instanceof Error
const is_scalar = (val) => (val instanceof NScalar)
const is_string = (val) => (val instanceof NString)
const is_list_result = (val) => val instanceof NList

function is_color_result(result) {
    return false
}



const ErrorResult = ({result}) => <div>error!!! <b>{result.toString()}</b></div>
const ScalarResult = ({result}) => <div>Scalar <b>{result.value}</b></div>
const StringResult = ({result}) => <div>String <b>{result.value}</b></div>

function ListResult({result}) {
    return <div>List <b>list</b></div>
}


function ResultArea({result}) {
    console.log('result is', result)
    if (is_error_result(result)) return <ErrorResult result={result}/>
    if (is_scalar(result)) return <ScalarResult result={result}/>
    if (is_string(result)) return <StringResult result={result}/>
    if (is_list_result(result)) return <ListResult result={result}/>
    if (is_color_result(result)) return <ColorResult result={result}/>
    if (result === null) return <div>result is <b>null</b></div>
    return <div>unknown result here</div>
}

function ColorResult({result}) {
    return <div>Color <b>color</b></div>
}

export default App
