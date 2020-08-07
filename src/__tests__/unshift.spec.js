import { unshift } from '../index'

describe('unshift(<obj>, <path>, <value>, <context?>)', () => {
  it('should unshift in a 1-dimension array, simple key', () => {
    const obj = { names: [] }
    unshift(obj, 'names', 'Baloo')
    expect(obj.names).toEqual(['Baloo'])
  })

  it('should unshift in a 2-dimension array, simple key', () => {
    const obj = { profiles: [{ names: [] }] }
    unshift(obj, 'profiles.0.names', 'Baloo')
    expect(obj.profiles[0].names).toEqual(['Baloo'])
  })

  it('should unshift in a 1-dimension array, simple key', () => {
    const obj = { names: ['Teddy'] }
    unshift(obj, 'names', 'Baloo')
    expect(obj.names).toEqual(['Baloo', 'Teddy'])
  })

  it('should unshift in a 2-dimension array, simple key', () => {
    const obj = { profiles: [{ names: ['Teddy'] }] }
    unshift(obj, 'profiles.0.names', 'Baloo')
    expect(obj.profiles[0].names).toEqual(['Baloo', 'Teddy'])
  })
})
