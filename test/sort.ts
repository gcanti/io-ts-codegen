import * as assert from 'assert'
import * as t from '../src'

describe('sort', () => {
  it('should handle custom type declarations', () => {
    const declarations = [
      t.typeDeclaration('Person', t.typeCombinator([t.property('id', t.identifier('UserId'))]), true),
      t.customTypeDeclaration(
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

export interface Person {
  id: UserId
}`
    )

    assert.strictEqual(
      tds.map(td => t.printRuntime(td)).join('\n\n'),
      `export const UserId = fromNewtype<UserId>(t.string)
export const userIdIso = iso<UserId>()

export const Person = t.type({
  id: UserId
})`
    )
  })

  it('should handle dependencies in custom type declarations', () => {
    const declarations = [
      t.typeDeclaration('Persons', t.arrayCombinator(t.identifier('Person')), true),
      t.typeDeclaration('RawPerson', t.typeCombinator([t.property('id', t.stringType)]), true),
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
      `export const RawPerson = t.type({
  id: t.string
})

export const Person = fromNewtype<Person>(RawPerson)
export const personIso = iso<Person>()

export const Persons = t.array(Person)`
    )
  })

  it('real world test case', () => {
    const declarations: (t.TypeDeclaration | t.CustomTypeDeclaration)[] = [
      {
        kind: 'TypeDeclaration',
        name: 'NotificationPayload',
        type: {
          kind: 'InterfaceCombinator',
          properties: [
            {
              kind: 'Property',
              key: 'userLanguage',
              type: {
                kind: 'StringType',
                name: 'string'
              },
              isOptional: true
            },
            {
              kind: 'Property',
              key: 'notificationKind',
              type: {
                kind: 'Identifier',
                name: 'NotificationKind'
              },
              isOptional: false
            },
            {
              kind: 'Property',
              key: 'params',
              type: {
                kind: 'DictionaryCombinator',
                domain: {
                  kind: 'StringType',
                  name: 'string'
                },
                codomain: {
                  kind: 'NumberType',
                  name: 'number'
                }
              },
              isOptional: false
            },
            {
              kind: 'Property',
              key: 'workcellSerialNumber',
              type: {
                kind: 'StringType',
                name: 'string'
              },
              isOptional: false
            },
            {
              kind: 'Property',
              key: 'workcellType',
              type: {
                kind: 'Identifier',
                name: 'InstrumentType'
              },
              isOptional: false
            }
          ],
          name: 'NotificationPayload'
        },
        isExported: true,
        isReadonly: false
      }
    ]
    const tds = t.sort(declarations)
    assert.strictEqual(
      tds.map(td => t.printStatic(td)).join('\n'),
      `export interface NotificationPayload {
  userLanguage?: string,
  notificationKind: NotificationKind,
  params: Record<string, number>,
  workcellSerialNumber: string,
  workcellType: InstrumentType
}`
    )
  })

  it('should handle recursive declarations', () => {
    const declarations: Array<t.TypeDeclaration> = [
      t.typeDeclaration('A', t.typeCombinator([t.property('b', t.identifier('B'))])),
      t.typeDeclaration('B', t.typeCombinator([t.property('a', t.identifier('A'))]))
    ]
    const tds = t.sort(declarations)
    assert.strictEqual(
      tds.map(td => t.printStatic(td)).join('\n'),
      `interface B {
  a: A
}
interface A {
  b: B
}`
    )
    assert.strictEqual(
      tds.map(td => t.printRuntime(td)).join('\n'),
      `const B: t.RecursiveType<t.Type<B>> = t.recursion('B', () => t.type({
  a: A
}))
const A: t.RecursiveType<t.Type<A>> = t.recursion('A', () => t.type({
  b: B
}))`
    )
  })

  it('recursive types should be emitted before normal types', () => {
    const declarations: Array<t.TypeDeclaration> = [
      t.typeDeclaration('A', t.typeCombinator([t.property('expr', t.identifier('Expr'))])),
      t.typeDeclaration(
        'Expr',
        t.recursiveCombinator(
          t.identifier('Expr'),
          'Expr',
          t.typeCombinator([t.property('expr', t.identifier('Expr'))])
        )
      )
    ]
    const tds = t.sort(declarations)
    assert.strictEqual(
      tds.map(td => t.printStatic(td)).join('\n'),
      `interface Expr {
  expr: Expr
}
interface A {
  expr: Expr
}`
    )
    assert.strictEqual(
      tds.map(td => t.printRuntime(td)).join('\n'),
      `const Expr: t.RecursiveType<t.Type<Expr>> = t.recursion('Expr', () => t.recursion('Expr', () => t.type({
  expr: Expr
})))
const A = t.type({
  expr: Expr
})`
    )
  })
})
