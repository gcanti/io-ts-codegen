import * as assert from 'assert'
import * as ast from '../src/runtime/ast'
import * as gen from '../src/runtime/gen'

describe('IntersectionCombinator', () => {

  it('without name', () => {
    const type = ast.intersectionCombinator([ast.stringType, ast.numberType])
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.intersection([
  t.string,
  t.number
])`)
  })

  it('with name', () => {
    const type = ast.intersectionCombinator([ast.stringType, ast.numberType], 'Foo')
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.intersection([
  t.string,
  t.number
], 'Foo')`)
  })

  it('nested', () => {
    const type = ast.intersectionCombinator([
      ast.stringType,
      ast.numberType
    ])
    const person = ast.interfaceCombinator([
      ast.prop('foo', type)
    ])
    const out = gen.print(person, 0)
    assert.strictEqual(out, `t.interface({
  foo: t.intersection([
    t.string,
    t.number
  ])
})`)
  })

})
