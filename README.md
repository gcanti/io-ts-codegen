# Usage

## Runtime

```ts
import * as ast from 'gen-io-ts/lib/runtime/ast'
import * as gen from 'gen-io-ts/lib/runtime/gen'

const declaration = ast.combinatorDeclaration('Person', ast.interfaceCombinator([
  ast.prop('name', ast.stringType),
  ast.prop('age', ast.numberType)
]))
gen.printCombinatorDeclaration(declaration)
```

Output

```js
const Person = t.interface({
  name: t.string,
  age: t.number
})
```

## Static

```ts
import * as ast from 'gen-io-ts/lib/static/ast'
import * as gen from 'gen-io-ts/lib/static/gen'

const declaration = ast.interfaceDeclaration(ast.identifier('Person'), [
  ast.propertySignature(ast.identifier('name'), ast.stringKeyword),
  ast.propertySignature(ast.identifier('age'), ast.numberKeyword)
])
gen.printInterfaceDeclaration(declaration)
```

Output

```ts
interface Person {
  name: string,
  age: number
}
```
