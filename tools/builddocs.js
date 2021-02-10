/*
- parse markdown. two phase parser and grammar?
- generate HTML from AST
- parse embedded codeblocks marked as filament
- generate pretty code
- executed embedded codeblocks
- generate pretty output for common result types
- generate PNGs for canvas result type
- everything into in-memory datastructure
- flatten entire structure into final html file
- run as cli app. accepts input file and output file and output dir
 */


import path from 'path'
import {promises as fs, createWriteStream, mkdir as real_mkdir} from 'fs'
import ohm from 'ohm-js'
import {Parser} from '../../filament-lang/src/parser.js'
import {is_canvas_result, Scope} from "../../filament-lang/src/ast.js"
import {default as PImage} from "pureimage"
import {make_standard_scope} from '../../filament-lang/src/lang.js'


// import {chart, histogram, timeline} from '../src/lang/chart.js'

const H1    = (content) => ({type:'H1', content})
const H2    = (content) => ({type:'H2',content})
const P     = (content) => ({type:'P',content})
const code  = (language,content) => ({type:'CODE', language, content})

function parse_markdown_blocks(str) {
    let parser = {}
    parser.grammar = ohm.grammar(`
MarkdownOuter {
  Doc = Block*
  Block = h2 | h1 | code | para | blank
  h2 = "##" rest
  h1 = "#" rest
  para = line+  //paragraph is just multiple consecutive lines
  code = q rest (~q any)* q //anything between the \`\`\` markers
  
  
  q = "\`\`\`"   // start and end code blocks
  nl = "\\n"   // new line
  blank = nl  // blank line has only newline
  line = (~nl any)+ nl  // line has at least one letter
  rest = (~nl any)* nl  // everything to the end of the line
}
    `)
    parser.semantics = parser.grammar.createSemantics()
    parser.semantics.addOperation('blocks',{
        _terminal() { return this.sourceString },
        h1:(_,b) => H1(b.blocks()),
        h2:(_,b) => H2(b.blocks()),
        code:(_,name,cod,_2) => code(name.blocks(),cod.blocks().join("")),
        para: a=> P(a.sourceString),
        rest: (a,_) => a.blocks().join("")
    })
    let match = parser.grammar.match(str)
    return parser.semantics(match).blocks()
}

function l(...args) {
    console.log(...args)
}

function parse_markdown_content(block) {
    // l("parsing content from block",block)
    // let parser = {}
    // parser.grammar = ohm.grammar(`
    // `)
    // parser.semantics = parser.grammar.createSemantics()
    // parser.semantics.addOperation('content',{
    // })
    // let match = parser.grammar.match(block)
    // return parser.semantics(match).content()
    return block
}

async function parse_markdown(raw_markdown) {
    // l('parsing raw markdown',raw_markdown)
    let blocks = parse_markdown_blocks(raw_markdown)
    // l("blocks are",blocks)
    let doc = blocks.map(block => parse_markdown_content(block))
    return doc
}

async function eval_filament(doc) {
    // l("evaluating all filament objects in",doc)
    let codeblocks = doc.filter(block => block.type === 'CODE')
    // l("codeblocks",codeblocks)
    let filament_grammer = (await fs.readFile('src/lang/filament.ohm')).toString()
    let parser = new Parser(null,filament_grammer)
    let scope = make_standard_scope()

    return Promise.all(codeblocks.map(async (code) => {
        console.log(code)
        let match = parser.parse(code.content)
        // console.log('match',match.failed())
        if(match.failed()) throw new Error("match failed on: " + code.content);
        let ast = parser.ast(match)
        // console.log("ast is",ast)
        let res = await ast.evalFilament(scope)
        // console.log("final result is",res,'for code',code)
        code.result = res
        return res
    })).then(()=>{
        // console.log("all done")
    })
}

async function mkdir(dir) {
    return new Promise((res,rej)=>{
        real_mkdir(dir,(err)=>{
            console.log("done making")
            if(err) {
                // console.log(err)//return rej(err)
            }
            res()
        })
    })
}

async function generate_canvas_images(doc, basedir, subdir) {
    await mkdir(path.join(basedir,subdir))
    // l("rendering all canvas images in doc",doc)
    Promise.all(doc
        .filter(block => block.type === 'CODE' && is_canvas_result(block.result))
        .map(async(block,i) => {
            const img = PImage.make(1000,500);
            block.result.cb(img)
            let fname = `output.${i}.png`
            block.src = path.join(subdir,fname)
            await PImage.encodePNGToStream(img,createWriteStream(path.join(basedir,subdir,fname)))
        })).then(done => {
            console.log("fully done writing images")
        })
}

function render_code_output(block) {
    let code =`<pre>
  <code data-language="${block.language}">${block.content}</code>
</pre>
result
`

    if(block.src) {
        code += `<img src="${block.src}" width="500" height="250">`
    } else {
        code += `<p><code>${block.src}</code></p>`
    }
    return code
}

function render_html(doc) {
    // l('rendering html from doc',doc)
    const title = 'tutorial'
    const content = doc.map(block => {
        // l("block is",block)
        if(block.type === 'H1') return `<h1>${block.content}</h1>`
        if(block.type === 'H2') return `<h2>${block.content}</h2>`
        if(block.type === 'P') return `<p>${block.content}</p>`
        if(block.type === 'CODE') return render_code_output(block)
        return "ERROR"
    }).join("\n")
    let template = `
     <html>
     <head><title>${title}</title></head>
        <body>
        ${content}
        </body>
        </html>`
    return template
}

async function convert_file(infile_path, outdir_path, outfile_name) {
    await mkdir(outdir_path)
    let raw_markdown = (await fs.readFile(infile_path)).toString()
    let doc = await parse_markdown(raw_markdown+"\n")
    await eval_filament(doc)
    await generate_canvas_images(doc,outdir_path,'images')
    let html = render_html(doc)
    console.log("final html is",html)
    await fs.writeFile(path.join(outdir_path,outfile_name),html)
}

const fnt = PImage.registerFont('node_modules/pureimage/tests/unit/fixtures/fonts/SourceSansPro-Regular.ttf','Source Sans Pro');
fnt.load(()=>{
    convert_file('tools/test.md','output', 'output.html')
        .then(()=>{console.log("done")})
        .catch(e => console.error(e))})
