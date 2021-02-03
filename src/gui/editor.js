// import {scope} from '../lang/lang.js'
import * as codemirror from 'codemirror'
import {useEffect, useRef} from 'react'

let editor = null

// function synonyms(cm, option) {
//     return new Promise(function (accept) {
//         setTimeout(function () {
//             // console.log("cm is",cm)
//             // console.log("option is",option)
//             // accept(null)
//             var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
//             var start = cursor.ch, end = cursor.ch
//             // console.log("start",start,'end',end)
//
//             while (start && /\w/.test(line.charAt(start - 1))) --start
//             while (end < line.length && /\w/.test(line.charAt(end))) ++end
//             var word = line.slice(start, end).toLowerCase()
//             // console.log("word is",word)
//             // console.log("scope is",scope)
//             let matches = Object.keys(scope).filter(k => k.startsWith(word))
//             // console.log("matches",matches)
//             return accept({
//                 list: matches,
//                 from: codemirror.Pos(cursor.line, start),
//                 to: codemirror.Pos(cursor.line, end)
//             })
//         }, 100)
//     })
// }

export function CodeEditor({value, onEval, onChange}) {
    const ref = useRef()
    useEffect(() => {
        if (ref.current && editor === null) {
            console.log("setting up code mirror")
            editor = codemirror.fromTextArea(ref.current, {
                value: 'some cool text',
                lineNumbers: true,
                mode: 'javascript',
                // hintOptions: {hint: synonyms, completeSingle: false},
                lineWrapping: true,
                theme: 'mdn-like',
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