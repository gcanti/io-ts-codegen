import * as assert from 'assert'
import * as t from '../src'

describe('property overload', () => {
  it('should be the same without description', () => {
    const longForm = t.typeCombinator([t.property('foo', t.stringType, false)])
    const shortForm = t.typeCombinator([t.property('foo', t.stringType)])

    assert.deepEqual(shortForm, longForm)
  })

  it('should be the same with description', () => {
    const longForm = t.typeCombinator([t.property('foo', t.stringType, false, 'test')])
    const shortForm = t.typeCombinator([t.property('foo', t.stringType, 'test')])

    assert.deepEqual(shortForm, longForm)
  })
})
