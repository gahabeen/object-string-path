import { get } from '../index'

describe('get(<obj>, <path>, <context?>)', () => {
  /** Simple keys */

  it('should resolve a 1-dimension object, simple key', () => {
    const obj = { name: 'Teddy' }
    const name = get(obj, 'name')
    expect(name).toEqual(obj.name)
  })

  it('should resolve a 2-dimensions object, simple key', () => {
    const obj = { profile: { name: 'Teddy' } }
    const name = get(obj, 'profile.name')
    expect(name).toEqual(obj.profile.name)
  })

  it('should resolve a 3-dimensions object, simple key', () => {
    const obj = { user: { profile: { name: 'Teddy' } } }
    const name = get(obj, 'user.profile.name')
    expect(name).toEqual(obj.user.profile.name)
  })

  /** Variable keys */

  it('should resolve a 1-dimension object, variable key', () => {
    const obj = { name: 'Teddy' }
    const name = get(obj, '{key}', { key: 'name' })
    expect(name).toEqual(obj.name)
  })

  it('should resolve a 2-dimensions object, variable key', () => {
    const obj = { profile: { name: 'Teddy' } }
    const name = get(obj, 'profile.{key}', { key: 'name' })
    expect(name).toEqual(obj.profile.name)
  })

  it('should resolve a 3-dimensions object, variable key', () => {
    const obj = { user: { profile: { name: 'Teddy' } } }
    const name = get(obj, 'user.profile.{key}', { key: 'name' })
    expect(name).toEqual(obj.user.profile.name)
  })

  /** Computed keys */

  it('should resolve a 2-dimensions: object into keyed-object, computed key', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const value = get(obj, '[slug=one]')
    expect(value).toEqual(obj['1'])
  })

  it('should resolve a 2-dimensions: object into keyed-object, computed key, bracketless notation', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const value = get(obj, 'slug=one')
    expect(value).toEqual(obj['1'])
  })

  it('should resolve a 3-dimensions: array into object into keyed-object, computed key', () => {
    const obj = {
      1: {
        id: 1,
        slug: 'one',
        title: 'One',
        comments: [
          { id: 1, comment: 'First comment' },
          { id: 2, comment: 'Second comment' },
        ],
      },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const value = get(obj, '[slug=one].comments[id=2]')
    expect(value).toEqual(obj['1'].comments[1])
  })

  it('should resolve a 3-dimensions: array into object into keyed-object, computed key, bracketless notation', () => {
    const obj = {
      1: {
        id: 1,
        slug: 'one',
        title: 'One',
        comments: [
          { id: 1, comment: 'First comment' },
          { id: 2, comment: 'Second comment' },
        ],
      },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const value = get(obj, 'slug=one.comments.id=2')
    expect(value).toEqual(obj['1'].comments[1])
  })

  it('should resolve a 4-dimensions: keyed-object into array into object into keyed-object, computed key', () => {
    const obj = {
      1: {
        id: 1,
        slug: 'one',
        title: 'One',
        comments: [
          {
            id: 1,
            comment: 'First comment',
          },
          {
            id: 2,
            comment: 'Second comment',
            likedBy: {
              1: { user: '1' },
              2: { user: '2' },
            },
          },
        ],
      },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const value = get(obj, '[slug=one].comments[id=2].likedBy[user=1]')
    expect(value).toEqual(obj['1'].comments[1].likedBy['1'])
  })

  it('should resolve a 4-dimensions: keyed-object into array into object into keyed-object, computed key, bracketless notation', () => {
    const obj = {
      1: {
        id: 1,
        slug: 'one',
        title: 'One',
        comments: [
          {
            id: 1,
            comment: 'First comment',
          },
          {
            id: 2,
            comment: 'Second comment',
            likedBy: {
              1: { user: '1' },
              2: { user: '2' },
            },
          },
        ],
      },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const value = get(obj, 'slug=one.comments.id=2.likedBy.user=1')
    expect(value).toEqual(obj['1'].comments[1].likedBy['1'])
  })

  /** Computed with variable keys */

  it('should resolve a 2-dimensions: object into keyed-object, computed + 1 variable key', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const value = get(obj, '[{key}=one]', { key: 'slug' })
    expect(value).toEqual(obj['1'])
  })

  it('should resolve a 2-dimensions: object into keyed-object, computed + 2 variable keys', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const value = get(obj, '[{key}={value}]', { key: 'slug', value: 'one' })
    expect(value).toEqual(obj['1'])
  })

  it('should resolve a 2-dimensions: object into keyed-object, computed key, bracketless notation + 2 variable keys', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const value = get(obj, '{key}={value}', { key: 'slug', value: 'one' })
    expect(value).toEqual(obj['1'])
  })

  it('should resolve a 3-dimensions: array into object into keyed-object, computed key + 2 variable keys stored in array', () => {
    const obj = {
      1: {
        id: 1,
        slug: 'one',
        title: 'One',
        comments: [
          { id: 1, comment: 'First comment' },
          { id: 2, comment: 'Second comment' },
        ],
      },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const value = get(obj, '[{keys.0}=one].comments[{keys[1]}=2]', { keys: ['slug', 'id'] })
    expect(value).toEqual(obj['1'].comments[1])
  })

  /** Computed with variable tuple keys */

  it('should resolve a 3-dimensions: array into object into keyed-object, computed key + 4 variable keys stored in tuples', () => {
    const obj = {
      1: {
        id: 1,
        slug: 'one',
        title: 'One',
        comments: [
          { id: 1, comment: 'First comment' },
          { id: 2, comment: 'Second comment' },
        ],
      },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const value = get(obj, '{pageRef}.comments.{commentRef}', {
      pageRef: ['slug', 'one'],
      commentRef: ['id', 2],
    })
    expect(value).toEqual(obj['1'].comments[1])
  })

  it('should resolve a simple path with faulty brackets', () => {
    const obj = { profile: { name: 'Teddy' } }
    const name = get(obj, 'profile.[name]')
    expect(name).toEqual(obj.profile.name)
  })

  /** Spread operator in Arrays */

  it('should get spread iterable, spread operator', () => {
    const obj = { products: [{ name: 'Berries' }, { name: 'Marmelade' }] }
    const value = get(obj, 'products..')
    expect(value).toEqual(obj.products)
  })

  it('should get spread iterable, star version of spread operator', () => {
    const obj = { products: [{ name: 'Berries' }, { name: 'Marmelade' }] }
    const value = get(obj, 'products.*')
    expect(value).toEqual(obj.products)
  })

  it('should get map value in array, spread operator', () => {
    const obj = { products: [{ name: 'Berries' }, { name: 'Marmelade' }] }
    const value = get(obj, 'products..name')
    expect(value).toEqual(obj.products.map((p) => p.name))
  })

  it('should get map value in array, star version of spread operator', () => {
    const obj = { products: [{ name: 'Berries' }, { name: 'Marmelade' }] }
    const value = get(obj, 'products.*.name')
    expect(value).toEqual(obj.products.map((p) => p.name))
  })

  it('should get map value in nested array, spread operator', () => {
    const obj = {
      products: [
        { name: 'Berries', details: [{ title: 'Something' }, { title: 'Else' }] },
        { name: 'Marmelade', details: [{ title: 'Something' }, { title: 'Else' }] },
      ],
    }
    const value = get(obj, 'products..details..title')
    expect(value).toEqual(obj.products.map((p) => 'details' in p && p.details.map((d) => d.title)))
  })

  it('should get map value in nested array, star version of spread operator', () => {
    const obj = {
      products: [
        { name: 'Berries', details: [{ title: 'Something' }, { title: 'Else' }] },
        { name: 'Marmelade', details: [{ title: 'Something' }, { title: 'Else' }] },
      ],
    }
    const value = get(obj, 'products.*.details.*.title')
    expect(value).toEqual(obj.products.map((p) => 'details' in p && p.details.map((d) => d.title)))
  })

  /** Spread operator in Objects */

  it('should get spread iterable, spread operator', () => {
    const obj = { products: { '1': { name: 'Berries' }, '2': { name: 'Marmelade' } } }
    const value = get(obj, 'products..')
    expect(value).toEqual(Object.values(obj.products))
  })

  it('should get spread iterable, star version of spread operator', () => {
    const obj = { products: { '1': { name: 'Berries' }, '2': { name: 'Marmelade' } } }
    const value = get(obj, 'products.*')
    expect(value).toEqual(Object.values(obj.products))
  })

  it('should get map value in array, spread operator', () => {
    const obj = { products: { '1': { name: 'Berries' }, '2': { name: 'Marmelade' } } }
    const value = get(obj, 'products..name')
    expect(value).toEqual(Object.values(obj.products).map((p) => p.name))
  })

  it('should get map value in array, star version of spread operator', () => {
    const obj = { products: { '1': { name: 'Berries' }, '2': { name: 'Marmelade' } } }
    const value = get(obj, 'products.*.name')
    expect(value).toEqual(Object.values(obj.products).map((p) => p.name))
  })

  it('should get map value in nested array, spread operator', () => {
    const obj = {
      products: {
        '1': { name: 'Berries', details: { '1': { title: 'Something' }, '2': { title: 'Else' } } },
        '2': { name: 'Marmelade', details: { '1': { title: 'Something' }, '2': { title: 'Else' } } },
      },
    }
    const value = get(obj, 'products..details..title')
    expect(value).toEqual(Object.values(obj.products).map((p) => 'details' in p && Object.values(p.details).map((d) => d.title)))
  })

  it('should get map value in nested array, star version of spread operator', () => {
    const obj = {
      products: {
        '1': { name: 'Berries', details: { '1': { title: 'Something' }, '2': { title: 'Else' } } },
        '2': { name: 'Marmelade', details: { '1': { title: 'Something' }, '2': { title: 'Else' } } },
      },
    }
    const value = get(obj, 'products.*.details.*.title')
    expect(value).toEqual(Object.values(obj.products).map((p) => 'details' in p && Object.values(p.details).map((d) => d.title)))
  })
})
