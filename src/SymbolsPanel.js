function Constant({symbol}) {
    return <li><i>const</i> <b>{symbol.name}</b></li>
}

function FunctionSymbol({symbol}) {
    let parms = Object.entries(symbol.params).map(([name, val]) => {
        return <li>{name}</li>
    })
    return <li>
        <i>fun</i>&nbsp;
        <b>{symbol.name}(</b>
        <ul className={'parameters'}>{parms}</ul>
        <b>)</b>
        <span className={'summary'}>
            {symbol.summary}
        </span>
    </li>
}

export function SymbolsPanel({scope}) {
    console.log(scope)
    let names = scope.names().slice()
    names.sort()
    return <ul className={'symbols'}>
        {names.map((name) => {
            let fun = scope.funs[name]
            if(fun.type === 'scalar') return <Constant key={name} symbol={fun}/>
            // console.log('symbol is',fun.type)
            return <FunctionSymbol key={name} symbol={fun}/>
        })}
    </ul>
}