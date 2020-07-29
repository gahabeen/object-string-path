import { has } from '../index'

describe('has(<obj>, <path>, <context?>)', () => {
  /** Simple keys */

  it('should check a 1-dimension object, simple key', () => {
    const obj = { name: 'Teddy' }
    const valid = has(obj, 'name')
    expect(valid).toEqual('name' in obj)
  })

  it('should check a 2-dimensions object, simple key', () => {
    const obj = { profile: { name: 'Teddy' } }
    const valid = has(obj, 'profile.name')
    expect(valid).toEqual('name' in obj.profile)
  })

  it('should check a 3-dimensions object, simple key', () => {
    const obj = { user: { profile: { name: 'Teddy' } } }
    const valid = has(obj, 'user.profile.name')
    expect(valid).toEqual('name' in obj.user.profile)
  })

  /** Variable keys */

  it('should check a 1-dimension object, variable key', () => {
    const obj = { name: 'Teddy' }
    const valid = has(obj, '{key}', { key: 'name' })
    expect(valid).toEqual('name' in obj)
  })

  it('should check a 2-dimensions object, variable key', () => {
    const obj = { profile: { name: 'Teddy' } }
    const valid = has(obj, 'profile.{key}', { key: 'name' })
    expect(valid).toEqual('name' in obj.profile)
  })

  it('should check a 3-dimensions object, variable key', () => {
    const obj = { user: { profile: { name: 'Teddy' } } }
    const valid = has(obj, 'user.profile.{key}', { key: 'name' })
    expect(valid).toEqual('name' in obj.user.profile)
  })

  /** Computed keys */

  it('should check a 2-dimensions: object into keyed-object, computed key', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const valid = has(obj, '[slug=one]')
    expect(valid).toEqual(true)
  })

  it('should check a 2-dimensions: object into keyed-object, computed key, bracketless notation', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const valid = has(obj, 'slug=one')
    expect(valid).toEqual(true)
  })

  it('should check a 3-dimensions: array into object into keyed-object, computed key', () => {
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
    const valid = has(obj, '[slug=one].comments[id=2]')
    expect(valid).toEqual(true)
  })

  it('should check a 3-dimensions: array into object into keyed-object, computed key, bracketless notation', () => {
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
    const valid = has(obj, 'slug=one.comments.id=2')
    expect(valid).toEqual(true)
  })

  it('should check a 4-dimensions: keyed-object into array into object into keyed-object, computed key', () => {
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
    const valid = has(obj, '[slug=one].comments[id=2].likedBy[user=1]')
    expect(valid).toEqual(true)
  })

  it('should check a 4-dimensions: keyed-object into array into object into keyed-object, computed key, bracketless notation', () => {
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
    const valid = has(obj, 'slug=one.comments.id=2.likedBy.user=1')
    expect(valid).toEqual(true)
  })

  /** Computed with variable keys */

  it('should check a 2-dimensions: object into keyed-object, computed + 1 variable key', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const valid = has(obj, '[{key}=one]', { key: 'slug' })
    expect(valid).toEqual(true)
  })

  it('should check a 2-dimensions: object into keyed-object, computed + 2 variable keys', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const valid = has(obj, '[{key}={value}]', { key: 'slug', value: 'one' })
    expect(valid).toEqual(true)
  })

  it('should check a 2-dimensions: object into keyed-object, computed key, bracketless notation + 2 variable keys', () => {
    const obj = {
      1: { id: 1, slug: 'one', title: 'One' },
      2: { id: 2, slug: 'two', title: 'Two' },
    }
    const valid = has(obj, '{key}={value}', { key: 'slug', value: 'one' })
    expect(valid).toEqual(true)
  })

  it('should check a 3-dimensions: array into object into keyed-object, computed key + 2 variable keys stored in array', () => {
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
    const valid = has(obj, '[{keys.0}=one].comments[{keys[1]}=2]', { keys: ['slug', 'id'] })
    expect(valid).toEqual(true)
  })

  /** Computed with variable tuple keys */

  it('should check a 3-dimensions: array into object into keyed-object, computed key + 4 variable keys stored in tuples', () => {
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
    const valid = has(obj, '{pageRef}.comments.{commentRef}', {
      pageRef: ['slug', 'one'],
      commentRef: ['id', 2],
    })
    expect(valid).toEqual(true)
  })

  it('should check a simple path with faulty brackets', () => {
    const obj = { profile: { name: 'Teddy' } }
    expect(has(obj, 'profile.[name]')).toBe(true)
  })
})
