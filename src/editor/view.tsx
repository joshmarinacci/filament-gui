import {useEffect, useRef, useState} from 'react'
import {default as grammar_url} from 'filament-lang/src/filament.ohm'
import {eval_code, setup_parser} from 'filament-lang'
import * as codemirror from 'codemirror'
import "codemirror/addon/mode/simple.js"
import "codemirror/addon/hint/show-hint.js"
import "codemirror/addon/hint/show-hint.css"
import {ResultArea} from '../gui/views'
import {synonyms} from './editor'
import {EditorFromTextArea} from "codemirror";

export function View({entry, onChange, scope}) {
    const ref = useRef<HTMLTextAreaElement|undefined>()
    const [editor, setEditor] = useState<EditorFromTextArea|null>(null)
    const [result, setResult] = useState(null)
    const [title, setTitle]   = useState("")
    const onEval = async (code:string) => {
        try {
            let grammar = await fetch(grammar_url).then(r => r.text())
            // console.log("got the grammar", grammar)
            await setup_parser(grammar)
            code = "{" + code + "}"
            let d = await eval_code(code,scope)
            console.log("result is ", d)
            setResult(d)
            // console.log("done")
        } catch (e:any) {
            console.log("an error happened", e)
            setResult(e)
        }
    }
    useEffect(() => {
        if (ref.current && editor === null) {
            let ed:EditorFromTextArea = codemirror.fromTextArea(ref.current, {
                value: 'some cool text',
                lineNumbers: true,
                viewportMargin: Infinity,
                mode:'filament',
                hintOptions: {hint: synonyms, completeSingle: false, scope:scope},
                lineWrapping: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                extraKeys: {
                    'Ctrl-Enter': () => onEval(ed.getValue()),
                    "Ctrl-Space": "autocomplete"
                }
            })
            setEditor(ed)
            ed.setValue(entry.input)
            setTitle(entry.title)
            ed.on('changes', () => onChange(ed.getValue()))
        }
        if (ref.current && editor !== null) {
            editor.setValue(entry.input)
            setTitle(entry.title)
            setResult(entry.output)
        }
    }, [entry])

    return <article>
        <h4>{title}</h4>
        <textarea ref={ref}/>
        <div>
            <button onClick={() => {
                if(editor) onEval(editor.getValue())
            }}>eval</button>
        </div>
        <ResultArea result={result}/>
    </article>
}
