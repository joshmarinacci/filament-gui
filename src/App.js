import {useState} from 'react'
import './App.css'

import {HBox, VBox} from './gui/ui.js'
import {ResultArea} from './gui/views.js'
import {real_eval2} from './lang/lang.js'

import "codemirror/addon/hint/show-hint.css"
import {EXAMPLES} from './gui/examples.js'
import {CodeEditor} from './gui/editor.js'


let stash = ""
function App() {
    const [code, setCode] = useState('5+6')
    const [result, setResult] = useState(null)

    const doEval = (code) => real_eval2(code).then(d => setResult(d)).catch(e => {
        console.error("ERROR",e)
        setResult(e)
    })

    return (
        <HBox fill>
            <VBox>
                {EXAMPLES.map(ex => <button
                    onClick={() => setCode(ex.code.trim().split("\n")
                        // .map(t => t.trim())
                        .filter(t => t.length > 0)
                        .join("\n"))}
                >{ex.title}</button>)}
            </VBox>
            <VBox grow>
                <CodeEditor value={code} onEval={(code)=>doEval(code)} onChange={str => stash=str}/>
                <button onClick={() => doEval(stash)}>eval</button>
                <ResultArea result={result}/>
            </VBox>
            <VBox classes={{docs:true}}>
                {/*{Object.values(SCOPE).map(fn => <div><b>{fn.title}</b>:<i>{fn.doc}</i></div>)}*/}
            </VBox>
        </HBox>
    )
}

export default App
