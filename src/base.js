export class Primitive {
    constructor() {
    }
    log(...args) {
        console.log(this.constructor.name,...args)
    }
}

export const is_error_result = (result) => result instanceof Error
export const is_scalar = (val) => /*(val instanceof NScalar) ||*/ (typeof val === 'number')
export const is_string = (val) => /*(val instanceof NString ||*/ (typeof val === 'string')
export const is_list   = (val) => /*val instanceof NList ||*/ Array.isArray(val)

