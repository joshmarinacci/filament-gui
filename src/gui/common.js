import {useEffect, useRef, useState} from 'react'

export const VBox = ({children, classes={}, grow = false, fill=false}) => {
    let style = {
        display: 'flex',
        flexDirection: 'column'
    }
    let clsses = {
        grow: grow,
        fill:fill,
    }
    Object.keys(classes).forEach(key => clsses[key] = classes[key])
    let clssstr = "vbox " + Object.keys(clsses).filter(k => clsses[k]).join(" ")
    return <div className={clssstr} style={style}>{children}</div>
}
export const HBox = ({children, grow=false, fill = false}) => {
    let style = {
        display: 'flex',
        flexDirection: 'row'
    }
    let clsses = {
        fill: fill,
        grow: grow,
    }
    let clssstr = "hbox " + Object.keys(clsses).filter(k => clsses[k]).join(" ")
    return <div className={clssstr} style={style}>{children}</div>
}

export const CollapsablePanel = ({children, direction, onToggle, open}) => {
    // const [open, set_open] = useState(true)
    // const toggle = () => set_open(!open)
    const label = () => {
        if(direction === 'left') return open?"<":">"
        if(direction === 'right') return open?">":"<"
        return "|"
    }
    return <div className={'collapse '+direction}>
        <button onClick={onToggle}>{label()}</button>
        {open?children:""}
    </div>
}
