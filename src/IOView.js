import {useEffect, useRef, useState} from 'react'
import {default as grammar_url} from 'filament-lang/src/filament.ohm'
import {eval_code, setup_parser} from 'filament-lang'
import * as codemirror from 'codemirror'
import {ResultArea} from './gui/views.js'

export function IOView({entry, onChange}) {
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
            console.log("an error happened", e)
            setResult(e)
        }
    }
    useEffect(() => {
        console.log("entry changed", entry)
        if (ref.current && editor === null) {
            console.log("making", ref.current)
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
                    'Ctrl-Enter': () => onEval(ed.getValue())
                    //     "Ctrl-Space": "autocomplete"
                }
            })
            setEditor(ed)
            ed.setValue(entry.input)
            ed.on('changes', () => onChange(ed.getValue()))
        }
        if (ref.current && editor !== null) {
            editor.setValue(entry.input)
            setResult(entry.output)
        }
    }, [entry])


    return <article>
        {/*<h3>block</h3>*/}
        <textarea ref={ref}/>
        <div>
            <button onClick={() => onEval(editor.getValue())}>eval</button>
        </div>
        <ResultArea result={result}/>
    </article>
}