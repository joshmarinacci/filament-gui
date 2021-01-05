import {useState} from 'react'
import './App.css'

import {CanvasResult, EXAMPLES, NCircle, NColor, NGradient, NList, NScalar, NString, SCOPE} from "./test1.js"
import {HBox, VBox} from './ui.js'
import {ResultArea} from './views.js'


function real_eval(code) {
    let scope = {
        foo: () => console.log("doing foo"),
        scalar: (v) => new NScalar(v),
        string: v => new NString(v),
        list: v => new NList(v),
        color: v => new NColor(v),
        gradient: v => new NGradient(v),
        size: SCOPE.size.impl,
        sum: SCOPE.sum.impl,
        average: SCOPE.average.impl,
        map: SCOPE.map.impl,
        circle: v => new NCircle(v),
        pack_row:SCOPE.pack_row.impl,
        draw: SCOPE.draw.impl,
    }

    let lines = code.split("\n")
    lines[lines.length-1] = 'return ' + lines[lines.length-1]

    let defines = Object.keys(scope).map(key => {
        return `    const ${key} = scope.${key}`
    }).join("\n")
    let gen_code = `
"use strict"; 
return function(scope) {
${defines}
${lines.join("\n")}
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
        // console.log("evaluating", code)
        let res = real_eval(code)
        // console.log("result is", res)
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

export default App
