import * as assert from 'assert'
import * as ast from '../src/static/ast'
import * as gen from '../src/static/gen'

describe('TypeReference', () => {

  it('Array', () => {
    const type = ast.typeReference(ast.identifier('Array'), [
      ast.stringKeyword
    ])
    const out = gen.print(type, 0)
    assert.strictEqual(out, `Array<string>`)
  })

})
