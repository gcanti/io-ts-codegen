import * as assert from 'assert'
import * as ast from '../src/runtime/ast'
import * as gen from '../src/runtime/gen'

describe('InterfaceCombinator', () => {

  it('without name', () => {
    const type = ast.interfaceCombinator([
      ast.prop('name', ast.stringType),
      ast.prop('age', ast.numberType)
    ])
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.interface({
  name: t.string,
  age: t.number
})`)
  })

  it('with name', () => {
    const type = ast.interfaceCombinator([
      ast.prop('name', ast.stringType),
      ast.prop('age', ast.numberType)
    ], 'Foo')
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.interface({
  name: t.string,
  age: t.number
}, 'Foo')`)
  })

  it('with identifier', () => {
    const type = ast.interfaceCombinator([
      ast.prop('foo', ast.identifier('Foo'))
    ])
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.interface({
  foo: Foo
})`)
  })

})
