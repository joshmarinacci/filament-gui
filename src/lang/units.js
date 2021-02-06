export const UNITS = {
    'meter':'meter',
    'm':'meter',
    'meters':'meter',
    'foot':'foot',
    'ft':'foot',
    'feet':'foot',
    '%':'percent',
    'percent':'percent',
    'in':'inch',
    'mps':'meter/second',
    'meter/second':'meter/second',
    'mpss':'meter/second/second',
    'meter/second/second':'meter/second/second',
}


export function to_canonical_unit(b) {
    // console.log("converting to canonical unit",b)
    return UNITS[b]
}

const FOOT_TO_METER = 0.3048

export function convert_unit(a_val,a_unit, b_unit) {
    // console.log("converting",a_val, a_unit,'to',b_unit)
    b_unit = to_canonical_unit(b_unit)
    if(a_unit === 'meter' && b_unit === 'foot') {
        a_val = a_val/FOOT_TO_METER
    }
    return a_val
}
