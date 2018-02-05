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
        t.interfaceCombinator([t.property('foo bar', t.stringType), t.property('image/jpeg', t.stringType)])
      )
      assert.strictEqual(
        t.printStatic(declaration),
        `interface Foo {
  'foo bar': string,
  'image/jpeg': string
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

  it('strict', () => {
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

  it('integer', () => {
    const declaration = t.typeDeclaration('Foo', t.integerType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = number`)
  })

  it('any', () => {
    const declaration = t.typeDeclaration('Foo', t.anyType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = any`)
  })

  it('dictionary', () => {
    const declaration = t.typeDeclaration('Foo', t.dictionaryCombinator(t.stringType, t.numberType))
    assert.strictEqual(t.printStatic(declaration), `type Foo = { [key: string]: number }`)
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
})
