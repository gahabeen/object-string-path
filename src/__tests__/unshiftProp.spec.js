import { unshiftProp } from '../index'

describe('unshiftProp(<obj>, <key>)', () => {
  it(`should add an element at the beginning of an array`, () => {
    let obj = []
    unshiftProp(obj, 1)
    expect(obj).toEqual([1])
  })

  it(`should add  an element at the beginning of an array with existing elements`, () => {
    let obj = [2]
    unshiftProp(obj, 1)
    expect(obj).toEqual([1, 2])
  })
})
