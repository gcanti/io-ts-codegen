import * as assert from 'assert'
import * as t from '../src'

describe('printRuntime', () => {

  it('runtime interface', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([
      t.property('foo', t.stringType),
      t.property('bar', t.numberType)
    ]))
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.interface({
  foo: t.string,
  bar: t.number
})`)
  })

  it('runtime nested interface', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([
      t.property('foo', t.stringType),
      t.property('bar', t.interfaceCombinator([
        t.property('baz', t.numberType)
      ]))
    ]))
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.interface({
  foo: t.string,
  bar: t.interface({
    baz: t.number
  })
})`)
  })

  it('runtime interface with name', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([
      t.property('foo', t.stringType)
    ], 'Foo'))
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.interface({
  foo: t.string
}, 'Foo')`)
  })

  it('runtime escape property', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([
      t.property('foo bar', t.stringType)
    ]))
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.interface({
  'foo bar': t.string
})`)
  })

  it('runtime exported interface', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([
      t.property('foo', t.stringType)
    ], 'Foo'), true)
    assert.strictEqual(t.printRuntime(declaration), `export const Foo = t.interface({
  foo: t.string
}, 'Foo')`)
  })

  it('runtime readonly interface', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([
      t.property('foo', t.stringType)
    ], 'Foo'), true, true)
    assert.strictEqual(t.printRuntime(declaration), `export const Foo = t.readonly(t.interface({
  foo: t.string
}, 'Foo'))`)
  })

})

describe('printStatic', () => {

  it('static interface', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([
      t.property('foo', t.stringType),
      t.property('bar', t.numberType)
    ]))
    assert.strictEqual(t.printStatic(declaration), `type Foo = {
  foo: string,
  bar: number
}`)
  })

  it('runtime nested interface', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([
      t.property('foo', t.stringType),
      t.property('bar', t.interfaceCombinator([
        t.property('baz', t.numberType)
      ]))
    ]))
    assert.strictEqual(t.printStatic(declaration), `type Foo = {
  foo: string,
  bar: {
    baz: number
  }
}`)
  })

  it('static escape property', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([
      t.property('foo bar', t.stringType)
    ]))
    assert.strictEqual(t.printStatic(declaration), `type Foo = {
  'foo bar': string
}`)
  })

  it('static exported interface', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([
      t.property('foo', t.stringType)
    ], 'Foo'), true)
    assert.strictEqual(t.printStatic(declaration), `export type Foo = {
  foo: string
}`)
  })

  it('static readonly interface', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([
      t.property('foo', t.stringType)
    ], 'Foo'), true, true)
    assert.strictEqual(t.printStatic(declaration), `export type Foo = Readonly<{
  foo: string
}>`)
  })

})
