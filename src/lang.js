import {add, divide, multiply, subtract} from './math.js'
import {drop, join, map, reverse, select, sort, sum, take, range, length} from './lists.js'
import {chart} from './chart.js'

export const scope = {
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide,
    length: length,
    sum: sum,
    range: range,
    map: map,
    take: take,
    drop: drop,
    sort: sort,
    join: join,
    select: select,
    reverse:reverse,
    chart:chart,
}



export function real_eval(code) {

    let lines = code.split("\n")
    lines[lines.length - 1] = 'return ' + lines[lines.length - 1]

    let defines = Object.keys(scope).map(key => {
        return `    const ${key} = scope.${key}`
    }).join("\n")
    let gen_code = `
"use strict"; 
return function(scope) {
${defines}
${lines.join("\n")}
};
`
    // console.log("generated code is", gen_code)
    try {
        return Function(gen_code)()(scope)
    } catch (e) {
        console.error(e)
        return e
    }
}