import { pushProp } from '../index'

describe('pushProp(<obj>, <key>)', () => {
  it(`should add an element at the end of an array`, () => {
    let obj = []
    pushProp(obj, 1)
    expect(obj).toEqual([1])
  })

  it(`should add  an element at the end of an array with existing elements`, () => {
    let obj = [2]
    pushProp(obj, 1)
    expect(obj).toEqual([2, 1])
  })
})
