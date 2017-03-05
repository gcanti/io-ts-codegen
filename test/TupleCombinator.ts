import * as assert from 'assert'
import * as ast from '../src/runtime/ast'
import * as gen from '../src/runtime/gen'

describe('TupleCombinator', () => {

  it('without name', () => {
    const type = ast.tupleCombinator([])
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.tuple([

])`)
  })

  it('with name', () => {
    const type = ast.tupleCombinator([
      ast.stringType,
      ast.numberType
    ], 'Foo')
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.tuple([
  t.string,
  t.number
], 'Foo')`)
  })

  it('nested', () => {
    const type = ast.tupleCombinator([
      ast.stringType,
      ast.numberType
    ])
    const person = ast.interfaceCombinator([
      ast.prop('foo', type)
    ])
    const out = gen.print(person, 0)
    assert.strictEqual(out, `t.interface({
  foo: t.tuple([
    t.string,
    t.number
  ])
})`)
  })

})
