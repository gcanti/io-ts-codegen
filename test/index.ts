import * as assert from 'assert'
import * as t from '../src'

describe('printRuntime', () => {
  describe('interface', () => {
    it('should handle required props', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.interfaceCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)])
      )
      assert.strictEqual(
        t.printRuntime(declaration),
        `const Foo = t.interface({
  foo: t.string,
  bar: t.number
})`
      )
    })

    it('should handle optional props', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.interfaceCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType, true)])
      )
      assert.strictEqual(
        t.printRuntime(declaration),
        `const Foo = t.interface({
  foo: t.string,
  bar: t.union([
    t.number,
    t.undefined
  ])
})`
      )
    })

    it('should not add useless `undefinedType`s', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.interfaceCombinator([
          t.property('foo', t.stringType),
          t.property('bar', t.unionCombinator([t.numberType, t.undefinedType]), true)
        ])
      )
      assert.strictEqual(
        t.printRuntime(declaration),
        `const Foo = t.interface({
  foo: t.string,
  bar: t.union([
    t.number,
    t.undefined
  ])
})`
      )
    })
  })

  it('runtime partial', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.partialCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType, true)])
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Foo = t.partial({
  foo: t.string,
  bar: t.number
})`
    )
  })

  it('runtime strict', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.strictCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)])
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Foo = t.strict({
  foo: t.string,
  bar: t.number
})`
    )
  })

  it('runtime integer', () => {
    const declaration = t.typeDeclaration('Foo', t.integerType)
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.Integer`)
  })

  it('runtime any', () => {
    const declaration = t.typeDeclaration('Foo', t.anyType)
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.any`)
  })

  it('runtime dictionary', () => {
    const declaration = t.typeDeclaration('Foo', t.dictionaryCombinator(t.stringType, t.numberType))
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.dictionary(t.string, t.number)`)
  })

  it('runtime nested interface', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.interfaceCombinator([
        t.property('foo', t.stringType),
        t.property('bar', t.interfaceCombinator([t.property('baz', t.numberType)]))
      ])
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Foo = t.interface({
  foo: t.string,
  bar: t.interface({
    baz: t.number
  })
})`
    )
  })

  it('runtime interface with name', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([t.property('foo', t.stringType)], 'Foo'))
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Foo = t.interface({
  foo: t.string
}, 'Foo')`
    )
  })

  it('runtime escape property', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.interfaceCombinator([t.property('foo bar', t.stringType), t.property('image/jpeg', t.stringType)])
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Foo = t.interface({
  'foo bar': t.string,
  'image/jpeg': t.string
})`
    )
  })

  it('runtime exported interface', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([t.property('foo', t.stringType)], 'Foo'), true)
    assert.strictEqual(
      t.printRuntime(declaration),
      `export const Foo = t.interface({
  foo: t.string
}, 'Foo')`
    )
  })

  it('runtime readonly interface', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.interfaceCombinator([t.property('foo', t.stringType)], 'Foo'),
      true,
      true
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `export const Foo = t.readonly(t.interface({
  foo: t.string
}, 'Foo'))`
    )
  })

  it('runtime recursive', () => {
    const declaration = t.typeDeclaration(
      'Category',
      t.recursiveCombinator(
        t.identifier('CategoryT'),
        'Category',
        t.interfaceCombinator([
          t.property('name', t.stringType),
          t.property('categories', t.arrayCombinator(t.identifier('Category')))
        ])
      )
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Category = t.recursive<CategoryT>('Category', (Category: t.Any) => t.interface({
  name: t.string,
  categories: t.array(Category)
})`
    )
  })

  it('runtime readonly array', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.interfaceCombinator([t.property('foo', t.readonlyArrayCombinator(t.stringType))], 'Foo'),
      true,
      true
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `export const Foo = t.readonly(t.interface({
  foo: t.readonlyArray(t.string)
}, 'Foo'))`
    )
  })
})

describe('printStatic', () => {
  it('static interface', () => {
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

  it('static partial', () => {
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

  it('static strict', () => {
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

  it('static integer', () => {
    const declaration = t.typeDeclaration('Foo', t.integerType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = number`)
  })

  it('static any', () => {
    const declaration = t.typeDeclaration('Foo', t.anyType)
    assert.strictEqual(t.printStatic(declaration), `type Foo = any`)
  })

  it('static dictionary', () => {
    const declaration = t.typeDeclaration('Foo', t.dictionaryCombinator(t.stringType, t.numberType))
    assert.strictEqual(t.printStatic(declaration), `type Foo = { [key: string]: number }`)
  })

  it('runtime nested interface', () => {
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

  it('static escape property', () => {
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

  it('static exported interface', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([t.property('foo', t.stringType)], 'Foo'), true)
    assert.strictEqual(
      t.printStatic(declaration),
      `export interface Foo {
  foo: string
}`
    )
  })

  it('static readonly interface', () => {
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

  it('static readonly array', () => {
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
