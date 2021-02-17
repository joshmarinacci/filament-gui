export function SymbolsPanel({scope}) {
    console.log(scope)
    let names = scope.names().slice()
    names.sort()
    return <ul className={'symbols'}>
        {names.map((name) => {
            let fun = scope.funs[name]
            console.log(fun)
            if(fun.type === 'scalar') {
                return <li key={name}><i>const</i> <b>{name}</b></li>
            }
            let parms = Object.entries(fun.params).map(([name, val]) => {
                console.log(name, val)
                return <li>{name}</li>
            })
            return <li key={name}>
                <i>fun</i>&nbsp;
                <b>{name}(</b>
                <ul className={'parameters'}>{parms}</ul>
                <b>)</b>
            </li>
        })}
    </ul>
}