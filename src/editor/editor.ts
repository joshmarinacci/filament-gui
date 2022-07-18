import * as codemirror from 'codemirror'

// @ts-ignore
codemirror.defineSimpleMode("filament", {
    // The start state contains the rules that are initially used
    start: [
        // The regex matches the token, the token property contains the type
        {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
        {regex: /'(?:[^\\]|\\.)*?(?:'|$)/, token: "string"},
        // You can match multiple tokens at once. Note that the captured
        // groups must span the whole string in this case
        {regex: /(def)(\s+)([a-z$][\w$]*)/,
            //@ts-ignore
            token: ["keyword", null, "variable-2"]},
        // comments
        {regex: /\/\/.*/,token:"comment"},
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

function findPreviousParen(start:number, line:string) {
    while(true) {
        start--
        if(line.charAt(start) === '(') {
            return start
        }
        if(start <= 0) {
            return -1
        }
    }
    return -1
}

function findPreviousFun(start:number, line:string) {
    let end = start
    while(start && /\w/.test(line.charAt(start-1))) --start
    return line.slice(start,end)
}

/*
if theta, replace it with 'ø'. will it still parse?
 */
function searchSynonyms(cm:any, option:any) {
    return new Promise(function (accept) {
        setTimeout(function () {
            console.log("cm is",cm)
            console.log("option is",option)
            console.log("scope is")
            let completions = option.scope.names()
            // console.log(completions)
            // accept(null)
            var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
            var start = cursor.ch, end = cursor.ch

            while (start && /\w/.test(line.charAt(start - 1))) --start
            while (end < line.length && /\w/.test(line.charAt(end))) ++end


            // find function we are inside of to look up parameter names
            let paren = findPreviousParen(start,line)
            if(paren > 0) {
                let fun_name = findPreviousFun(paren,line)
                if(fun_name) {
                    let matches = completions.filter((k:string) => k === fun_name)
                    if(matches.length > 0){
                        let fun_obj = option.scope.lookup(matches[0])
                        let params = Object.keys(fun_obj.params)
                        completions = params.concat(completions)
                    }
                }
            }
            const word = line.slice(start, end).toLowerCase()
            //shortcuts for theta
            let matches = completions.filter((k:string) => k.startsWith(word))
            if(word === 'theta') matches.unshift('Θ')
            return accept({
                list: matches,
                from: codemirror.Pos(cursor.line, start),
                to: codemirror.Pos(cursor.line, end)
            })
        }, 100)
    })
}

export const synonyms:codemirror.HintFunction = searchSynonyms as codemirror.HintFunction
