import * as assert from 'assert'
import * as t from '../src'

describe('printStatic', () => {
  describe('taggedUnion', () => {
    it('should print a union', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.taggedUnionCombinator('type', [
          t.interfaceCombinator([t.property('type', t.literalCombinator('A'))]),
          t.interfaceCombinator([t.property('type', t.literalCombinator('B'))])
        ])
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `type Foo = ` +
          `
  | {
  type: 'A'
}
  | {
  type: 'B'
}`
      )
    })
  })

  describe('recursive', () => {
    it('should handle indentifiers', () => {
      const declaration = t.getRecursiveTypeDeclaration(
        t.typeDeclaration(
          'BExpr',
          t.taggedUnionCombinator('t', [t.identifier('Lit_bV'), t.identifier('NotV'), t.identifier('AndV')])
        )
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `type BExpr = ` +
          `
  | Lit_bV
  | NotV
  | AndV`
      )
    })
  })

  describe('interface', () => {
    it('should handle required properties', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.interfaceCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)])
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `interface Foo {
  foo: string,
  bar: number
}`
      )
    })

    it('should handle optional props', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.interfaceCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType, true)])
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `interface Foo {
  foo: string,
  bar?: number
}`
      )
    })

    it('nested', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.interfaceCombinator([
          t.property('foo', t.stringType),
          t.property('bar', t.interfaceCombinator([t.property('baz', t.numberType)]))
        ])
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `interface Foo {
  foo: string,
  bar: {
    baz: number
  }
}`
      )
    })

    it('should escape properties', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.interfaceCombinator([
          t.property('foo bar', t.stringType),
          t.property('image/jpeg', t.stringType),
          t.property('foo[bar]', t.stringType)
        ])
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `interface Foo {
  'foo bar': string,
  'image/jpeg': string,
  'foo[bar]': string
}`
      )
    })

    it('exported', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.interfaceCombinator([t.property('foo', t.stringType)], 'Foo'),
        true
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `export interface Foo {
  foo: string
}`
      )
    })
  })

  it('partial', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.partialCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType, true)])
    )
    assert.strictEqual(
      t.printStatic(declaration),
      `interface Foo {
  foo?: string,
  bar?: number
}`
    )
  })

  it('dictionary', () => {
    const declaration = t.typeDeclaration('Foo', t.dictionaryCombinator(t.stringType, t.numberType))
    assert.strictEqual(t.printStatic(declaration), `type Foo = { [key in string]: number }`)
  })

  it('readonly interface', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.interfaceCombinator([t.property('foo', t.stringType)], 'Foo'),
      true,
      true
    )
    assert.strictEqual(
      t.printStatic(declaration),
      `export type Foo = Readonly<{
  foo: string
}>`
    )
  })

  it('readonly array', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.interfaceCombinator([t.property('foo', t.readonlyArrayCombinator(t.stringType))], 'Foo'),
      true,
      false
    )
    assert.strictEqual(
      t.printStatic(declaration),
      `export interface Foo {
  foo: ReadonlyArray<string>
}`
    )
  })

  it('StringType', () => {
    const declaration = t.typeDeclaration('Foo', t.stringType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = string`)
  })

  it('NumberType', () => {
    const declaration = t.typeDeclaration('Foo', t.numberType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = number`)
  })

  it('BooleanType', () => {
    const declaration = t.typeDeclaration('Foo', t.booleanType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = boolean`)
  })

  it('NullType', () => {
    const declaration = t.typeDeclaration('Foo', t.nullType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = null`)
  })

  it('UndefinedType', () => {
    const declaration = t.typeDeclaration('Foo', t.undefinedType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = undefined`)
  })

  it('IntegerType', () => {
    const declaration = t.typeDeclaration('Foo', t.integerType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = number`)
  })

  it('UnknownArrayType', () => {
    const declaration = t.typeDeclaration('Foo', t.unknownArrayType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = Array<unknown>`)
  })

  it('UnknownRecordType', () => {
    const declaration = t.typeDeclaration('Foo', t.unknownRecordType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = Record<string, unknown>`)
  })

  it('FunctionType', () => {
    const declaration = t.typeDeclaration('Foo', t.functionType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = Function`)
  })

  it('exact', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.exactCombinator(t.interfaceCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)]))
    )
    assert.strictEqual(
      t.printStatic(declaration),
      `interface Foo {
  foo: string,
  bar: number
}`
    )
  })

  describe('aliasPattern', () => {
    it('should not export the type when isExport = false', () => {
      const declaration = t.aliasPattern('Foo', t.interfaceCombinator([t.property('name', t.stringType)]))
      assert.strictEqual(
        t.printStatic(declaration),
        `interface Foo {
  name: string
}
interface FooOutput extends t.OutputOf<typeof _Foo> {}
interface FooProps extends t.PropsOf<typeof _Foo> {}`
      )
    })

    it('should export the type when isExport = true', () => {
      const declaration = t.aliasPattern('Foo', t.interfaceCombinator([t.property('name', t.stringType)]), true)
      assert.strictEqual(
        t.printStatic(declaration),
        `export interface Foo {
  name: string
}
interface FooOutput extends t.OutputOf<typeof _Foo> {}
interface FooProps extends t.PropsOf<typeof _Foo> {}`
      )
    })
  })

  it('UnknownType', () => {
    const declaration = t.typeDeclaration('Foo', t.unknownType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = unknown`)
  })
})
