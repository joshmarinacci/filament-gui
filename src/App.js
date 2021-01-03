import {useState} from 'react'
import './App.css';

import {EXAMPLES} from "./test1.js"
import {SCOPE} from "./test1.js"


function real_eval(code) {
  let res = eval(code)
  return res
}

function App() {
  const [code, setCode] = useState('5+6')
  const [result, setResult] = useState(null)

  const doEval = (code) => {
    console.log("evaluating",code)
    let res = real_eval(code)
    console.log("result is",res)
    setResult(res)
  }

  return (
    <HBox>
      <VBox>
        {EXAMPLES.map(ex => <button
            onClick={()=>setCode(ex.code.split("\n")
                .map(t => t.trim())
                .filter(t => t.length > 0)
                .join("\n"))}
        >{ex.title}</button>)}
      </VBox>
      <VBox>
        <textarea value={code} rows={8} cols={50}>some code is here</textarea>
        <button onClick={()=>doEval(code)}>eval</button>
        <ResultArea result={result}/>
      </VBox>
      <VBox>
        {Object.values(SCOPE).map(fn => <div>docs for <b>{fn.title}</b> is </div>)}
      </VBox>
    </HBox>
  );
}

const VBox = ({children}) => {
  let style = {
    display:'flex',
    flexDirection:'column'
  }
  return <div style={style}>{children}</div>
}
const HBox = ({children}) => {
  let style = {
    display:'flex',
    flexDirection:'row'
  }
  return <div style={style}>{children}</div>
}

function is_scalar_result(result) {
  return false
}

function is_string_result(result) {
  return false
}

function is_color_result(result) {
  return false
}
function is_list_result(result) {
  return false
}

function ResultArea({result}) {
  console.log('result is',result)
  if(is_scalar_result(result)) return <ScalarResult result={result}/>
  if(is_string_result(result)) return <StringResult result={result}/>
  if(is_list_result(result))   return <ListResult result={result}/>
  if(is_color_result(result))  return <ColorResult result={result}/>
  if(result === null) return <div>result is <b>null</b></div>
  return <div>unknown result here</div>
}

function ScalarResult({result}) {
  return <div>Scalar <b>number</b></div>
}
function StringResult({result}) {
  return <div>String <b>string</b></div>
}
function ListResult({result}) {
  return <div>List <b>list</b></div>
}
function ColorResult({result}) {
  return <div>Color <b>color</b></div>
}

export default App;
