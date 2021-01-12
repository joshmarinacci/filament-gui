/**
 * @jest-environment jsdom
 */

function add(a,b) {
    return a + b
}


test('add', () => {
    // 4 + 2 >> 6
    expect(add(4,2)).toEqual(6)
    // 4 + [1,2] >> [5,6]
    expect(add(4,[1,2])).toEqual([5,6])
    //  [1,2] + 4 >> [5,6]
    expect(add([1,2],4)).toEqual([5,6])
    // [4,5]+[1,2]
    expect(add([4,5],[1,2])).toEqual([5,7])
})

test('subtract',()=>{
    // 2 - 1
    // 1 - 2
    // -1 - 2
    // [1,2,3] - 4
    // 4 - [1,2,3]
})

test('multiply', () => {
    // 4 * 5
    // [1,2,3] * 4
    // 4 * [1,2,3]
    // [1,2,3] * [4,5,6]
})

test('divide',() => {
    // 4/5
    // [1,2,3] / 4
    // 4 / [1,2,3]
    // [4,6,8] / [2,3,4]
})

test('power',() => {
    // 2**2
    // 2**3
})

//negate
test('negate', ()=>{
    // -88
    // - -88
    // - [1,2,3]
    //
})
//factorial
//!1 = 1
//!0 = 0
//!3 = 1*2*3 = 6
//![1,2,3,4,5] = [1,2,6,24,120]

//mod
//2 mod 3 = 2
//0 mod 3 = 0
//4 mod 3 = 1
//[0,1,2,3,4,5] mod 4 = [0,1,2,3,0,1]
//4 mod [0,1,2,3,4,5] = [inf?, 0,0,3,0,1]

//sin, cos, tan

//random. how to test this?
//exp meaning e^n
//sqrt
//max and min
//is_prime