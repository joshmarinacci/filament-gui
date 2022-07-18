type Props = {
    direction:string,
    open:boolean,
    onToggle:()=>{},
    children:JSX.Element,
}

export const CollapsablePanel = ({children, direction, onToggle, open}:Props) => {
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
