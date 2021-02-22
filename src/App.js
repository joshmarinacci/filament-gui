import {useState} from 'react'
import './App.css'
import "codemirror/addon/hint/show-hint.css"
import "codemirror/lib/codemirror.css"
import {IOView} from './IOView.js'
import {ExamplesPanel} from './ExamplesPanel.js'
import {make_standard_scope} from 'filament-lang/src/lang.js'
import {SymbolsPanel} from './SymbolsPanel.js'
import {CollapsablePanel} from './gui/common.js'



const realdoc = [
    {
        type:'filament',
        input:"4+5",
        output:null,
    },
    {
        type:'filament',
        input:"range(10)",
        output:null,
    }
]


function update_doc(doc, entry, code) {
    console.log("updating",doc,entry,code)
}
let scope = make_standard_scope()

function App() {
    const [doc, setDoc] = useState(realdoc)
    let entries = doc.map((entry,i) => <IOView key={i} entry={entry} onChange={(code)=>update_doc(doc,entry,code)} scope={scope}/>)
    const add_entry = () => {
        let new_doc = doc.slice()
        new_doc.push({
            type:'filament',
            input:'',
            output:null
        })
        setDoc(new_doc)
    }
    return <main>
        <header>
            Filament:
            <a href="https://apps.josh.earth/filament/tutorial.html" target="_blank">tutorial</a>
            <a href="https://apps.josh.earth/filament/intro.html" target="_blank">intro</a>
            <a href="https://apps.josh.earth/filament/spec.html" target="_blank">spec</a>
            <a href="https://apps.josh.earth/filament/api.html" target="_blank">api</a>
        </header>
        <CollapsablePanel direction={'left'}>
            <ExamplesPanel onSetDoc={(d)=>setDoc(d)}/>
        </CollapsablePanel>
        <div className={'entries'} >{entries}
        <button onClick={add_entry}>add</button>
        </div>
        <CollapsablePanel direction={'right'}>
            <SymbolsPanel scope={scope}/>
        </CollapsablePanel>
    </main>
}

export default App
