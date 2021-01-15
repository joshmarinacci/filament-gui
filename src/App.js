import {useState, useRef, useEffect} from 'react'
import './App.css'

import {HBox, VBox} from './ui.js'
import {ResultArea} from './views.js'
import {real_eval, scope} from './lang.js'

import * as codemirror from 'codemirror';
import "codemirror/lib/codemirror.css"
import "codemirror/theme/mdn-like.css"
import {} from "codemirror/mode/javascript/javascript.js"
import {} from "codemirror/addon/edit/matchbrackets.js"
import {} from "codemirror/addon/edit/closebrackets.js"

import "codemirror/addon/hint/show-hint.css"
import {} from "codemirror/addon/hint/show-hint.js"
import {} from "codemirror/addon/hint/javascript-hint.js"
import {EXAMPLES} from './examples.js'

let editor = null

function synonyms(cm, option) {
    return new Promise(function(accept) {
        setTimeout(function() {
            // console.log("cm is",cm)
            // console.log("option is",option)
            // accept(null)
            var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
            var start = cursor.ch, end = cursor.ch
            // console.log("start",start,'end',end)

            while (start && /\w/.test(line.charAt(start - 1))) --start
            while (end < line.length && /\w/.test(line.charAt(end))) ++end
            var word = line.slice(start, end).toLowerCase()
            // console.log("word is",word)
            // console.log("scope is",scope)
            let matches = Object.keys(scope).filter(k => k.startsWith(word));
            // console.log("matches",matches)
            return accept({
                list:matches,
                from: codemirror.Pos(cursor.line, start),
                to: codemirror.Pos(cursor.line, end),
            })
        }, 100)
    })
}
function CodeEditor({value, onEval}) {
    const ref = useRef()
    useEffect(()=>{
        if(ref.current && editor === null) {
            console.log("setting up code mirror")
            editor = codemirror.fromTextArea(ref.current, {
                value: 'some cool text',
                lineNumbers:true,
                mode:'javascript',
                hintOptions: {hint: synonyms, completeSingle: false},
                lineWrapping:true,
                theme:'mdn-like',
                matchBrackets:true,
                autoCloseBrackets:true,
                extraKeys: {
                    'Ctrl-Enter':()=> onEval(editor.getValue()),
                    "Ctrl-Space": "autocomplete",
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
                    onClick={() => setCode(ex.code.trim().split("\n")
                        // .map(t => t.trim())
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
                {/*{Object.values(SCOPE).map(fn => <div><b>{fn.title}</b>:<i>{fn.doc}</i></div>)}*/}
            </VBox>
        </HBox>
    )
}

export default App
