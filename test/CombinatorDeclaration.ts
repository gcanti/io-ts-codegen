import * as assert from 'assert'
import * as ast from '../src/runtime/ast'
import * as gen from '../src/runtime/gen'

describe('CombinatorDeclaration', () => {

  it('interface', () => {
    const declaration = ast.combinatorDeclaration('Person', ast.interfaceCombinator([
      ast.prop('name', ast.stringType),
      ast.prop('age', ast.numberType)
    ]))
    const out = gen.printCombinatorDeclaration(declaration)
    assert.strictEqual(out, `const Person = t.interface({
  name: t.string,
  age: t.number
})`)
  })

})
