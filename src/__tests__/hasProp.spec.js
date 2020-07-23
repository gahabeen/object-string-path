import { hasProp } from '../index'

describe('hasProp(<obj>, <key>)', () => {
  /** Fail */

  it(`should fail to resolve a missing prop`, () => {
    const valid = hasProp({}, 'something')
    expect(valid).toEqual(false)
  })
})
