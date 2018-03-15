import * as assert from 'assert'
import * as t from '../src'

describe('sort', () => {
  it('should handle custom type declarations', () => {
    const declarations = [
      t.typeDeclaration('Person', t.interfaceCombinator([t.property('id', t.identifier('UserId'))]), true),
      t.customTypeDeclaration(
        'UserId',
        `export interface UserId extends Newtype<'UserId', string> {}`,
        `export const UserId = fromNewtype<UserId>(t.string)
export const userIdIso = iso<UserId>()`,
        []
      )
    ]
    const tds = t.sort(declarations)
    assert.strictEqual(
      tds.map(td => t.printStatic(td)).join('\n\n'),
      `export interface UserId extends Newtype<'UserId', string> {}

export interface Person {
  id: UserId
}`
    )

    assert.strictEqual(
      tds.map(td => t.printRuntime(td)).join('\n\n'),
      `export const UserId = fromNewtype<UserId>(t.string)
export const userIdIso = iso<UserId>()

export const Person = t.interface({
  id: UserId
})`
    )
  })

  it('should handle dependencies in custom type declarations', () => {
    const declarations = [
      t.typeDeclaration('Persons', t.arrayCombinator(t.identifier('Person')), true),
      t.typeDeclaration('RawPerson', t.interfaceCombinator([t.property('id', t.stringType)]), true),
      t.customTypeDeclaration(
        'Person',
        `export interface Person extends Newtype<'Person', RawPerson> {}`,
        `export const Person = fromNewtype<Person>(RawPerson)
export const personIso = iso<Person>()`,
        ['RawPerson']
      )
    ]
    const tds = t.sort(declarations)
    assert.strictEqual(
      tds.map(td => t.printStatic(td)).join('\n\n'),
      `export interface RawPerson {
  id: string
}

export interface Person extends Newtype<'Person', RawPerson> {}

export type Persons = Array<Person>`
    )

    assert.strictEqual(
      tds.map(td => t.printRuntime(td)).join('\n\n'),
      `export const RawPerson = t.interface({
  id: t.string
})

export const Person = fromNewtype<Person>(RawPerson)
export const personIso = iso<Person>()

export const Persons = t.array(Person)`
    )
  })
})
