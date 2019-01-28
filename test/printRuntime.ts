import * as assert from 'assert'
import * as t from '../src'

describe('printRuntime', () => {
  describe('taggedUnion', () => {
    it('should handle tag and types', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.taggedUnionCombinator('type', [
          t.interfaceCombinator([t.property('type', t.literalCombinator('A'))]),
          t.interfaceCombinator([t.property('type', t.literalCombinator('B'))])
        ])
      )
      assert.strictEqual(
        t.printRuntime(declaration),
        `const Foo = t.taggedUnion('type', [
  t.type({
    type: t.literal('A')
  }),
  t.type({
    type: t.literal('B')
  })
])`
      )
    })

    it('should handle name', () => {
      const declaration = t.typeDeclaration('Foo', t.taggedUnionCombinator('type', [], 'Foo'))
      assert.strictEqual(
        t.printRuntime(declaration),
        `const Foo = t.taggedUnion('type', [

], 'Foo')`
      )
    })
  })

  describe('interface', () => {
    it('should handle required props', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.interfaceCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)])
      )
      assert.strictEqual(
        t.printRuntime(declaration),
        `const Foo = t.type({
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
        `const Foo = t.intersection([
  t.type({
    foo: t.string
  }),
  t.partial({
    bar: t.number
  })
])`
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
        `const Foo = t.intersection([
  t.type({
    foo: t.string
  }),
  t.partial({
    bar: t.union([
      t.number,
      t.undefined
    ])
  })
])`
      )
    })
  })

  it('partial', () => {
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

  it('record', () => {
    const declaration = t.typeDeclaration('Foo', t.dictionaryCombinator(t.stringType, t.numberType))
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.record(t.string, t.number)`)
  })

  it('nested interface', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.interfaceCombinator([
        t.property('foo', t.stringType),
        t.property('bar', t.interfaceCombinator([t.property('baz', t.numberType)]))
      ])
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Foo = t.type({
  foo: t.string,
  bar: t.type({
    baz: t.number
  })
})`
    )
  })

  it('interface with name', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([t.property('foo', t.stringType)], 'Foo'))
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Foo = t.type({
  foo: t.string
}, 'Foo')`
    )
  })

  it('escape property', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.interfaceCombinator([
        t.property('foo bar', t.stringType),
        t.property('image/jpeg', t.stringType),
        t.property('autoexec.bat', t.stringType)
      ])
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Foo = t.type({
  'foo bar': t.string,
  'image/jpeg': t.string,
  'autoexec.bat': t.string
})`
    )
  })

  it('exported interface', () => {
    const declaration = t.typeDeclaration('Foo', t.interfaceCombinator([t.property('foo', t.stringType)], 'Foo'), true)
    assert.strictEqual(
      t.printRuntime(declaration),
      `export const Foo = t.type({
  foo: t.string
}, 'Foo')`
    )
  })

  it('readonly interface', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.interfaceCombinator([t.property('foo', t.stringType)], 'Foo'),
      true,
      true
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `export const Foo = t.readonly(t.type({
  foo: t.string
}, 'Foo'))`
    )
  })

  it('recursive', () => {
    const declaration = t.typeDeclaration(
      'Category',
      t.recursiveCombinator(
        t.identifier('Category'),
        'Category',
        t.interfaceCombinator([
          t.property('name', t.stringType),
          t.property('categories', t.arrayCombinator(t.identifier('Category')))
        ])
      )
    )
    assert.strictEqual(
      t.printStatic(declaration),
      `interface Category {
  name: string,
  categories: Array<Category>
}`
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Category: t.RecursiveType<t.Type<Category>> = t.recursion('Category', () => t.type({
  name: t.string,
  categories: t.array(Category)
}))`
    )
  })

  it('readonly array', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.interfaceCombinator([t.property('foo', t.readonlyArrayCombinator(t.stringType))], 'Foo'),
      true,
      true
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `export const Foo = t.readonly(t.type({
  foo: t.readonlyArray(t.string)
}, 'Foo'))`
    )
  })

  it('CustomCombinator', () => {
    const optionCombinator = (type: t.TypeReference): t.CustomCombinator =>
      t.customCombinator(
        `Option<${t.printStatic(type)}>`,
        `createOptionFromNullable(${t.printRuntime(type)})`,
        t.getNodeDependencies(type)
      )

    const declaration = t.typeDeclaration('Foo', optionCombinator(t.stringType))

    assert.strictEqual(t.printRuntime(declaration), `const Foo = createOptionFromNullable(t.string)`)

    assert.strictEqual(t.printStatic(declaration), `type Foo = Option<string>`)
  })

  it('StringType', () => {
    const declaration = t.typeDeclaration('Foo', t.stringType)
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.string`)
  })

  it('NumberType', () => {
    const declaration = t.typeDeclaration('Foo', t.numberType)
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.number`)
  })

  it('BooleanType', () => {
    const declaration = t.typeDeclaration('Foo', t.booleanType)
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.boolean`)
  })

  it('NullType', () => {
    const declaration = t.typeDeclaration('Foo', t.nullType)
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.null`)
  })

  it('UndefinedType', () => {
    const declaration = t.typeDeclaration('Foo', t.undefinedType)
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.undefined`)
  })

  it('IntegerType', () => {
    const declaration = t.typeDeclaration('Foo', t.integerType)
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.Integer`)
  })

  it('UnknownArrayType', () => {
    const declaration = t.typeDeclaration('Foo', t.unknownArrayType)
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.UnknownArray`)
  })

  it('UnknownRecordType', () => {
    const declaration = t.typeDeclaration('Foo', t.unknownRecordType)
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.UnknownRecord`)
  })

  it('FunctionType', () => {
    const declaration = t.typeDeclaration('Foo', t.functionType)
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.Function`)
  })

  it('exact', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.exactCombinator(
        t.interfaceCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)]),
        'Foo'
      )
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Foo = t.exact(t.type({
  foo: t.string,
  bar: t.number
}), 'Foo')`
    )
  })

  it('UnknownType', () => {
    const declaration = t.typeDeclaration('Foo', t.unknownType)
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.unknown`)
  })
})
