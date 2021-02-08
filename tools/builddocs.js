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
import {promises as fs} from 'fs'
import ohm from 'ohm-js'

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
    l("parsing content from block",block)
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
    l('parsing raw markdown',raw_markdown)
    let blocks = parse_markdown_blocks(raw_markdown)
    l("blocks are",blocks)
    let doc = blocks.map(block => parse_markdown_content(block))
    return doc
}

async function eval_filament(doc) {
    l("evaluating all filament objects in",doc)
}

async function generate_canvas_images(doc, s) {
    l("rendering all canvas images in doc",doc)
}

function render_html(doc) {
    l('rendering html from doc',doc)
    const title = 'tutorial'
    const content = doc.map(block => {
        l("block is",block)
        if(block.type === 'H1') return `<h1>${block.content}</h1>`
        if(block.type === 'H2') return `<h2>${block.content}</h2>`
        if(block.type === 'P') return `<p>${block.content}</p>`
        if(block.type === 'CODE') return `<pre><code data-language="${block.language}">${block.content}</code></pre>`
        return "some block"
    }).join("\n")
    let template = `
     <html><head>
        <title>${title}</title></head>
        <body>
        ${content}
        </body>
        </html>`
    return template
}

async function convert_file(infile_path, outdir_path, outfile_name) {
    let raw_markdown = (await fs.readFile(infile_path)).toString()
    let doc = await parse_markdown(raw_markdown+"\n")
    await eval_filament(doc)
    await generate_canvas_images(doc,path.join(outdir_path,'images'))
    let html = render_html(doc)
    console.log("final html is",html)
    await fs.writeFile(path.join(outdir_path,outfile_name),html)
}


convert_file('tools/test.md','output', 'output.html')
    .then(()=>{console.log("done")})
    .catch(e => console.error(e))