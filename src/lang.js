import {CanvasResult, NColor, NGradient, NList, NScalar, NString} from './test1.js'

export const is_error_result = (result) => result instanceof Error
export const is_scalar = (val) => (val instanceof NScalar)
export const is_string = (val) => (val instanceof NString)
export const is_list   = (val) => val instanceof NList
export const is_color  = (val) => val instanceof NColor
export const is_canvas_result = (val) => val instanceof CanvasResult
export function is_gradient(result) {
    return result instanceof NGradient
}
