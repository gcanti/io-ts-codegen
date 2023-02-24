import * as assert from 'assert'
import * as t from '../src'

describe('printStatic', () => {
  it('literalCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.literalCombinator(1))
    assert.strictEqual(t.printStatic(declaration), `type Foo = 1`)
  })

  it('intersectionCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.intersectionCombinator([t.stringType, t.numberType]))
    assert.strictEqual(
      t.printStatic(declaration),
      `type Foo =
  (
  & string
  & number
  )`
    )
  })

  it('keyofCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.keyofCombinator(['a', 'b']))
    assert.strictEqual(
      t.printStatic(declaration),
      `type Foo =
  (
  | 'a'
  | 'b'
  )`
    )
  })

  it('tupleCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.tupleCombinator([t.stringType, t.numberType]))
    assert.strictEqual(
      t.printStatic(declaration),
      `type Foo = [
  string,
  number
]`
    )
  })

  describe('taggedUnionCombinator', () => {
    it('should print a union', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.taggedUnionCombinator('type', [
          t.typeCombinator([t.property('type', t.literalCombinator('A'))]),
          t.typeCombinator([t.property('type', t.literalCombinator('B'))])
        ])
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `type Foo =
  (
  | {
  type: 'A'
}
  | {
  type: 'B'
}
  )`
      )
    })
  })

  describe('getRecursiveTypeDeclaration', () => {
    it('should handle indentifiers', () => {
      const declaration = t.getRecursiveTypeDeclaration(
        t.typeDeclaration(
          'BExpr',
          t.taggedUnionCombinator('t', [t.identifier('Lit_bV'), t.identifier('NotV'), t.identifier('AndV')])
        )
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `type BExpr =
  (
  | t.TypeOf<typeof Lit_bV>
  | t.TypeOf<typeof NotV>
  | t.TypeOf<typeof AndV>
  )
type BExprOutput =
  (
  | t.OutputOf<typeof Lit_bV>
  | t.OutputOf<typeof NotV>
  | t.OutputOf<typeof AndV>
  )`
      )
    })
  })

  describe('typeCombinator', () => {
    it('should handle field descriptions', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([t.property('a', t.stringType, false, 'description')])
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `interface Foo {
  /** description */
  a: string
}`
      )
    })

    it('should handle required properties', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)])
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `interface Foo {
  foo: string,
  bar: number
}`
      )
    })

    it('should handle optional properties', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType, true)])
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `interface Foo {
  foo: string,
  bar?: number
}`
      )
    })

    it('should handle nested types', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([
          t.property('foo', t.stringType),
          t.property('bar', t.typeCombinator([t.property('baz', t.numberType)]))
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
        t.typeCombinator([
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
  })

  describe('forceTypeCombinator', () => {
    it('should force type for typeCombinator', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.forceTypeCombinator(t.typeCombinator([t.property('foo bar', t.stringType)]))
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `type Foo = {
  'foo bar': string
}`
      )
    })

    it('should force type for strictCombinator', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.forceTypeCombinator(t.strictCombinator([t.property('foo bar', t.stringType)]))
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `type Foo = {
  'foo bar': string
}`
      )
    })

    it('should force type for partialCombinator', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.forceTypeCombinator(t.partialCombinator([t.property('foo bar', t.stringType)]))
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `type Foo = {
  'foo bar'?: string
}`
      )
    })
  })

  describe('typeDeclaration', () => {
    it('should handle the isExported argument', () => {
      const declaration = t.typeDeclaration('Foo', t.typeCombinator([t.property('foo', t.stringType)], 'Foo'), true)
      assert.strictEqual(
        t.printStatic(declaration),
        `export interface Foo {
  foo: string
}`
      )
    })

    it('should handle the isReadonly argument', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([t.property('foo', t.stringType)], 'Foo'),
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

    it('should handle the description argument', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([t.property('foo', t.stringType)], 'Foo'),
        true,
        true,
        'bar'
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `/** bar */
export type Foo = Readonly<{
  foo: string
}>`
      )
    })
  })

  it('partialCombinator', () => {
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

  it('recordCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.recordCombinator(t.stringType, t.numberType))
    assert.strictEqual(t.printStatic(declaration), `type Foo = Record<string, number>`)
  })

  it('readonlyArrayCombinator', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.typeCombinator([t.property('foo', t.readonlyArrayCombinator(t.stringType))], 'Foo'),
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
    // tslint:disable-next-line: deprecation
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

  it('exactCombinator', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.exactCombinator(t.typeCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)]))
    )
    assert.strictEqual(
      t.printStatic(declaration),
      `interface Foo {
  foo: string,
  bar: number
}`
    )
  })

  it('UnknownType', () => {
    const declaration = t.typeDeclaration('Foo', t.unknownType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = unknown`)
  })

  it('strictCombinator', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.strictCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)])
    )
    assert.strictEqual(
      t.printStatic(declaration),
      `interface Foo {
  foo: string,
  bar: number
}`
    )
  })

  it('readonlyCombinator', () => {
    const D1 = t.typeDeclaration(
      'Foo',
      t.readonlyCombinator(t.typeCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)]))
    )
    assert.strictEqual(
      t.printStatic(D1),
      `type Foo = Readonly<{
  foo: string,
  bar: number
}>`
    )
  })

  it('IntType', () => {
    const declaration = t.typeDeclaration('Foo', t.intType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = t.Int`)
  })

  it('brandCombinator', () => {
    const D1 = t.typeDeclaration('Foo', t.brandCombinator(t.numberType, x => `${x} >= 0`, 'Positive'))
    assert.strictEqual(t.printStatic(D1), `type Foo = t.Branded<number, PositiveBrand>`)
  })
})
