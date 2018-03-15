import * as assert from 'assert'
import * as t from '../src'

describe('sort', () => {
  it('should handle custom type declarations', () => {
    const declarations = [
      t.typeDeclaration('Person', t.interfaceCombinator([t.property('id', t.identifier('UserId'))])),
      t.cusomtTypeDeclaration(
        'UserId',
        `export interface UserId extends Newtype<'UserId', string> {}`,
        `export const UserId = fromNewtype<UserId>(t.string)
export const userIdIso = iso<UserId>()`
      )
    ]
    const tds = t.sort(declarations)
    assert.strictEqual(
      tds.map(td => t.printStatic(td)).join('\n\n'),
      `export interface UserId extends Newtype<'UserId', string> {}

interface Person {
  id: UserId
}`
    )

    assert.strictEqual(
      tds.map(td => t.printRuntime(td)).join('\n\n'),
      `export const UserId = fromNewtype<UserId>(t.string)
export const userIdIso = iso<UserId>()

const Person = t.interface({
  id: UserId
})`
    )
  })
})
