import {EXAMPLES} from './gui/examples.js'
import {useState} from 'react'
import "./ExamplesPanel.css"

function AccordionView({title, children}) {
    const [open, setOpen] = useState(false)
    if(!open) children = []
    return <div className={'accordion-group'}>
        <h3 className={open?"open":"closed"} onClick={()=>setOpen(!open)}>{title}</h3>
        {children}
    </div>
}

export function ExamplesPanel({onSetDoc}) {
    return <div className={'examples'}>

        <h3>Examples</h3>
        {EXAMPLES.map((group,i) => {
            if(group.type === 'group') {
                return <AccordionView key={i} title={group.title}>
                    {
                        group.content.map((ex,i)=>{
                            return <button key={i}
                                    onClick={() => onSetDoc([{
                                        type: 'filament',
                                        title:ex.title,
                                        input: ex.code.trim().split("\n")
                                            .filter(t => t.length > 0)
                                            .join("\n"),
                                        output: null
                                    }])}
                            >{ex.title}</button>
                        })
                    }
                </AccordionView>
            }
        })}
    </div>
}