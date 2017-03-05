import * as assert from 'assert'
import * as fs from 'fs'
import * as gen from '../src/metarpheus/gen'

const models = require('./fixtures/source.json').models
const expected = fs.readFileSync(__dirname + '/fixtures/expected.ts', 'utf-8')
const actual = gen.print(models)
// console.log(actual)

function trimRight(s: string): string {
  return s.split('\n').map(s => (s as any).trimRight()).join('\n') + '\n'
}

describe('metarpheus', () => {

  it('should output the model', () => {
    assert.strictEqual(trimRight(actual), expected)
  })

})
