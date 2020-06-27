import * as assert from 'assert'
import * as t from '../src'

describe('sort', () => {
  it('should handle duplicate declarations', () => {
    const declarations: Array<t.TypeDeclaration> = [
      t.typeDeclaration('A', t.stringType),
      t.typeDeclaration('A', t.numberType)
    ]
    assert.throws(
      () => {
        t.sort(declarations)
      },
      (e: any) => e.message === 'duplicated name: "A"'
    )
  })

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
  id: t.TypeOf<typeof UserId>
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

export type Persons = Array<t.TypeOf<typeof Person>>`
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
  notificationKind: t.TypeOf<typeof NotificationKind>,
  params: Record<string, number>,
  workcellSerialNumber: string,
  workcellType: t.TypeOf<typeof InstrumentType>
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
  a: t.TypeOf<typeof A>
}
interface BOutput {
  a: t.OutputOf<typeof A>
}
interface A {
  b: t.TypeOf<typeof B>
}
interface AOutput {
  b: t.OutputOf<typeof B>
}`
    )
    assert.strictEqual(
      tds.map(td => t.printRuntime(td)).join('\n'),
      `const B: t.Type<B, BOutput> = t.recursion('B', () => t.type({
  a: A
}))
const A: t.Type<A, AOutput> = t.recursion('A', () => t.type({
  b: B
}))`
    )
  })

  it('recursive types should be emitted before normal types', () => {
    const declarations: Array<t.TypeDeclaration> = [
      t.typeDeclaration('A', t.typeCombinator([t.property('expr', t.identifier('Expr'))])),
      t.typeDeclaration(
        'Expr',
        t.typeCombinator([t.property('expr', t.unionCombinator([t.identifier('Expr'), t.undefinedType]))])
      )
    ]
    const tds = t.sort(declarations)
    const actual = tds.map(td => t.printStatic(td)).join('\n') + '\n' + tds.map(td => t.printRuntime(td)).join('\n')
    assert.strictEqual(
      actual,
      `interface Expr {
  expr:
    (
    | Expr
    | undefined
    )
}
interface ExprOutput {
  expr:
    (
    | ExprOutput
    | undefined
    )
}
interface A {
  expr: t.TypeOf<typeof Expr>
}
const Expr: t.Type<Expr, ExprOutput> = t.recursion('Expr', () => t.type({
  expr: t.union([
    Expr,
    t.undefined
  ])
}))
const A = t.type({
  expr: Expr
})`
    )
  })
})
