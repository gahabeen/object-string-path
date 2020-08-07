import { push } from '../index'

describe('push(<obj>, <path>, <value>, <context?>)', () => {
  it('should push in a 1-dimension array, simple key', () => {
    const obj = { names: [] }
    push(obj, 'names', 'Baloo')
    expect(obj.names).toEqual(['Baloo'])
  })

  it('should push in a 2-dimension array, simple key', () => {
    const obj = { profiles: [{ names: [] }] }
    push(obj, 'profiles.0.names', 'Baloo')
    expect(obj.profiles[0].names).toEqual(['Baloo'])
  })

  it('should push in a 1-dimension array, simple key', () => {
    const obj = { names: ['Teddy'] }
    push(obj, 'names', 'Baloo')
    expect(obj.names).toEqual(['Teddy', 'Baloo'])
  })

  it('should push in a 2-dimension array, simple key', () => {
    const obj = { profiles: [{ names: ['Teddy'] }] }
    push(obj, 'profiles.0.names', 'Baloo')
    expect(obj.profiles[0].names).toEqual(['Teddy', 'Baloo'])
  })
})
