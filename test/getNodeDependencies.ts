import * as assert from 'assert'
import * as t from '../src'

describe('getNodeDependencies', () => {
  const dependency = t.typeCombinator([t.property('tag', t.literalCombinator('A')), t.property('a', t.identifier('A'))])

  it('should support TaggedUnionCombinator', () => {
    assert.deepEqual(t.getNodeDependencies(t.taggedUnionCombinator('tag', [dependency])), ['A'])
  })
})
