// import {scope} from '../lang/lang.js'
import * as codemirror from 'codemirror'
import "codemirror/addon/mode/simple.js"
import {useEffect, useRef} from 'react'
import "codemirror/lib/codemirror.css"
import "codemirror/theme/mdn-like.css"
import "codemirror/theme/elegant.css"

let editor = null






export function CodeEditor({value, onEval, onChange}) {
    const ref = useRef()
    useEffect(() => {
        if (ref.current && editor === null) {
            console.log("setting up code mirror")
            editor = codemirror.fromTextArea(ref.current, {
                value: 'some cool text',
                lineNumbers: true,
                // mode: 'javascript',
                // mode:'filament',
                mode:'simplemode',
                // hintOptions: {hint: synonyms, completeSingle: false},
                lineWrapping: true,
                theme: 'elegant',
                matchBrackets: true,
                autoCloseBrackets: true,
                extraKeys: {
                    'Ctrl-Enter': () => onEval(editor.getValue()),
                    "Ctrl-Space": "autocomplete"
                }
            })
            editor.setValue('value')
            editor.on('changes',()=> onChange(editor.getValue()))
        }
    })
    useEffect(() => {
        if (editor) {
            editor.setValue(value)
        }
    }, [value])
    return <textarea ref={ref}/>
}