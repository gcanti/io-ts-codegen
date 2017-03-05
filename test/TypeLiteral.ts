import * as assert from 'assert'
import * as ast from '../src/static/ast'
import * as gen from '../src/static/gen'

describe('TypeLiteral', () => {

  it('keyword', () => {
    const type = ast.typeLiteral([
      ast.propertySignature(ast.identifier('foo'), ast.stringKeyword)
    ])
    const out = gen.print(type, 0)
    assert.strictEqual(out, `{
  foo: string
}`)
  })

  it('nested', () => {
    const type = ast.typeLiteral([
      ast.propertySignature(ast.identifier('foo'), ast.typeLiteral([
        ast.propertySignature(ast.identifier('bar'), ast.stringKeyword)
      ]))
    ])
    const out = gen.print(type, 0)
    assert.strictEqual(out, `{
  foo: {
    bar: string
  }
}`)
  })

})
