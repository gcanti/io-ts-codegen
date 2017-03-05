import * as assert from 'assert'
import * as ast from '../src/runtime/ast'
import * as gen from '../src/runtime/gen'

describe('RecursionCombinator', () => {

  it('with name', () => {
    const type = ast.recursionCombinator('FooT', 'Foo', ast.interfaceCombinator([
      ast.prop('foo', ast.stringType)
    ]))
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.recursion<FooT>('Foo', (Foo: t.Any) => t.interface({
  foo: t.string
}))`)
  })

})
