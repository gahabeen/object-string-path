import { set } from '../index'

describe('set(<obj>, <path>, <value>, <context?>)', () => {
  /** Simple keys */

  it('should set in a 1-dimension object, simple key', () => {
    const obj = { name: 'Teddy' }
    set(obj, 'name', 'Baloo')
    expect(obj.name).toEqual('Baloo')
  })

  it('should set in a 2-dimensions object, simple key', () => {
    const obj = { profile: { name: 'Teddy' } }
    set(obj, 'profile.name', 'Baloo')
    expect(obj.profile.name).toEqual('Baloo')
  })

  it('should set in a 3-dimensions object, simple key', () => {
    const obj = { user: { profile: { name: 'Teddy' } } }
    set(obj, 'user.profile.name', 'Baloo')
    expect(obj.user.profile.name).toEqual('Baloo')
  })

  // /** Variable keys */

  it('should set in a 1-dimension object, variable key', () => {
    const obj = { name: 'Teddy' }
    set(obj, '{key}', 'Baloo', { key: 'name' })
    expect(obj.name).toEqual('Baloo')
  })

  it('should set in a 2-dimensions object, variable key', () => {
    const obj = { profile: { name: 'Teddy' } }
    set(obj, 'profile.{key}', 'Baloo', { key: 'name' })
    expect(obj.profile.name).toEqual('Baloo')
  })

  it('should set in a 3-dimensions object, variable key', () => {
    const obj = { user: { profile: { name: 'Teddy' } } }
    set(obj, 'user.profile.{key}', 'Baloo', { key: 'name' })
    expect(obj.user.profile.name).toEqual('Baloo')
  })

  // /** Computed keys */

  it('should set in a 2-dimensions: object into keyed-object, computed key', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    set(obj, '[slug=one].title', 'ONE')
    expect(obj['1'].title).toEqual('ONE')
  })

  it('should set in a 2-dimensions: object into keyed-object, computed key, bracketless notation', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    set(obj, 'slug=one.title', 'ONE')
    expect(obj['1'].title).toEqual('ONE')
  })

  it('should set in a 3-dimensions: array into object into keyed-object, computed key', () => {
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
    set(obj, '[slug=one].comments[id=2].comment', 'Nice comment')
    expect(obj['1'].comments[1].comment).toEqual('Nice comment')
  })

  it('should set in a 3-dimensions: array into object into keyed-object, computed key, bracketless notation', () => {
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
    set(obj, 'slug=one.comments.id=2.comment', 'Nice comment')
    expect(obj['1'].comments[1].comment).toEqual('Nice comment')
  })

  it('should set in a 4-dimensions: keyed-object into array into object into keyed-object, computed key', () => {
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
    set(obj, '[slug=one].comments[id=2].likedBy[user=1].name', 'Teddy')
    expect(obj['1'].comments[1].likedBy['1'].name).toEqual('Teddy')
  })

  it('should set in a 4-dimensions: keyed-object into array into object into keyed-object, computed key, bracketless notation', () => {
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
    set(obj, 'slug=one.comments.id=2.likedBy.user=1.name', 'Teddy')
    expect(obj['1'].comments[1].likedBy['1'].name).toEqual('Teddy')
  })

  // /** Computed with variable keys */

  it('should set in a 2-dimensions: object into keyed-object, computed + 1 variable key', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    set(obj, '[{key}=one].title', 'ONE', { key: 'slug' })
    expect(obj['1'].title).toEqual('ONE')
  })

  it('should set in a 2-dimensions: object into keyed-object, computed + 2 variable keys', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    set(obj, '[{key}={value}].title', 'ONE', { key: 'slug', value: 'one' })
    expect(obj['1'].title).toEqual('ONE')
  })

  it('should set in a 2-dimensions: object into keyed-object, computed key, bracketless notation + 2 variable keys', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    set(obj, '{key}={value}.title', 'ONE', { key: 'slug', value: 'one' })
    expect(obj['1'].title).toEqual('ONE')
  })

  it('should set in a 3-dimensions: array into object into keyed-object, computed key + 2 variable keys stored in array', () => {
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
    set(obj, '[{keys.0}=one].comments[{keys[1]}=2].comment', 'Nice comment', { keys: ['slug', 'id'] })
    expect(obj['1'].comments[1].comment).toEqual('Nice comment')
  })

  // /** Computed with variable tuple keys */

  it('should set in a 3-dimensions: array into object into keyed-object, computed key + 4 variable keys stored in tuples', () => {
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
    set(obj, '{pageRef}.comments.{commentRef}.comment', 'Nice comment', {
      pageRef: ['slug', 'one'],
      commentRef: ['id', 2],
    })
    expect(obj['1'].comments[1].comment).toEqual('Nice comment')
  })

  it('should set a simple path value with faulty brackets', () => {
    const obj = { profile: { name: 'Teddy' } }
    set(obj, 'profile.[name]', 'Baloo')
    expect(obj.profile.name).toBe('Baloo')
  })

  /** Spread operator in Arrays */

  it('should set in a spread iterable, spread operator', () => {
    const obj = { products: [{ name: 'Berries' }, { name: 'Marmelade' }] }
    set(obj, 'products..', null)
    expect(obj.products).toEqual([null, null])
  })

  it('should set in a spread iterable, star version of spread operator', () => {
    const obj = { products: [{ name: 'Berries' }, { name: 'Marmelade' }] }
    set(obj, 'products.*', null)
    expect(obj.products).toEqual([null, null])
  })

  it('should set in a map value in array, spread operator', () => {
    const obj = { products: [{ name: 'Berries' }, { name: 'Marmelade' }] }
    set(obj, 'products..name', null)
    expect(obj).toEqual({ products: [{ name: null }, { name: null }] })
  })

  it('should set in a map value in array, star version of spread operator', () => {
    const obj = { products: [{ name: 'Berries' }, { name: 'Marmelade' }] }
    set(obj, 'products.*.name', null)
    expect(obj).toEqual({ products: [{ name: null }, { name: null }] })
  })

  it('should set in a map value in nested array, spread operator', () => {
    const obj = {
      products: [
        { name: 'Berries', details: [{ title: 'Something' }, { title: 'Else' }] },
        { name: 'Marmelade', details: [{ title: 'Something' }, { title: 'Else' }] },
      ],
    }
    set(obj, 'products..details..title', null)
    expect(obj).toEqual({
      products: [
        { name: 'Berries', details: [{ title: null }, { title: null }] },
        { name: 'Marmelade', details: [{ title: null }, { title: null }] },
      ],
    })
  })

  it('should set in a map value in nested array, star version of spread operator', () => {
    const obj = {
      products: [
        { name: 'Berries', details: [{ title: 'Something' }, { title: 'Else' }] },
        { name: 'Marmelade', details: [{ title: 'Something' }, { title: 'Else' }] },
      ],
    }
    set(obj, 'products.*.details.*.title', null)
    expect(obj).toEqual({
      products: [
        { name: 'Berries', details: [{ title: null }, { title: null }] },
        { name: 'Marmelade', details: [{ title: null }, { title: null }] },
      ],
    })
  })

  /** Spread operator in Objects */

  it('should set in a spread iterable, spread operator', () => {
    const obj = { products: { '1': { name: 'Berries' }, '2': { name: 'Marmelade' } } }
    set(obj, 'products..', null)
    expect(obj.products).toEqual({ '1': null, '2': null })
  })

  it('should set in a spread iterable, star version of spread operator', () => {
    const obj = { products: { '1': { name: 'Berries' }, '2': { name: 'Marmelade' } } }
    set(obj, 'products.*', null)
    expect(obj.products).toEqual({ '1': null, '2': null })
  })

  it('should set in a map value in array, spread operator', () => {
    const obj = { products: { '1': { name: 'Berries' }, '2': { name: 'Marmelade' } } }
    set(obj, 'products..name', null)
    expect(obj.products).toEqual({ '1': { name: null }, '2': { name: null } })
  })

  it('should set in a map value in array, star version of spread operator', () => {
    const obj = { products: { '1': { name: 'Berries' }, '2': { name: 'Marmelade' } } }
    set(obj, 'products.*.name', null)
    expect(obj.products).toEqual({ '1': { name: null }, '2': { name: null } })
  })

  it('should set in a map value in nested array, spread operator', () => {
    const obj = {
      products: {
        '1': { name: 'Berries', details: { '1': { title: 'Something' }, '2': { title: 'Else' } } },
        '2': { name: 'Marmelade', details: { '1': { title: 'Something' }, '2': { title: 'Else' } } },
      },
    }
    set(obj, 'products..details..title', null)
    expect(obj.products).toEqual({
      '1': { name: 'Berries', details: { '1': { title: null }, '2': { title: null } } },
      '2': { name: 'Marmelade', details: { '1': { title: null }, '2': { title: null } } },
    })
  })

  it('should set in a map value in nested array, star version of spread operator', () => {
    const obj = {
      products: {
        '1': { name: 'Berries', details: { '1': { title: 'Something' }, '2': { title: 'Else' } } },
        '2': { name: 'Marmelade', details: { '1': { title: 'Something' }, '2': { title: 'Else' } } },
      },
    }
    set(obj, 'products.*.details.*.title', null)
    expect(obj.products).toEqual({
      '1': { name: 'Berries', details: { '1': { title: null }, '2': { title: null } } },
      '2': { name: 'Marmelade', details: { '1': { title: null }, '2': { title: null } } },
    })
  })
})
