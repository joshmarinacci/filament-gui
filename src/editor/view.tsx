import {useEffect, useRef, useState} from 'react'
// import {default as grammar_url} from 'filament-lang/src/filament.ohm.js'
import {eval_code, setup_parser} from 'filament-lang'
import * as codemirror from 'codemirror'
import {EditorFromTextArea} from 'codemirror'
import "codemirror/addon/mode/simple.js"
import "codemirror/addon/hint/show-hint.js"
import "codemirror/addon/hint/show-hint.css"
import {ResultArea} from '../examples/views'
import {synonyms} from './editor'

type Entry = {
    title: string;
    input: string;
    type:string,
    output:any,
}

type ScopeType = {

}

type EdUpdate = ((instance:codemirror.Editor) => void)

type OnChangeCB = ((code:string) => void)


type ViewProps = {
    entry:Entry,
    onChange:OnChangeCB
    scope:ScopeType,
}

export function View({entry, onChange, scope}:ViewProps) {
    const ref = useRef<HTMLTextAreaElement>(null)
    const [editor, setEditor] = useState<EditorFromTextArea|null>(null)
    const [result, setResult] = useState(null)
    const [title, setTitle]   = useState("")
    const onEval = async (code:string):Promise<void> => {
        try {
            // let grammar = await fetch(grammar_url).then(r => r.text())
            // console.log("got the grammar", grammar)
            await setup_parser()
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
            const trigger_update:EdUpdate = () => onEval(ed.getValue())
            let ed:EditorFromTextArea = codemirror.fromTextArea(ref.current, {
                value: 'some cool text',
                lineNumbers: true,
                viewportMargin: Infinity,
                mode:'filament',
                // @ts-ignore
                hintOptions: {hint: synonyms, completeSingle: false, scope:scope},
                lineWrapping: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                extraKeys: {
                    "Ctrl-Space": "autocomplete",
                    "Ctrl-Enter": trigger_update,
                },
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
