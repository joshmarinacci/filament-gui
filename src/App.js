import {useState} from 'react'
import './App.css'

import {HBox, VBox} from './gui/ui.js'
import {ResultArea} from './gui/views.js'
import {eval_code, setup_parser} from 'filament-lang'

import "codemirror/addon/hint/show-hint.css"
import {EXAMPLES} from './gui/examples.js'
import {CodeEditor} from './gui/editor.js'
import {default as grammar_url} from "filament-lang/src/filament.ohm"


let stash = ""

const CollapsablePanel = ({children, direction}) => {
    const [open, set_open] = useState(true)
    const toggle = () => set_open(!open)
    const label = () => {
        if(direction === 'left') return open?"<":">"
        if(direction === 'right') return open?">":"<"
        return "|"
    }
    return <VBox>
        <button onClick={toggle}>{label()}</button>
        {open?children:""}
    </VBox>
}

function App() {
    const [code, setCode] = useState('5+6')
    const [result, setResult] = useState(null)

    const doEval = async (code) => {
        let grammar = await fetch(grammar_url).then(r => r.text())
        console.log("got the grammar",grammar)
        await setup_parser(grammar)
        code = "{" + code + "}"
        let d = await eval_code(code)
        console.log("result is ", d)
        setResult(d)
        console.log("done")
            // .catch(e => {
            //     console.error("ERROR", e)
            //     setResult(e)
            // })
    }

    return (
        <HBox fill>
            <CollapsablePanel direction={'left'}>
                <h3>Examples</h3>
                {EXAMPLES.map(ex => <button
                    onClick={() => setCode(ex.code.trim().split("\n")
                        // .map(t => t.trim())
                        .filter(t => t.length > 0)
                        .join("\n"))}
                >{ex.title}</button>)}
            </CollapsablePanel>
            <VBox grow>
                <CodeEditor value={code} onEval={(code)=>doEval(code)} onChange={str => stash=str}/>
                <button onClick={() => doEval(stash)}>eval</button>
                <ResultArea result={result}/>
            </VBox>
            <CollapsablePanel direction={'right'}>
                <h3>Docs</h3>
                {/*{Object.values(SCOPE).map(fn => <div><b>{fn.title}</b>:<i>{fn.doc}</i></div>)}*/}
            </CollapsablePanel>
        </HBox>
    )
}

export default App
