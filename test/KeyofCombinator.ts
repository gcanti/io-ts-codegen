import * as assert from 'assert'
import * as ast from '../src/runtime/ast'
import * as gen from '../src/runtime/gen'

describe('KeyofCombinator', () => {

  it('without name', () => {
    const type = ast.keyofCombinator(['foo', 'bar'])
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.keyof({
  foo: true,
  bar: true
})`)
  })

  it('with name', () => {
    const type = ast.keyofCombinator(['foo', 'bar'], 'Foo')
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.keyof({
  foo: true,
  bar: true
}, 'Foo')`)
  })

  it('escape', () => {
    const type = ast.keyofCombinator(['foo-a', 'bar baz'])
    const out = gen.print(type, 0)
    assert.strictEqual(out, `t.keyof({
  'foo-a': true,
  'bar baz': true
})`)
  })

})
