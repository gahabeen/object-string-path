import { insert } from '../index'

describe('insert(<obj>, <path>, <value>, <context?>)', () => {
  it('should insert in a 1-dimension array, simple key', () => {
    const obj = { names: ['John', 'Jane'] }
    insert(obj, 'names.1', 'Baloo')
    expect(obj.names).toEqual(['John', 'Baloo', 'Jane'])
  })

  it('should insert in a 2-dimension array, simple key', () => {
    const obj = { profiles: [{ names: ['John', 'Jane'] }] }
    insert(obj, 'profiles.0.names.2', 'Baloo')
    expect(obj.profiles[0].names).toEqual(['John', 'Jane', 'Baloo'])
  })
})
