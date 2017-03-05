import * as assert from 'assert'
import * as ast from '../src/static/ast'
import * as gen from '../src/static/gen'

describe('InterfaceDeclaration', () => {

  it('should print an interface declaration', () => {
    const declaration = ast.interfaceDeclaration(ast.identifier('Person'), [
      ast.propertySignature(ast.identifier('name'), ast.stringKeyword),
      ast.propertySignature(ast.identifier('age'), ast.numberKeyword)
    ])
    const out = gen.printInterfaceDeclaration(declaration)
    assert.strictEqual(out, `interface Person {
  name: string,
  age: number
}`)
  })

  it('nested', () => {
    const declaration = ast.interfaceDeclaration(ast.identifier('Foo'), [
      ast.propertySignature(ast.identifier('foo'), ast.typeLiteral([
        ast.propertySignature(ast.identifier('bar'), ast.stringKeyword)
      ]))
    ])
    const out = gen.printInterfaceDeclaration(declaration)
    assert.strictEqual(out, `interface Foo {
  foo: {
    bar: string
  }
}`)
  })

  it('with description', () => {
    const declaration = ast.interfaceDeclaration(ast.identifier('Foo'), [
      ast.propertySignature(ast.identifier('foo'), ast.stringKeyword, undefined, [ast.multiLineCommentTrivia('/** foo description */', true)])
    ])
    const out = gen.printInterfaceDeclaration(declaration)
    assert.strictEqual(out, `interface Foo {
  /** foo description */
  foo: string
}`)
  })

})
