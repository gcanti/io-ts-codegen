import * as assert from 'assert'
import * as ast from '../src/static/ast'
import * as gen from '../src/static/gen'

describe('TypeAliasDeclaration', () => {

  it('should print a type alias declaration', () => {
    const type = ast.typeLiteral([
      ast.propertySignature(ast.identifier('foo'), ast.stringKeyword)
    ])
    const declaration = ast.typeAliasDeclaration(ast.identifier('Foo'), type)
    const out = gen.printTypeAliasDeclaration(declaration)
    assert.strictEqual(out, `type Foo = {
  foo: string
}`)
  })

})
