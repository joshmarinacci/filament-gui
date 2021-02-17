import {useEffect, useRef, useState} from 'react'
import {default as grammar_url} from 'filament-lang/src/filament.ohm'
import {eval_code, setup_parser} from 'filament-lang'
import * as codemirror from 'codemirror'
import "codemirror/addon/mode/simple.js"
import "codemirror/addon/hint/show-hint.js"
import "codemirror/addon/hint/show-hint.css"
import {ResultArea} from './gui/views.js'
import {make_standard_scope} from 'filament-lang/src/lang.js'

function synonyms(cm, option) {
    console.log("syonmyms")
    return new Promise(function (accept) {
        setTimeout(function () {
            // console.log("cm is",cm)
            // console.log("option is",option)
            // console.log("scope is")
            let names = option.scope.names()
            // console.log(names)
            // accept(null)
            var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
            var start = cursor.ch, end = cursor.ch
            // console.log("start",start,'end',end)

            while (start && /\w/.test(line.charAt(start - 1))) --start
            while (end < line.length && /\w/.test(line.charAt(end))) ++end
            var word = line.slice(start, end).toLowerCase()
            // console.log("word is",word)
            // console.log("scope is",names)
            let matches = names.filter(k => k.startsWith(word))
            // let matches = ["foo","bar"]
            // console.log("matches",matches)
            return accept({
                list: matches,
                from: codemirror.Pos(cursor.line, start),
                to: codemirror.Pos(cursor.line, end)
            })
        }, 100)
    })
}

export function IOView({entry, onChange}) {
    const ref = useRef()
    const [editor, setEditor] = useState(null)
    const [result, setResult] = useState(null)
    const [scope, setScope] = useState(null)
    const onEval = async (code) => {
        try {
            let grammar = await fetch(grammar_url).then(r => r.text())
            // console.log("got the grammar", grammar)
            await setup_parser(grammar)
            code = "{" + code + "}"
            let d = await eval_code(code,scope)
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
            let scope = make_standard_scope()
            setScope(scope)
            console.log("making", ref.current)
            let ed = codemirror.fromTextArea(ref.current, {
                value: 'some cool text',
                lineNumbers: true,
                viewportMargin: Infinity,
                // mode: 'javascript',
                // mode:'filament',
                mode: 'simplemode',
                hintOptions: {hint: synonyms, completeSingle: false, scope:scope},
                lineWrapping: true,
                theme: 'elegant',
                matchBrackets: true,
                autoCloseBrackets: true,
                extraKeys: {
                    'Ctrl-Enter': () => onEval(ed.getValue()),
                    "Ctrl-Space": "autocomplete"
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