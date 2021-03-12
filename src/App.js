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
        title:'arithmetic',
        input:"4+5+3",
        output:null,
    },
    {
        type:'filament',
        title:'range',
        input:"range(10)",
        output:null,
    }
]


function update_doc(doc, entry, code) {
    console.log("updating",doc,entry,code)
}
let scope = make_standard_scope()

function MainView({children, setDoc}) {
    const [left_open,set_left_open] = useState(true)
    const [right_open,set_right_open] = useState(true)

    let cols = `${left_open?'20rem':'5rem'} 1fr ${right_open?'20rem':'5rem'}`;
    let style = {
        'display':'grid',
        'gridTemplateColumns': cols
    }

    return <main style={style}>
        <CollapsablePanel direction={'left'} open={left_open} onToggle={()=>set_left_open(!left_open)}>
            <ExamplesPanel onSetDoc={(d)=>setDoc(d)}/>
        </CollapsablePanel>
        {children}
        <CollapsablePanel direction={'right'} open={right_open} onToggle={()=>set_right_open(!right_open)}>
            <SymbolsPanel scope={scope}/>
        </CollapsablePanel>
    </main>
}

function App() {
    const [doc, setDoc] = useState(realdoc)
    let entries = doc.map((entry,i) => <IOView key={i} entry={entry} onChange={(code)=>update_doc(doc,entry,code)} scope={scope}/>)
    const add_entry = () => {
        let new_doc = doc.slice()
        new_doc.push({
            type:'filament',
            title:'title',
            input:'',
            output:null
        })
        setDoc(new_doc)
    }
    return <MainView setDoc={setDoc}>
        <header>
            Filament:
            <a href="https://apps.josh.earth/filament/tutorial.html" target="_blank">tutorial</a>
            <a href="https://apps.josh.earth/filament/intro.html" target="_blank">intro</a>
            <a href="https://apps.josh.earth/filament/spec.html" target="_blank">spec</a>
            <a href="https://apps.josh.earth/filament/api.generated.html" target="_blank">api</a>
        </header>
        <div className={'entries'} >{entries}
        <button onClick={add_entry}>add</button>
        </div>
    </MainView>
}

export default App
