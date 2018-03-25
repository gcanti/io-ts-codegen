import { Node, Property, printDescription } from '../base'
import { escapeString, indent, escapePropertyKey } from '../base'


import {
  LiteralCombinator, InterfaceCombinator, PartialCombinator, StrictCombinator, TypeReference,
  UnionCombinator,
  TaggedUnionCombinator, IntersectionCombinator, KeyofCombinator, unionCombinator, literalCombinator,
  ArrayCombinator, ReadonlyArrayCombinator, DictionaryCombinator, TupleCombinator, TypeDeclaration,
  undefinedType, RecursiveCombinator
} from '../base'



function printStaticProperty(p: Property, i: number): string {
  const optional = p.isOptional ? '?' : ''
  return `${printDescription(p.description, i)}${indent(i)}${escapePropertyKey(p.key)}${optional}: ${printStatic(
    p.type,
    i
  )}`
}

function printStaticLiteralCombinator(c: LiteralCombinator, i: number): string {
  return typeof c.value === 'string' ? escapeString(c.value) : String(c.value)
}

function printStaticInterfaceCombinator(c: InterfaceCombinator, i: number): string {
  let s = '{\n'
  s += c.properties.map(p => printStaticProperty(p, i + 1)).join(',\n')
  s += `\n${indent(i)}}`
  return s
}

function printStaticPartialCombinator(c: PartialCombinator, i: number): string {
  let s = '{\n'
  s += c.properties.map(p => printStaticProperty({ ...p, isOptional: true }, i + 1)).join(',\n')
  s += `\n${indent(i)}}`
  return s
}

function printStaticStrictCombinator(c: StrictCombinator, i: number): string {
  let s = '{\n'
  s += c.properties.map(p => printStaticProperty(p, i + 1)).join(',\n')
  s += `\n${indent(i)}}`
  return s
}

function printStaticTypesCombinator(types: Array<TypeReference>, separator: string, i: number): string {
  const indentation = indent(i + 1)
  return types.map(t => `\n${indentation}${separator} ${printStatic(t, i)}`).join('')
}

function printStaticUnionCombinator(c: UnionCombinator, i: number): string {
  return printStaticTypesCombinator(c.types, '|', i)
}

function printStaticTaggedUnionCombinator(c: TaggedUnionCombinator, i: number): string {
  return printStaticTypesCombinator(c.types, '|', i)
}

function printStaticIntersectionCombinator(c: IntersectionCombinator, i: number): string {
  return printStaticTypesCombinator(c.types, '&', i)
}

function printStaticKeyofCombinator(c: KeyofCombinator, i: number): string {
  return printStatic(unionCombinator(c.values.map(value => literalCombinator(value))), i)
}

function printStaticArrayCombinator(c: ArrayCombinator, i: number): string {
  return `Array<${printStatic(c.type, i)}>`
}

function printStaticReadonlyArrayCombinator(c: ReadonlyArrayCombinator, i: number): string {
  return `ReadonlyArray<${printStatic(c.type, i)}>`
}

function printStaticDictionaryCombinator(c: DictionaryCombinator, i: number): string {
  return `{ [key: ${printStatic(c.domain, i)}]: ${printStatic(c.codomain, i)} }`
}

function printStaticTupleCombinator(c: TupleCombinator, i: number): string {
  const indentation = indent(i + 1)
  let s = '[\n'
  s += c.types.map(t => `${indentation}${printStatic(t, i)}`).join(',\n')
  s += `\n${indent(i)}]`
  return s
}

function printStaticTypeDeclaration(declaration: TypeDeclaration, i: number): string {
  let s = printStatic(declaration.type, i)
  if (
    (declaration.type.kind === 'InterfaceCombinator' ||
      declaration.type.kind === 'StrictCombinator' ||
      declaration.type.kind === 'PartialCombinator') &&
    !declaration.isReadonly
  ) {
    s = `interface ${declaration.name} ${s}`
  } else {
    if (declaration.isReadonly) {
      s = `Readonly<${s}>`
    }
    s = `type ${declaration.name} = ${s}`
  }
  if (declaration.isExported) {
    s = `export ${s}`
  }
  return s
}

export function printStatic(node: Node, i: number = 0): string {
  switch (node.kind) {
    case 'Identifier':
      return node.name
    case 'StringType':
    case 'NumberType':
    case 'BooleanType':
    case 'NullType':
    case 'UndefinedType':
    case 'AnyType':
      return node.name
    case 'ObjectType':
      return 'object'
    case 'IntegerType':
      return 'number'
    case 'LiteralCombinator':
      return printStaticLiteralCombinator(node, i)
    case 'InterfaceCombinator':
      return printStaticInterfaceCombinator(node, i)
    case 'PartialCombinator':
      return printStaticPartialCombinator(node, i)
    case 'StrictCombinator':
      return printStaticStrictCombinator(node, i)
    case 'UnionCombinator':
      return printStaticUnionCombinator(node, i)
    case 'TaggedUnionCombinator':
      return printStaticTaggedUnionCombinator(node, i)
    case 'IntersectionCombinator':
      return printStaticIntersectionCombinator(node, i)
    case 'KeyofCombinator':
      return printStaticKeyofCombinator(node, i)
    case 'ArrayCombinator':
      return printStaticArrayCombinator(node, i)
    case 'ReadonlyArrayCombinator':
      return printStaticReadonlyArrayCombinator(node, i)
    case 'TupleCombinator':
      return printStaticTupleCombinator(node, i)
    case 'RecursiveCombinator':
      return printStatic(node.type, i)
    case 'DictionaryCombinator':
      return printStaticDictionaryCombinator(node, i)
    case 'TypeDeclaration':
      return printStaticTypeDeclaration(node, i)
  }
}
