import {CSSProperties} from "react";

type CollapsablePanelProps = {
    direction:string,
    open:boolean,
    onToggle:()=>{},
    children:JSX.Element,
}

export const CollapsablePanel = ({children, direction, onToggle, open}:CollapsablePanelProps) => {
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


type VBoxProps = {
    grow:boolean,
    fill:boolean,
    classes:any,
    children:JSX.Element
}
export const VBox = ({children, classes={}, grow = false, fill=false}:VBoxProps) => {
    let style:CSSProperties = {
        display: 'flex',
        flexDirection: 'column'
    }
    let clsses:any = {
        grow: grow,
        fill:fill,
    }
    Object.keys(classes).forEach(key => clsses[key] = classes[key])
    let clssstr = "vbox " + Object.keys(clsses).filter(k => clsses[k]).join(" ")
    return <div className={clssstr} style={style}>{children}</div>
}

type HBoxProps = {
    grow:boolean,
    fill:boolean,
    classes:any,
    children:JSX.Element
}

export const HBox = ({children, grow=false, fill = false}:HBoxProps) => {
    let style:CSSProperties = {
        display: 'flex',
        flexDirection: 'row'
    }
    let clsses:any = {
        fill: fill,
        grow: grow,
    }
    let clssstr = "hbox " + Object.keys(clsses).filter(k => clsses[k]).join(" ")
    return <div className={clssstr} style={style}>{children}</div>
}
