import * as assert from 'assert'
import * as ast from '../src/runtime/ast'
import * as gen from '../src/runtime/gen'

describe('ArrayCombinator', () => {

  it('without name', () => {
    const type = ast.arrayCombinator(ast.stringType)
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.array(t.string)`)
  })

  it('with name', () => {
    const type = ast.arrayCombinator(ast.stringType, 'Foo')
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.array(t.string, 'Foo')`)
  })

})
