
import { addRuntimeName, getRuntimePropertyType } from './runtime'

import {
  TypeDeclaration,
  Node,
  InterfaceCombinator,
  indent,
  BasicType,
  Property,
  printDescription,
  escapePropertyKey,
  ArrayCombinator,
} from '../base'

import {
  printRuntimeLiteralCombinator,
  printRuntimePartialCombinator,
  printRuntimeStrictCombinator,
  printRuntimeUnionCombinator,
  printRuntimeTaggedUnionCombinator,
  printRuntimeIntersectionCombinator,
  printRuntimeKeyofCombinator,
  printRuntimeReadonlyArrayCombinator,
  printRuntimeTupleCombinator,
  printRuntimeRecursiveCombinator,
  printRuntimeDictionaryCombinator,
} from './runtime'


function printPythonArrayCombinator(c: ArrayCombinator, i: number): string {
  let s = `List[${printPython(c.type, i)}]`
  s = addPythonName(s, c.name)
  s += ''
  return s
}



function printPythonTypeDeclaration(declaration: TypeDeclaration, i: number): string {
  let s = printPython(declaration.type, i)

  if ((declaration.type.kind === 'InterfaceCombinator' ||
    declaration.type.kind === 'StrictCombinator' ||
    declaration.type.kind === 'PartialCombinator') &&
    !declaration.isReadonly
  ) {

    s = `@attr.s(auto_attribs=True, slots=True, frozen=True)
class ${declaration.name}:
${s}`
  } else {
    // console.log('any othe type', declaration.type.kind)
    s = `${declaration.name} = NewType("${declaration.name}", ${s})`
  }

  return s
}


export function printPythonProperty(p: Property, i: number): string {
  const type = getRuntimePropertyType(p)
  return `${printDescription(p.description, i)}${indent(i * 2)}${escapePropertyKey(p.key)}: ${printPython(type, i)}`
}



const addPythonName = addRuntimeName


function printPythonInterfaceCombinator(interfaceCombinator: InterfaceCombinator, i: number): string {
  let s = ''
  s += interfaceCombinator.properties.map(p => printPythonProperty(p, i + 1)).join('\n')
  s += `\n${indent(i)}`
  s = addPythonName(s, interfaceCombinator.name)
  s += ''
  return s
}

function printBasicType(node: BasicType, i: number) {
  // switch (node.kind) {
  // return `t.${node.name}`
  switch (node.kind) {
    case 'StringType':
      return 'str'
    case 'NumberType':
      return 'int'
    case 'BooleanType':
      return 'bool'
    case 'NullType':
      return 'None'
    case 'UndefinedType':
      return 'None'
    case 'IntegerType':
      return 'int'
    case 'AnyType':
      return 'Any'
    case 'ObjectType':
      return 'object'
  }
}


export function printPython(node: Node, i: number = 0): string {
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

      return printBasicType(node, i)
    case 'LiteralCombinator':
      return printRuntimeLiteralCombinator(node, i)
    case 'InterfaceCombinator':
      return printPythonInterfaceCombinator(node, i)
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
      return printPythonArrayCombinator(node, i)
    case 'ReadonlyArrayCombinator':
      return printRuntimeReadonlyArrayCombinator(node, i)
    case 'TupleCombinator':
      return printRuntimeTupleCombinator(node, i)
    case 'RecursiveCombinator':
      return printRuntimeRecursiveCombinator(node, i)
    case 'DictionaryCombinator':
      return printRuntimeDictionaryCombinator(node, i)
    case 'TypeDeclaration':
      return printPythonTypeDeclaration(node, i)
  }
}