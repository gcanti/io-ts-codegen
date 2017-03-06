# Motivation

Generate both static and runtime types from an intermediate language.

# Usage

```ts
const declaration = t.typeDeclaration(
  'Person',
  t.interfaceCombinator([
    t.property('name', t.stringType),
    t.property('age', t.stringType, true)
  ])
)

console.log(t.printRuntime(declaration))
console.log(t.printStatic(declaration))
```

Output

```ts
const Person = t.interface({
  name: t.string,
  age: t.union([
    t.string,
    t.undefined
  ])
})

interface Person {
  name: string,
  age?: string
}
```
