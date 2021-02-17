import {EXAMPLES} from './gui/examples.js'

export function ExamplesPanel({onSetDoc}) {
    return <div className={'examples'}>

        <h3>Examples</h3>
        {EXAMPLES.map((ex,i) => <button key={i}
            onClick={() => onSetDoc([{
                type: 'filament',
                input: ex.code.trim().split("\n")
                    .filter(t => t.length > 0)
                    .join("\n"),
                output: null
            }])}
        >{ex.title}</button>)}
    </div>
}