import * as assert from 'assert'
import * as t from '../src'

describe('printRuntime', () => {
  it('literalCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.literalCombinator(1))
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.literal(1)`)
  })

  it('keyofCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.keyofCombinator(['a', 'b']))
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Foo = t.keyof({
  a: null,
  b: null
})`
    )
  })

  it('tupleCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.tupleCombinator([t.stringType, t.numberType]))
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Foo = t.tuple([
  t.string,
  t.number
])`
    )
  })

  describe('taggedUnionCombinator', () => {
    it('should handle tag and types', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.taggedUnionCombinator('type', [
          t.typeCombinator([t.property('type', t.literalCombinator('A'))]),
          t.typeCombinator([t.property('type', t.literalCombinator('B'))])
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

  describe('typeCombinator', () => {
    it('should handle field descriptions', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([t.property('a', t.stringType, false, 'description')])
      )
      assert.strictEqual(
        t.printRuntime(declaration),
        `const Foo = t.type({
  /** description */
  a: t.string
})`
      )
    })

    it('should escape properties', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([
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

    it('should handle nested types', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([
          t.property('foo', t.stringType),
          t.property('bar', t.typeCombinator([t.property('baz', t.numberType)]))
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

    it('should handle the name argument', () => {
      const allRequired = t.typeDeclaration('Foo', t.typeCombinator([t.property('foo', t.stringType)], 'Foo'))
      assert.strictEqual(
        t.printRuntime(allRequired),
        `const Foo = t.type({
  foo: t.string
}, 'Foo')`
      )
      const someOptionals = t.typeDeclaration(
        'Foo',
        t.typeCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType, true)], 'Foo')
      )
      assert.strictEqual(
        t.printRuntime(someOptionals),
        `const Foo = t.intersection([
  t.type({
    foo: t.string
  }),
  t.partial({
    bar: t.number
  })
], 'Foo')`
      )
      const allOptionals = t.typeDeclaration('Foo', t.typeCombinator([t.property('foo', t.stringType, true)], 'Foo'))
      assert.strictEqual(
        t.printRuntime(allOptionals),
        `const Foo = t.partial({
  foo: t.string
}, 'Foo')`
      )
    })

    it('should use type when all properties are required', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)])
      )
      assert.strictEqual(
        t.printRuntime(declaration),
        `const Foo = t.type({
  foo: t.string,
  bar: t.number
})`
      )
    })

    it('should use an intersection when there is al least an optional property and a required property', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([t.property('a', t.stringType, true), t.property('b', t.stringType)])
      )
      assert.strictEqual(
        t.printRuntime(declaration),
        `const Foo = t.intersection([
  t.type({
    b: t.string
  }),
  t.partial({
    a: t.string
  })
])`
      )
    })

    it('should use partial when all properties are optional', () => {
      const declaration = t.typeDeclaration('Foo', t.typeCombinator([t.property('a', t.stringType, true)]))
      assert.strictEqual(
        t.printRuntime(declaration),
        `const Foo = t.partial({
  a: t.string
})`
      )
    })

    it('should not add useless `undefinedType`s', () => {
      const declaration = t.typeDeclaration(
        'Foo',
        t.typeCombinator([
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

  it('partialCombinator', () => {
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

  it('recordCombinator', () => {
    const declaration = t.typeDeclaration('Foo', t.recordCombinator(t.stringType, t.numberType))
    assert.strictEqual(t.printRuntime(declaration), `const Foo = t.record(t.string, t.number)`)
  })

  describe('typeDeclaration', () => {
    it('should handle the isExported argument', () => {
      const declaration = t.typeDeclaration('Foo', t.typeCombinator([t.property('foo', t.stringType)], 'Foo'), true)
      assert.strictEqual(
        t.printRuntime(declaration),
        `export const Foo = t.type({
  foo: t.string
}, 'Foo')`
      )
    })

    it('should handle the isReadonly argument', () => {
      const declaration = t.typeDeclaration('Foo', t.typeCombinator([t.property('foo', t.stringType)]), true, true)
      assert.strictEqual(
        t.printRuntime(declaration),
        `export const Foo = t.readonly(t.type({
  foo: t.string
}), 'Foo')`
      )
    })
  })

  it('recursiveCombinator', () => {
    const declaration = t.typeDeclaration(
      'Category',
      t.recursiveCombinator(
        t.identifier('Category'),
        'Category',
        t.typeCombinator([
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

  it('readonlyArrayCombinator', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.typeCombinator([t.property('foo', t.readonlyArrayCombinator(t.stringType))]),
      true,
      true
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `export const Foo = t.readonly(t.type({
  foo: t.readonlyArray(t.string)
}), 'Foo')`
    )
  })

  it('customCombinator', () => {
    const optionCombinator = (type: t.TypeReference): t.CustomCombinator =>
      t.customCombinator(
        `Option<${t.printStatic(type)}>`,
        `createOptionFromNullable(${t.printRuntime(type)})`,
        t.getNodeDependencies(type)
      )

    const declaration1 = t.typeDeclaration('Foo', optionCombinator(t.stringType))
    assert.strictEqual(t.printRuntime(declaration1), `const Foo = createOptionFromNullable(t.string)`)
    assert.strictEqual(t.printStatic(declaration1), `type Foo = Option<string>`)
    const declaration2 = t.customCombinator(`string`, `t.string`)
    assert.strictEqual(t.printRuntime(declaration2), `t.string`)
    assert.strictEqual(t.printStatic(declaration2), `string`)
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

  it('exactCombinator', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.exactCombinator(t.typeCombinator([t.property('foo', t.stringType), t.property('bar', t.numberType)]), 'Foo')
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

  it('recursiveCombinator', () => {
    const declaration = t.typeDeclaration(
      'Foo',
      t.intersectionCombinator([
        t.typeCombinator([t.property('a', t.stringType)]),
        t.typeCombinator([t.property('b', t.numberType)])
      ])
    )
    assert.strictEqual(
      t.printRuntime(declaration),
      `const Foo = t.intersection([
  t.type({
    a: t.string
  }),
  t.type({
    b: t.number
  })
])`
    )
  })
})
