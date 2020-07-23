import { getProp } from '../index'

describe('getProp(<obj>, <key>)', () => {
  it(`should retrieve root object when key is undefined`, () => {
    const result = getProp({ one: 1 })
    expect(result).toEqual({ one: 1 })
  })
})
