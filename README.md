# Motivation

Generate both static and runtime types from an intermediate language.

The intermediate language can in turn be generated from other schemas: JSON Schema, Swagger, [metarpheus](https://github.com/buildo/metarpheus), etc..

# `io-ts` compatibility

| `io-ts-codegen` version | target `io-ts` version |
| ----------------------- | ---------------------- |
| 0.4.0+                  | 1.0.0+ \|\| 2.0.0+     |
| 0.3.0+                  | 1.0.0+ \|\| 2.0.0+     |

# Usage

Nodes of the intermediate language can be built from the provided builders.

```ts
import * as gen from 'io-ts-codegen'

// list of type declarations
const declarations = [
  gen.typeDeclaration('Persons', gen.arrayCombinator(gen.identifier('Person'))),
  gen.typeDeclaration(
    'Person',
    gen.typeCombinator([gen.property('name', gen.stringType), gen.property('age', gen.numberType)])
  )
]

// apply topological sort in order to get the right order
const sorted = gen.sort(declarations)

console.log(sorted.map(d => gen.printRuntime(d)).join('\n'))
console.log(sorted.map(d => gen.printStatic(d)).join('\n'))
```

Output (as string)

```ts
const Person = t.type({
  name: t.string,
  age: t.number
})
const Persons = t.array(Person)
interface Person {
  name: string
  age: number
}
type Persons = Array<t.TypeOf<typeof Person>>
```

# Documentation

- [API Reference](https://gcanti.github.io/io-ts-codegen)
