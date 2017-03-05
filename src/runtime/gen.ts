import * as ast from './ast'
import { indent, escapeString, escapeProp } from '../utils'

function addName(s: string, name?: string): string {
  if (name) {
    return s + ', ' + escapeString(name)
  } else {
    return s
  }
}

function printLiteralCombinator(combinator: ast.LiteralCombinator, i: number): string {
  const value = typeof combinator.value === 'string' ? escapeString(combinator.value) : combinator.value
  let s = `t.literal(${value}`
  s = addName(s, combinator.name)
  s += ')'
  return s
}

function printArrayCombinator(combinator: ast.ArrayCombinator, i: number): string {
  let s = `t.array(${print(combinator.type, i)}`
  s = addName(s, combinator.name)
  s += ')'
  return s
}

function printDescription(description: string | undefined, indentation: string): string {
  if (description) {
    return indentation + description + '\n'
  } else {
    return ''
  }
}

function printInterfaceCombinator(combinator: ast.InterfaceCombinator, i: number): string {
  const indentation = indent(i + 1)
  let s = 't.interface({\n'
  s += combinator.props.map(p => `${printDescription(p.description, indentation)}${indentation}${escapeProp(p.name)}: ${print(p.type, i + 1)}`).join(',\n')
  s += `\n${indent(i)}}`
  s = addName(s, combinator.name)
  s += ')'
  return s
}

function printTypesCombinator(combinator: string, types: Array<ast.Type>, name: string | undefined, i: number): string {
  const indentation = indent(i + 1)
  let s = `t.${combinator}([\n`
  s += types.map(t => `${indentation}${print(t, i + 1)}`).join(',\n')
  s += `\n${indent(i)}]`
  s = addName(s, name)
  s += ')'
  return s
}

function printUnionCombinator(combinator: ast.UnionCombinator, i: number): string {
  return printTypesCombinator('union', combinator.types, combinator.name, i)
}

function printTupleCombinator(combinator: ast.TupleCombinator, i: number): string {
  return printTypesCombinator('tuple', combinator.types, combinator.name, i)
}

function printIntersectionCombinator(combinator: ast.IntersectionCombinator, i: number): string {
  return printTypesCombinator('intersection', combinator.types, combinator.name, i)
}

function printReadonlyCombinator(combinator: ast.ReadonlyCombinator, i: number): string {
  let s = `t.readonly(${print(combinator.type, i)}`
  s = addName(s, combinator.name)
  s += ')'
  return s
}

function printKeyofCombinator(combinator: ast.KeyofCombinator, i: number): string {
  const indentation = indent(i + 1)
  let s = `t.keyof({\n`
  s += combinator.values.map(v => `${indentation}${escapeProp(v)}: true`).join(',\n')
  s += `\n${indent(i)}}`
  s = addName(s, combinator.name)
  s += ')'
  return s
}

function printRecursionCombinator(combinator: ast.RecursionCombinator, i: number): string {
  const arrow = `(${combinator.name}: t.Any) => ${print(combinator.declaration, i)}`
  return `t.recursion<${combinator.typeParameter}>(${escapeString(combinator.name)}, ${arrow})`
}

function printBuiltinType(type: ast.BuiltinType): string {
  return `t.${type.name}`
}

export function print(ref: ast.Type, i: number): string {
  switch (ref.kind) {
    case 'Identifier' :
      return ref.name
    case 'LiteralCombinator' :
      return printLiteralCombinator(ref, i)
    case 'ArrayCombinator' :
      return printArrayCombinator(ref, i)
    case 'InterfaceCombinator' :
      return printInterfaceCombinator(ref, i)
    case 'UnionCombinator' :
      return printUnionCombinator(ref, i)
    case 'TupleCombinator' :
      return printTupleCombinator(ref, i)
    case 'IntersectionCombinator' :
      return printIntersectionCombinator(ref, i)
    case 'ReadonlyCombinator' :
      return printReadonlyCombinator(ref, i)
    case 'KeyofCombinator' :
      return printKeyofCombinator(ref, i)
    case 'RecursionCombinator' :
      return printRecursionCombinator(ref, i)
    case 'StringType' :
    case 'NumberType' :
    case 'BooleanType' :
    case 'UndefinedType' :
      return printBuiltinType(ref)
  }
}

export function printCombinatorDeclaration(declaration: ast.CombinatorDeclaration): string {
  return `const ${declaration.name} = ${print(declaration.combinator, 0)}`
}
