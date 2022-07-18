import {Example, ExampleGroup, EXAMPLES} from './examples'
import {useState} from 'react'
import "./examples_panel.css"

type AccordionViewProps = {
    title:string,
    children:JSX.Element[]
}
function AccordionView({title, children}:AccordionViewProps) {
    const [open, setOpen] = useState(false)
    if(!open) children = []
    return <div className={'accordion-group'}>
        <h3 className={open?"open":"closed"} onClick={()=>setOpen(!open)}>{title}</h3>
        {children}
    </div>
}



type ExamplesPanelProps = {
    onSetDoc:(e:any)=>{}
}
export function ExamplesPanel({onSetDoc}:ExamplesPanelProps) {
    function make_example_button(ex:Example, i:number):JSX.Element {
        return <button key={i} onClick={()=>{
            onSetDoc([{
                type:'filament',
                title:ex.title,
                input: ex.code.trim().split("\n")
                    .filter(t => t.length > 0)
                    .join("\n"),
                output: null
            }])
        }
        }>
            {ex.title}
        </button>

    }
    return <div className={'examples'}>

        <h3>Examples</h3>
        {EXAMPLES.map((group:ExampleGroup,i) => {
            if(group.type === 'group') {
                let items = group.content.map(make_example_button)
                return <AccordionView key={i} title={group.title} children={items}/>
            } else {
                return <div>nothing</div>
            }
        })}
    </div>
}
