import { setProp } from '../index'

describe('setProp(<obj>, <key>)', () => {
  it(`should retrieve root object when key is undefined`, () => {
    let obj = { one: 1 }
    setProp(obj, undefined, { one: 2 })
    expect(obj).toEqual({ one: 2 })
  })
})
