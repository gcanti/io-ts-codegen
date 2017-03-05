import * as assert from 'assert'
import * as ast from '../src/runtime/ast'
import * as gen from '../src/runtime/gen'

describe('ReadonlyCombinator', () => {

  const person = ast.interfaceCombinator([
    ast.prop('name', ast.stringType),
    ast.prop('age', ast.numberType)
  ])

  it('without name', () => {
    const type = ast.readonlyCombinator(person)
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.readonly(t.interface({
  name: t.string,
  age: t.number
}))`)
  })

  it('with name', () => {
    const type = ast.readonlyCombinator(person, 'Foo')
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.readonly(t.interface({
  name: t.string,
  age: t.number
}), 'Foo')`)
  })

})
