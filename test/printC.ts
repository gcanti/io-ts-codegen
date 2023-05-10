import * as assert from 'assert'
import * as t from '../src'

describe('printC', () => {
  it('literalCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.literalCombinator(1))
    assert.strictEqual(t.printC(declaration), `type FooC = t.LiteralC<1>`)
  })

  it('intersectionCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.intersectionCombinator([t.stringType, t.numberType]))
    assert.strictEqual(
      t.printC(declaration),
      `type FooC = t.IntersectionC<[
  t.StringC,
  t.NumberC
]>`
    )
  })

  it('keyofCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.keyofCombinator(['a', 'b']))
    assert.strictEqual(
      t.printC(declaration),
      `type FooC = t.UnionC<[
  t.LiteralC<'a'>,
  t.LiteralC<'b'>
]>`
    )
  })

  it('tupleCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.tupleCombinator([t.stringType, t.numberType]))
    assert.strictEqual(
      t.printC(declaration),
      `type FooC = t.TupleC<[
  t.StringC,
  t.NumberC
]>`
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
        t.printC(declaration),
        `type FooC = t.UnionC<[
  t.TypeC<{
  type: t.LiteralC<'A'>
}>,
  t.TypeC<{
  type: t.LiteralC<'B'>
}>
]>`
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
        t.printC(declaration),
        `type BExprC = t.UnionC<[
  Lit_bVC,
  NotVC,
  AndVC
]>`
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
        t.printC(declaration),
        `type FooC = t.TypeC<{
  /** description */
  a: t.StringC
}>`
      )
    })

    it('should handle required properties', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)])
      )
      assert.strictEqual(
        t.printC(declaration),
        `type FooC = t.TypeC<{
  foo: t.StringC,
  bar: t.NumberC
}>`
      )
    })

    it('should handle optional properties', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType, true)])
      )
      assert.strictEqual(
        t.printC(declaration),
        `type FooC = t.TypeC<{
  foo: t.StringC,
  bar?: t.NumberC
}>`
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
        t.printC(declaration),
        `type FooC = t.TypeC<{
  foo: t.StringC,
  bar: t.TypeC<{
    baz: t.NumberC
  }>
}>`
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
        t.printC(declaration),
        `type FooC = t.TypeC<{
  'foo bar': t.StringC,
  'image/jpeg': t.StringC,
  'foo[bar]': t.StringC
}>`
      )
    })
  })

  describe('typeDeclaration', () => {
    it('should handle the isExported argument', () => {
      const declaration = t.typeDeclaration('Foo', t.typeCombinator([t.property('foo', t.stringType)], 'FooC'), true)
      assert.strictEqual(
        t.printC(declaration),
        `export type FooC = t.TypeC<{
  foo: t.StringC
}>`
      )
    })

    it('should handle the isReadonly argument', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([t.property('foo', t.stringType)], 'FooC'),
        true,
        true
      )
      assert.strictEqual(
        t.printC(declaration),
        `export type FooC = t.ReadonlyC<t.TypeC<{
  foo: t.StringC
}>>`
      )
    })

    it('should handle the description argument', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([t.property('foo', t.stringType)], 'FooC'),
        true,
        true,
        'bar'
      )
      assert.strictEqual(
        t.printC(declaration),
        `/** bar */
export type FooC = t.ReadonlyC<t.TypeC<{
  foo: t.StringC
}>>`
      )
    })
  })

  it('partialCombinator', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.partialCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType, true)])
    )
    assert.strictEqual(
      t.printC(declaration),
      `type FooC = t.PartialC<{
  foo: t.StringC,
  bar: t.NumberC
}>`
    )
  })

  it('recordCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.recordCombinator(t.stringType, t.numberType))
    assert.strictEqual(t.printC(declaration), `type FooC = t.RecordC<t.StringC, t.NumberC>`)
  })

  it('arrayCombinator', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.typeCombinator([t.property('foo', t.arrayCombinator(t.stringType))], 'FooC'),
      true,
      false
    )
    assert.strictEqual(
      t.printC(declaration),
      `export type FooC = t.TypeC<{
  foo: t.ArrayC<t.StringC>
}>`
    )
  })

  it('readonlyArrayCombinator', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.typeCombinator([t.property('foo', t.readonlyArrayCombinator(t.stringType))], 'FooC'),
      true,
      false
    )
    assert.strictEqual(
      t.printC(declaration),
      `export type FooC = t.TypeC<{
  foo: t.ReadonlyArrayC<t.StringC>
}>`
    )
  })

  it('StringType', () => {
    const declaration = t.typeDeclaration('Foo', t.stringType)
    assert.strictEqual(t.printC(declaration), `type FooC = t.StringC`)
  })

  it('NumberType', () => {
    const declaration = t.typeDeclaration('Foo', t.numberType)
    assert.strictEqual(t.printC(declaration), `type FooC = t.NumberC`)
  })

  it('BooleanType', () => {
    const declaration = t.typeDeclaration('Foo', t.booleanType)
    assert.strictEqual(t.printC(declaration), `type FooC = t.BooleanC`)
  })

  it('NullType', () => {
    const declaration = t.typeDeclaration('Foo', t.nullType)
    assert.strictEqual(t.printC(declaration), `type FooC = t.NullC`)
  })

  it('UndefinedType', () => {
    const declaration = t.typeDeclaration('Foo', t.undefinedType)
    assert.strictEqual(t.printC(declaration), `type FooC = t.UndefinedC`)
  })

  it('IntegerType', () => {
    // tslint:disable-next-line: deprecation
    const declaration = t.typeDeclaration('Foo', t.integerType)
    assert.strictEqual(t.printC(declaration), `type FooC = t.NumberC`)
  })

  it('UnknownArrayType', () => {
    const declaration = t.typeDeclaration('Foo', t.unknownArrayType)
    assert.strictEqual(t.printC(declaration), `type FooC = t.UnknownArrayC`)
  })

  it('UnknownRecordType', () => {
    const declaration = t.typeDeclaration('Foo', t.unknownRecordType)
    assert.strictEqual(t.printC(declaration), `type FooC = t.UnknownRecordC`)
  })

  it('FunctionType', () => {
    const declaration = t.typeDeclaration('Foo', t.functionType)
    assert.strictEqual(t.printC(declaration), `type FooC = t.FunctionC`)
  })

  it('exactCombinator', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.exactCombinator(t.typeCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)]))
    )
    assert.strictEqual(
      t.printC(declaration),
      `type FooC = t.TypeC<{
  foo: t.StringC,
  bar: t.NumberC
}>`
    )
  })

  it('UnknownType', () => {
    const declaration = t.typeDeclaration('Foo', t.unknownType)
    assert.strictEqual(t.printC(declaration), `type FooC = t.UnknownC`)
  })

  it('strictCombinator', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.strictCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)])
    )
    assert.strictEqual(
      t.printC(declaration),
      `type FooC = t.TypeC<{
  foo: t.StringC,
  bar: t.NumberC
}>`
    )
  })

  it('readonlyCombinator', () => {
    const D1 = t.typeDeclaration(
      'Foo',
      t.readonlyCombinator(t.typeCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)]))
    )
    assert.strictEqual(
      t.printC(D1),
      `type FooC = t.ReadonlyC<t.TypeC<{
  foo: t.StringC,
  bar: t.NumberC
}>>`
    )
  })

  it('IntType', () => {
    const declaration = t.typeDeclaration('Foo', t.intType)
    assert.strictEqual(t.printC(declaration), `type FooC = t.BrandC<t.NumberC, t.IntBrand>`)
  })

  it('brandCombinator', () => {
    const D1 = t.typeDeclaration('Foo', t.brandCombinator(t.numberType, x => `${x} >= 0`, 'Positive'))
    assert.strictEqual(t.printC(D1), `type FooC = t.BrandC<t.NumberC, PositiveBrand>`)
  })
})
