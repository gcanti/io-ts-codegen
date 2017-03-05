import * as assert from 'assert'
import * as ast from '../src/runtime/ast'
import * as gen from '../src/runtime/gen'

describe('LiteralCombinator', () => {

  it('without name', () => {
    const type = ast.literalCombinator('foo')
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.literal('foo')`)
  })

  it('with name', () => {
    const type = ast.literalCombinator(1, 'Foo')
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.literal(1, 'Foo')`)
  })

})
