import {useEffect, useRef, useState} from 'react'
import './App.css'

import {HBox, VBox} from './gui/ui.js'
import {ResultArea} from './gui/views.js'
import {eval_code, setup_parser} from 'filament-lang'

import {EXAMPLES} from './gui/examples.js'
import {CodeEditor} from './gui/editor.js'
import {default as grammar_url} from "filament-lang/src/filament.ohm"

import "codemirror/addon/hint/show-hint.css"
import "codemirror/lib/codemirror.css"
import * as codemirror from 'codemirror'


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

const realdoc = [
    {
        type:'filament',
        input:"4+5",
        output:null,
    },
    {
        type:'filament',
        input:"range(10)",
        output:null,
    }
]


function IOView({entry, onChange}) {
    const ref = useRef()
    const [editor, setEditor] = useState(null)
    const [result, setResult] = useState(null)
    const onEval = async (code) => {
        try {
            let grammar = await fetch(grammar_url).then(r => r.text())
            // console.log("got the grammar", grammar)
            await setup_parser(grammar)
            code = "{" + code + "}"
            let d = await eval_code(code)
            console.log("result is ", d)
            setResult(d)
            // console.log("done")
        } catch (e) {
            console.log("an error happened",e)
            setResult(e)
        }
    }
    useEffect(() => {
        console.log("entry changed",entry)
        if (ref.current && editor === null) {
            console.log("making",ref.current)
            let ed = codemirror.fromTextArea(ref.current, {
                value: 'some cool text',
                lineNumbers: true,
                viewportMargin: Infinity,
                // mode: 'javascript',
                // mode:'filament',
                mode: 'simplemode',
                // hintOptions: {hint: synonyms, completeSingle: false},
                // lineWrapping: true,
                theme: 'elegant',
                matchBrackets: true,
                autoCloseBrackets: true,
                extraKeys: {
                    'Ctrl-Enter': () => onEval(ed.getValue()),
                //     "Ctrl-Space": "autocomplete"
                }
            })
            setEditor(ed)
            ed.setValue(entry.input)
            ed.on('changes', () => onChange(ed.getValue()))
        }
        if(ref.current && editor !== null) {
            editor.setValue(entry.input)
            setResult(entry.output)
        }
    },[entry])


    return <article>
        {/*<h3>block</h3>*/}
        <textarea ref={ref}/>
        <div>
        <button onClick={() => onEval(editor.getValue())}>eval</button>
        </div>
        <ResultArea result={result}/>
    </article>
}

function update_doc(doc, entry, code) {
    console.log("updating",doc,entry,code)
}

function App() {
    const [doc, setDoc] = useState(realdoc)
    let entries = doc.map((entry,i) => <IOView key={i} entry={entry} onChange={(code)=>update_doc(doc,entry,code)}/>)
    let style = {
        display:"flex",
        flexDirection:'row',
        border:'1px solid blue',
    }
    return <div style={style}>
        <CollapsablePanel direction={'left'}>
            <h3>Examples</h3>
            {EXAMPLES.map(ex => <button
                onClick={() => setDoc([{
                    type:'filament',
                    input:ex.code.trim().split("\n")
                        .filter(t => t.length > 0)
                        .join("\n"),
                    output:null
                }])}
            >{ex.title}</button>)}
        </CollapsablePanel>
        <VBox grow style={{
            flex:'1.0',
            border:'1px solid green',
        }}>{entries}</VBox>
        <CollapsablePanel direction={'right'}>
            <h3>Docs</h3>
        </CollapsablePanel>
    </div>
}

export default App
