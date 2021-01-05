import {useState} from 'react'
import './App.css'

import {EXAMPLES, SCOPE} from "./test1.js"
import {HBox, VBox} from './ui.js'
import {ResultArea} from './views.js'
import {real_eval} from './lang.js'


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
                <textarea value={code}>some code is here</textarea>
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
