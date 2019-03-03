---
title: Home
---

# Motivation

Generate both static and runtime types from an intermediate language.

The intermediate language can in turn be generated from other schemas: JSON Schema, Swagger, [metarpheus](https://github.com/buildo/metarpheus), etc..

# Usage

Nodes of the intermediate language can be built from the provided builders.

```ts
import * as gen from 'io-ts-codegen'

// list of type declarations
const declarations = [
  gen.typeDeclaration('Persons', gen.arrayCombinator(gen.identifier('Person'))),
  gen.typeDeclaration(
    'Person',
    gen.interfaceCombinator([gen.property('name', gen.stringType), gen.property('age', gen.numberType)])
  )
]

// apply topological sort in order to get the right order
const sorted = gen.sort(declarations)

console.log(sorted.map(d => gen.printRuntime(d)).join('\n'))
console.log(sorted.map(d => gen.printStatic(d)).join('\n'))
```

Output (as string)

```ts
const Person = t.interface({
  name: t.string,
  age: t.number
})
const Persons = t.array(Person)
interface Person {
  name: string
  age: number
}
type Persons = Array<Person>
```
