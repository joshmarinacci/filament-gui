import fs from 'fs'
import ohm from "ohm-js"
import test from "tape"
import tp from "tape-approximately"


let source, grammar, semantics


tp(test)

function init_parser() {
    source = fs.readFileSync(new URL('../src/grammar.ohm', import.meta.url)).toString();
    grammar = ohm.grammar(source);
    semantics = grammar.createSemantics();
    semantics.addOperation('calc',{
        number_integer:function(a) {
            return parseInt(a.sourceString)
        },
        number_float:function(a,b,c) {
            return parseFloat(a.sourceString + b.sourceString + c.sourceString)
        },
        string:function(a,b,c) {
            return b.sourceString
        },
        List_full:function(a,b,c,d,e) {
            console.log('list full',b.calc(),d.calc())
            let list = d.calc().slice()
            list.unshift(b.calc())
            return list
        },
        _terminal: function() {
            console.log("terminal",this)
            return this.sourceString;
        }

    })
}

init_parser()

export function tests(msg,arr) {
    test(msg, (t)=>{
        arr.forEach((tcase) => {
            let str = tcase[0];
            let ans = tcase[1];
            let m = grammar.match(str)
            // console.log("m is",m)
            if(m.failed()) throw new Error("match failed on: " + str);
            let sem = semantics(m);
            // console.log(sem.calc())

            // if(res.type === 'funcall') {
            //     res = res.invoke();
            // }
            // if(res.type === 'string') {
            //     return t.equal(res.string, ans);
            // }
            // return t.approximately(res.getValue(), ans, 0.001);
            let val = sem.calc()
            console.log("comparing",val,ans)
            return t.deepEqual(val,ans);
        });
        t.end();
    });
}
