import { hasProp } from '../index'

describe('hasProp(<obj>, <key>)', () => {
  it(`should fail to resolve a missing prop`, () => {
    const valid = hasProp({}, 'something')
    expect(valid).toEqual(false)
  })
})
