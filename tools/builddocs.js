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

function parse_markdown_blocks(str) {
    let parser = {}
    parser.grammar = ohm.grammar(`
        MarkdownOuter {
            Doc = Block*
            Block = Header | Blank
            Header = "#" rest
            Paragraph = nl nl any nl
            Blank = nl
            nl = "\\n"
            rest = (~nl any)* nl
        }
    `)
    parser.semantics = parser.grammar.createSemantics()
    parser.semantics.addOperation('blocks',{
        _terminal() { return this.sourceString },
        Header:function(a,b) {
            // l("header",a.blocks(),'-',b.blocks())
            return ['header',b.blocks()]
        },
        Block:function(a) {
            l("block",a.blocks())
            return a.blocks()
        },
        rest:function(a,b) {
            // l("rest",a.blocks(),"foo",b.blocks())
            return a.blocks().join("")
        }
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
        if(block[0] === 'header') return `<h1>${block[1]}</h1>`
        return "some block"
    }).join("\n")
    let template = `
    <html><header><title>${title}</title></header><body>
    ${content}
    </body></html>
    `
    return template
}

async function convert_file(infile_path, outdir_path, outfile_name) {
    let raw_markdown = (await fs.readFile(infile_path)).toString()
    let doc = await parse_markdown(raw_markdown)
    await eval_filament(doc)
    await generate_canvas_images(doc,path.join(outdir_path,'images'))
    let html = render_html(doc)
    console.log("final html is",html)
    // await fs.writeFile(path.join(outdir_path,outfile_name),html)
}


convert_file('tools/test.md','output', 'output.html')
    .then(()=>{console.log("done")})
    .catch(e => console.error(e))