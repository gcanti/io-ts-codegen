# Motivation

Generate both static and runtime types from an intermediate language.

The intermediate language can in turn be generated from other schemas: JSON Schema, Swagger, [metarpheus](https://github.com/buildo/metarpheus), etc..

# Usage

Nodes of the intermediate language can be built from the provided builders.

```ts
import * as t from 'io-ts-codegen'

const declaration = t.typeDeclaration(
  'Person',
  t.interfaceCombinator([
    t.property('name', t.stringType),
    t.property('age', t.numberType)
  ])
)

console.log(t.printRuntime(declaration))
console.log(t.printStatic(declaration))
```

Output

```ts
`const Person = t.interface({
  name: t.string,
  age: t.number
})

interface Person {
  name: string,
  age: number
}`
```

# Example: converting JSON Schema

```ts
import * as t from 'io-ts-codegen'

export interface StringSchema {
  type: 'string'
}

export interface NumberSchema {
  type: 'number'
}

export interface BooleanSchema {
  type: 'boolean'
}

export interface ObjectSchema {
  type: 'object',
  properties: { [key: string]: JSONSchema },
  required?: Array<string>
}

export type JSONSchema =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | ObjectSchema

function getRequiredProperties(schema: ObjectSchema): { [key: string]: true } {
  const required: { [key: string]: true } = {}
  if (schema.required) {
    schema.required.forEach(function (k) {
      required[k] = true
    })
  }
  return required
}

function toInterfaceCombinator(schema: ObjectSchema): t.InterfaceCombinator {
  const required = getRequiredProperties(schema)
  return t.interfaceCombinator(
    Object.keys(schema.properties).map(key => t.property(
      key,
      to(schema.properties[key]),
      !required.hasOwnProperty(key)
    ))
  )
}

export function to(schema: JSONSchema): t.TypeReference {
  switch (schema.type) {
    case 'string' :
      return t.stringType
    case 'number' :
      return t.numberType
    case 'boolean' :
      return t.booleanType
    case 'object' :
      return toInterfaceCombinator(schema)
  }
}

const schema: JSONSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string'
    }
  },
  required: ['foo']
}

t.printStatic(to(schema))
/*
Output:

{
  foo: string
}
*/

t.printRuntime(to(schema))
/*
Output:

t.interface({
  foo: t.string
})
*/
```
