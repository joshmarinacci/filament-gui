import {useState, useRef, useEffect} from 'react'
import './App.css'

import {EXAMPLES, SCOPE} from "./test1.js"
import {HBox, VBox} from './ui.js'
import {ResultArea} from './views.js'
import {real_eval} from './lang.js'

import * as codemirror from 'codemirror';
import "codemirror/lib/codemirror.css"
import "codemirror/theme/mdn-like.css"
import {} from "codemirror/mode/javascript/javascript.js"

let editor = null
function CodeEditor({value, onEval}) {
    const ref = useRef()
    useEffect(()=>{
        if(ref.current && editor === null) {
            console.log("setting up code mirror")
            editor = codemirror.fromTextArea(ref.current, {
                value: 'some cool text',
                lineNumbers:true,
                mode:'javascript',
                lineWrapping:true,
                theme:'mdn-like',
                extraKeys: {
                    'Ctrl-Enter':()=>{
                        console.log("doing enter")
                        onEval(editor.getValue())
                    }
                }
            })
            editor.setValue('value')
        }
    })
    useEffect(()=>{
        if(editor) {
            editor.setValue(value)
        }
    },[value])
    return <textarea ref={ref}/>
}

function App() {
    const [code, setCode] = useState('5+6')
    const [result, setResult] = useState(null)

    const doEval = (code) => setResult(real_eval(code))

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
                <CodeEditor value={code} onEval={(code)=>doEval(code)}/>
                <button onClick={() => doEval(code)}>eval</button>
                <ResultArea result={result}/>
            </VBox>
            <VBox classes={{docs:true}}>
                {Object.values(SCOPE).map(fn => <div><b>{fn.title}</b>:<i>{fn.doc}</i></div>)}
            </VBox>
        </HBox>
    )
}

export default App
