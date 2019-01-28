import * as assert from 'assert'
import { printStatic, printRuntime } from '../src'
import { to, JSONSchema } from '../examples/json-schema'

describe('json-schema', () => {
  it('string', () => {
    assert.strictEqual(
      printStatic(
        to({
          type: 'string'
        })
      ),
      `string`
    )
  })

  it('enum', () => {
    assert.strictEqual(
      printStatic(
        to({
          type: 'string',
          enum: ['a', 'b']
        })
      ),
      `
  | 'a'
  | 'b'`
    )
  })

  it('number', () => {
    assert.strictEqual(
      printStatic(
        to({
          type: 'number'
        })
      ),
      `number`
    )
  })

  it('boolean', () => {
    assert.strictEqual(
      printStatic(
        to({
          type: 'boolean'
        })
      ),
      `boolean`
    )
  })

  it('object', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {
        foo: {
          type: 'string'
        }
      },
      required: ['foo']
    }
    assert.strictEqual(
      printStatic(to(schema)),
      `{
  foo: string
}`
    )

    assert.strictEqual(
      printRuntime(to(schema)),
      `t.type({
  foo: t.string
})`
    )
  })
})
