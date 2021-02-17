// import {scope} from '../lang/lang.js'
import * as codemirror from 'codemirror'
import "codemirror/addon/mode/simple.js"
import {useEffect, useRef} from 'react'
import "codemirror/lib/codemirror.css"
import "codemirror/theme/mdn-like.css"
import "codemirror/theme/elegant.css"

let editor = null

codemirror.defineSimpleMode('filament',{
    start:[
        {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
        {regex: /(?:function|var|return|if|for|while|else|do|this)\b/,
            token: "keyword"},
    ],
    meta: {
    }
})

/* Example definition of a simple mode that understands a subset of
 * JavaScript:
 */

codemirror.defineSimpleMode("simplemode", {
    // The start state contains the rules that are initially used
    start: [
        // The regex matches the token, the token property contains the type
        {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
        {regex: /'(?:[^\\]|\\.)*?(?:'|$)/, token: "string"},
        // You can match multiple tokens at once. Note that the captured
        // groups must span the whole string in this case
        {regex: /(def)(\s+)([a-z$][\w$]*)/,
            token: ["keyword", null, "variable-2"]},
        // Rules are matched in the order in which they appear, so there is
        // no ambiguity between this one and the one above
        {regex: /(?:function|def|var|return|if|for|while|else|do|this)\b/,
            token: "keyword"},
        {regex: /true|false|null|undefined/, token: "atom"},
        {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
            token: "number"},
        {regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3"},
        {regex: /[-+\/*=<>!]+/, token: "operator"},
        // indent and dedent properties guide autoindentation
        {regex: /[\{\[\(]/, indent: true},
        {regex: /[\}\]\)]/, dedent: true},
        {regex: /[a-z$][\w$]*/, token: "variable"},
    ],
    // The meta property contains global information about the mode. It
    // can contain properties like lineComment, which are supported by
    // all modes, and also directives like dontIndentStates, which are
    // specific to simple modes.
    meta: {
        // dontIndentStates: ["comment"],
        // lineComment: "//"
    }
});





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