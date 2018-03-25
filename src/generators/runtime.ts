import { Node, Property, printDescription } from '../base'
import { escapeString, indent, escapePropertyKey } from '../base'


import {
  LiteralCombinator, InterfaceCombinator, PartialCombinator, StrictCombinator, TypeReference,
  UnionCombinator,
  TaggedUnionCombinator, IntersectionCombinator, KeyofCombinator, unionCombinator, literalCombinator,
  ArrayCombinator, ReadonlyArrayCombinator, DictionaryCombinator, TupleCombinator, TypeDeclaration,
  undefinedType, RecursiveCombinator
} from '../base'

export function addRuntimeName(s: string, name?: string): string {
  if (name) {
    return s + ', ' + escapeString(name)
  }
  return s
}


function printRuntimeLiteralCombinator(literalCombinator: LiteralCombinator, i: number): string {
  const value =
    typeof literalCombinator.value === 'string' ? escapeString(literalCombinator.value) : literalCombinator.value
  let s = `t.literal(${value}`
  s = addRuntimeName(s, literalCombinator.name)
  s += ')'
  return s
}



function containsUndefined(type: TypeReference): boolean {
  if (type.kind === 'UnionCombinator') {
    return type.types.some(containsUndefined)
  } else {
    return type.kind === 'UndefinedType'
  }
}

export function getRuntimePropertyType(p: Property): TypeReference {
  if (p.isOptional && !containsUndefined(p.type)) {
    return unionCombinator([p.type, undefinedType])
  } else {
    return p.type
  }
}

function printRuntimeProperty(p: Property, i: number): string {
  const type = getRuntimePropertyType(p)
  return `${printDescription(p.description, i)}${indent(i)}${escapePropertyKey(p.key)}: ${printRuntime(type, i)}`
}

function printRuntimeInterfaceCombinator(interfaceCombinator: InterfaceCombinator, i: number): string {
  let s = 't.interface({\n'
  s += interfaceCombinator.properties.map(p => printRuntimeProperty(p, i + 1)).join(',\n')
  s += `\n${indent(i)}}`
  s = addRuntimeName(s, interfaceCombinator.name)
  s += ')'
  return s
}

function printRuntimePartialCombinator(partialCombinator: PartialCombinator, i: number): string {
  let s = 't.partial({\n'
  s += partialCombinator.properties.map(p => printRuntimeProperty({ ...p, isOptional: false }, i + 1)).join(',\n')
  s += `\n${indent(i)}}`
  s = addRuntimeName(s, partialCombinator.name)
  s += ')'
  return s
}

function printRuntimeStrictCombinator(strictCombinator: StrictCombinator, i: number): string {
  let s = 't.strict({\n'
  s += strictCombinator.properties.map(p => printRuntimeProperty(p, i + 1)).join(',\n')
  s += `\n${indent(i)}}`
  s = addRuntimeName(s, strictCombinator.name)
  s += ')'
  return s
}

function printRuntimeTypesCombinator(
  combinatorKind: string,
  types: Array<TypeReference>,
  combinatorName: string | undefined,
  i: number
): string {
  const indentation = indent(i + 1)
  let s = `t.${combinatorKind}([\n`
  s += types.map(t => `${indentation}${printRuntime(t, i + 1)}`).join(',\n')
  s += `\n${indent(i)}]`
  s = addRuntimeName(s, combinatorName)
  s += ')'
  return s
}

function printRuntimeUnionCombinator(c: UnionCombinator, i: number): string {
  return printRuntimeTypesCombinator('union', c.types, c.name, i)
}

function printRuntimeTaggedUnionCombinator(c: TaggedUnionCombinator, i: number): string {
  const indentation = indent(i + 1)
  let s = `t.taggedUnion(${escapeString(c.tag)}, [\n`
  s += c.types.map(t => `${indentation}${printRuntime(t, i + 1)}`).join(',\n')
  s += `\n${indent(i)}]`
  s = addRuntimeName(s, c.name)
  s += ')'
  return s
}

function printRuntimeIntersectionCombinator(c: IntersectionCombinator, i: number): string {
  return printRuntimeTypesCombinator('intersection', c.types, c.name, i)
}

