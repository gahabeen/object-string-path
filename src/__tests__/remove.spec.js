import { remove } from '../index'

describe('remove(<obj>, <path>, <context?>)', () => {
  /** Simple keys */

  it('should remove in a 1-dimension object, simple key', () => {
    const obj = { name: 'Teddy' }
    remove(obj, 'name')
    expect(obj).toEqual({})
  })

  it('should remove in a 2-dimensions object, simple key', () => {
    const obj = { profile: { name: 'Teddy' } }
    remove(obj, 'profile.name')
    expect(obj.profile).toEqual({})
  })

  it('should remove in a 3-dimensions object, simple key', () => {
    const obj = { user: { profile: { name: 'Teddy' } } }
    remove(obj, 'user.profile.name')
    expect(obj.user.profile).toEqual({})
  })

  // /** Variable keys */

  it('should remove in a 1-dimension object, variable key', () => {
    const obj = { name: 'Teddy' }
    remove(obj, '{key}', { key: 'name' })
    expect(obj).toEqual({})
  })

  it('should remove in a 2-dimensions object, variable key', () => {
    const obj = { profile: { name: 'Teddy' } }
    remove(obj, 'profile.{key}', { key: 'name' })
    expect(obj.profile).toEqual({})
  })

  it('should remove in a 3-dimensions object, variable key', () => {
    const obj = { user: { profile: { name: 'Teddy' } } }
    remove(obj, 'user.profile.{key}', { key: 'name' })
    expect(obj.user.profile).toEqual({})
  })

  // /** Computed keys */

  it('should remove in a 2-dimensions: object into keyed-object, computed key', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    remove(obj, '[slug=one].title')
    expect(obj['1']).toEqual({ id: 1, slug: 'one' })
  })

  it('should remove in a 2-dimensions: object into keyed-object, computed key, bracketless notation', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    remove(obj, 'slug=one.title')
    expect(obj['1']).toEqual({ id: 1, slug: 'one' })
  })

  it('should remove in a 3-dimensions: array into object into keyed-object, computed key', () => {
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
    remove(obj, '[slug=one].comments[id=2].comment')
    expect(obj['1'].comments[1]).toEqual({ id: 2 })
  })

  it('should remove in a 3-dimensions: array into object into keyed-object, computed key, bracketless notation', () => {
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
    remove(obj, 'slug=one.comments.id=2.comment')
    expect(obj['1'].comments[1]).toEqual({ id: 2 })
  })

  it('should remove in a 4-dimensions: keyed-object into array into object into keyed-object, computed key', () => {
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
              1: { user: '1', name: 'John' },
              2: { user: '2' },
            },
          },
        ],
      },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    remove(obj, '[slug=one].comments[id=2].likedBy[user=1].name')
    expect(obj['1'].comments[1].likedBy['1']).toEqual({ user: '1' })
  })

  it('should remove in a 4-dimensions: keyed-object into array into object into keyed-object, computed key, bracketless notation', () => {
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
              1: { user: '1', name: 'John' },
              2: { user: '2' },
            },
          },
        ],
      },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    remove(obj, 'slug=one.comments.id=2.likedBy.user=1.name')
    expect(obj['1'].comments[1].likedBy['1']).toEqual({ user: '1' })
  })

  // /** Computed with variable keys */

  it('should remove in a 2-dimensions: object into keyed-object, computed + 1 variable key', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    remove(obj, '[{key}=one].title', { key: 'slug' })
    expect(obj['1']).toEqual({ id: 1, slug: 'one' })
  })

  it('should remove in a 2-dimensions: object into keyed-object, computed + 2 variable keys', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    remove(obj, '[{key}={value}].title', { key: 'slug', value: 'one' })
    expect(obj['1']).toEqual({ id: 1, slug: 'one' })
  })

  it('should remove in a 2-dimensions: object into keyed-object, computed key, bracketless notation + 2 variable keys', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    remove(obj, '{key}={value}.title', { key: 'slug', value: 'one' })
    expect(obj['1']).toEqual({ id: 1, slug: 'one' })
  })

  it('should remove in a 3-dimensions: array into object into keyed-object, computed key + 2 variable keys stored in array', () => {
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
    remove(obj, '[{keys.0}=one].comments[{keys[1]}=2].comment', { keys: ['slug', 'id'] })
    expect(obj['1'].comments[1]).toEqual({ id: 2 })
  })

  // /** Computed with variable tuple keys */

  it('should remove in a 3-dimensions: array into object into keyed-object, computed key + 4 variable keys stored in tuples', () => {
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
    remove(obj, '{pageRef}.comments.{commentRef}.comment', {
      pageRef: ['slug', 'one'],
      commentRef: ['id', 2],
    })
    expect(obj['1'].comments[1]).toEqual({ id: 2 })
  })

  it('should remove a simple path value with faulty brackets', () => {
    const obj = { profile: { name: 'Teddy' } }
    remove(obj, 'profile.[name]')
    expect(obj.profile).toEqual({})
  })
})
