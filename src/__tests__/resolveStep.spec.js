import { resolveStep, stringifyArray } from '../index'

describe('resolveStep(<steps>, <parent>, <context?>)', () => {
  /** Fail */

  it(`should fail to resolve a variable without context`, () => {
    const step = '{slug}'
    const output = resolveStep([step])
    expect(output.failed).toEqual(true)
  })

  it(`should fail to resolve a tuple variable without context`, () => {
    const step = stringifyArray(['slug', 'once'])
    const output = resolveStep([step])
    expect(output.failed).toEqual(true)
  })

  it(`should fail to resolve an empty variable declaration`, () => {
    const step = '{}'
    const output = resolveStep([step])
    expect(output.failed).toEqual(true)
  })

  it(`should fail to resolve a wrongfuly written computed declaration (missing RHS)`, () => {
    const step = 'id='
    const output = resolveStep([step])
    expect(output.failed).toEqual(true)
  })

  it(`should fail to resolve a wrongfuly written computed declaration (missing LHS)`, () => {
    const step = '=slug'
    const output = resolveStep([step])
    expect(output.failed).toEqual(true)
  })

  it(`should fail to resolve an unapropriate key`, () => {
    const step = {}
    const output = resolveStep([step])
    expect(output.failed).toEqual(true)
  })
})