function printRuntimeKeyofCombinator(c: KeyofCombinator, i: number): string {
  const indentation = indent(i + 1)
  let s = `t.keyof({\n`
  s += c.values.map(v => `${indentation}${escapePropertyKey(v)}: true`).join(',\n')
  s += `\n${indent(i)}}`
  s = addRuntimeName(s, c.name)
  s += ')'
  return s
}

function printRuntimeArrayCombinator(c: ArrayCombinator, i: number): string {
  let s = `t.array(${printRuntime(c.type, i)}`
  s = addRuntimeName(s, c.name)
  s += ')'
  return s
}

function printRuntimeReadonlyArrayCombinator(c: ReadonlyArrayCombinator, i: number): string {
  let s = `t.readonlyArray(${printRuntime(c.type, i)}`
  s = addRuntimeName(s, c.name)
  s += ')'
  return s
}

function printRuntimeTupleCombinator(c: TupleCombinator, i: number): string {
  return printRuntimeTypesCombinator('tuple', c.types, c.name, i)
}

function printRuntimeTypeDeclaration(declaration: TypeDeclaration, i: number): string {
  let s = printRuntime(declaration.type, i)
  if (declaration.isReadonly) {
    s = `t.readonly(${s})`
  }
  s = `const ${declaration.name} = ${s}`
  if (declaration.isExported) {
    s = `export ${s}`
  }
  return s
}

function printRuntimeRecursiveCombinator(c: RecursiveCombinator, i: number): string {
  let s = `t.recursive<${c.typeParameter.name}>(${escapeString(c.name)}, (${c.name}: t.Any) => ${printRuntime(
    c.type,
    i
  )}`
  return s
}

function printRuntimeDictionaryCombinator(c: DictionaryCombinator, i: number): string {
  let s = `t.dictionary(${printRuntime(c.domain, i)}, ${printRuntime(c.codomain, i)}`
  s = addRuntimeName(s, c.name)
  s += ')'
  return s
}

export function printRuntime(node: Node, i: number = 0): string {
  switch (node.kind) {
    case 'Identifier':
      return node.name
    case 'StringType':
    case 'NumberType':
    case 'BooleanType':
    case 'NullType':
    case 'UndefinedType':
    case 'IntegerType':
    case 'AnyType':
    case 'ObjectType':
      return `t.${node.name}`
    case 'LiteralCombinator':
      return printRuntimeLiteralCombinator(node, i)
    case 'InterfaceCombinator':
      return printRuntimeInterfaceCombinator(node, i)
    case 'PartialCombinator':
      return printRuntimePartialCombinator(node, i)
    case 'StrictCombinator':
      return printRuntimeStrictCombinator(node, i)
    case 'UnionCombinator':
      return printRuntimeUnionCombinator(node, i)
    case 'TaggedUnionCombinator':
      return printRuntimeTaggedUnionCombinator(node, i)
    case 'IntersectionCombinator':
      return printRuntimeIntersectionCombinator(node, i)
    case 'KeyofCombinator':
      return printRuntimeKeyofCombinator(node, i)
    case 'ArrayCombinator':
      return printRuntimeArrayCombinator(node, i)
    case 'ReadonlyArrayCombinator':
      return printRuntimeReadonlyArrayCombinator(node, i)
    case 'TupleCombinator':
      return printRuntimeTupleCombinator(node, i)
    case 'RecursiveCombinator':
      return printRuntimeRecursiveCombinator(node, i)
    case 'DictionaryCombinator':
      return printRuntimeDictionaryCombinator(node, i)
    case 'TypeDeclaration':
      return printRuntimeTypeDeclaration(node, i)
  }
}

export {
  printRuntimeLiteralCombinator,
  printRuntimePartialCombinator,
  printRuntimeStrictCombinator,
  printRuntimeUnionCombinator,
  printRuntimeTaggedUnionCombinator,
  printRuntimeIntersectionCombinator,
  printRuntimeKeyofCombinator,
  printRuntimeArrayCombinator,
  printRuntimeReadonlyArrayCombinator,
  printRuntimeTupleCombinator,
  printRuntimeRecursiveCombinator,
  printRuntimeDictionaryCombinator,

}