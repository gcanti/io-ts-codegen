# Changelog

> **Tags:**
>
> - [New Feature]
> - [Bug Fix]
> - [Breaking Change]
> - [Documentation]
> - [Internal]
> - [Polish]
> - [Experimental]

**Note**: Gaps between patch versions are faulty/broken releases. **Note**: A feature tagged as Experimental is in a
high state of flux, you're at risk of it changing without notice.

# 0.4.1

remove useless `io-ts` peer dependency, closes #44 (@gcanti)

# 0.4.0

- **New Feature**
  - handle recursive codecs with `A !== O`, closes #98 (@gcanti)
- **Bug Fix**
  - fix recursive type declaration output (@gcanti)
  - always extract the result type of an identifier when printing the static type, fix #43 (@gcanti)

# 0.3.3

- **New Feature**
  - add `description` optional argument to `typeDeclaration` (@mk0x9)

# 0.3.2

**Note**. This version requires `io-ts@1.8.1+`

- **New Feature**
  - revert drop `strictCombinator` (@gcanti)
  - add `readonlyCombinator` (@gcanti)
  - add `intType` (@gcanti)
  - add `brandCombinator` (@gcanti)
- **Deprecation**
  - deprecate `isReadonly` in `typeDeclaration` (@gcanti)
  - deprecate `integerType` (@gcanti)

# 0.3.1

- **Bug Fix**
  - `printRuntimeInterfaceCombinator` should propagate `name` when there are optional properties, fix #31 (@gcanti)
- **Polish**
  - use type declaration name when wrapping in a `readonly` (@gcanti)

# 0.3.0

**Note**. This version requires `io-ts@1.7.1+`

- **Breaking Change**
  - drop `AnyType` (@gcanti)
  - rename `AnyArrayType` to `UnknownArrayType` (@gcanti)
  - rename `AnyDictionaryType` to `UnknownRecordType` (@gcanti)
  - drop `ObjectType` (@gcanti)
  - drop `StrictCombinator` (@gcanti)
  - drop `aliasPattern` (@gcanti)
- **New Feature**
  - add `UnknownType` (@gcanti)
- **Polish**
  - use `t.type` instead of `t.interface` (@gcanti)
  - use `t.record` instead of `t.dictionary`(@gcanti)
  - recursive type output (@gcanti)
- **Deprecation**
  - deprecate `dictionaryCombinator` in favour of `recordCombinator` (@gcanti)
  - deprecate `interfaceCombinator` in favour of `typeCombinator` (@gcanti)
- **Internal**
  - Test: 100% coverage (@gcanti)

# 0.2.2

- **Bug Fix**
  - the static type outputted by dictionaries should use `in` (@gcanti)

# 0.2.1

- **Bug Fix**
  - Interface properties containing square bracket should also be escaped, #28 (@MaximeRDY)

# 0.2.0

- **New Feature**
  - update optional property support, #27 (@mmkal)

# 0.1.11

- **Bug Fix**
  - recursive types should be emitted before "normal" types, fix #21 (@gcanti)

# 0.1.10

- **Bug Fix**
  - recursive tagged unions should not output an interface (@gcanti)
  - add an explicit type annotation when printing recursive types (@gcanti)

# 0.1.9

- **New feature**
  - add `aliasPattern` helper (@gcanti)

# 0.1.8

- **Bug Fix**
  - interface properties containing dots should also be escaped (@leemhenson)

# 0.1.7

- **Experimental**
  - add `exact` combinator (@gcanti)

# 0.1.6

- **Bug Fix**
  - fix recursive type declarations (@gcanti)

# 0.1.5

- **New Feature**
  - add `CustomCombinator` (@leemhenson)
  - add `getNodeDependencies` (@gcanti)

# 0.1.4

- **New Feature**
  - New Feature: add `AnyArrayType`, `AnyDictionaryType`, `ObjectType`, `FunctionType` (@gcanti)

# 0.1.3

- **New Feature**
  - add `CustomTypeDeclaration` (@gcanti)

# 0.1.2

- **New Feature**
  - add `TaggedUnionCombinator` (@gcanti)

# 0.1.1

- **New Feature**
  - add `PartialCombinator` (@gcanti)
  - avoid `undefinedType` duplications when a property is tagged as optional (@gcanti)

# 0.0.4

- **New Feature**
  - add `StrictCombinator` (@gcanti)

# 0.0.3

- **New Feature**
  - add `AnyType` (@gcanti)

# 0.0.2

- **New Feature**
  - add `IntegerType` (@gcanti)

# 0.0.1

Initial release
