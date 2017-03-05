import * as ast from './ast'
import { indent, escapeString, escapeProp } from '../utils'

function printLeadingComments(comments: Array<ast.MultiLineCommentTrivia> | undefined, indentation: string): string {
  if (comments) {
    return comments.map(c => indentation + c.text + (c.hasTrailingNewLine ? '\n' : '')).join('')
  } else {
    return ''
  }
}

function printProperty(property: ast.PropertySignature, indentation: string, i: number): string {
  const leadingComments = printLeadingComments(property.leadingComments, indentation)
  const name = escapeProp(property.name.text)
  const questionToken = property.questionToken ? '?' : ''
  const value = print(property.type, i + 1)
  return `${leadingComments}${indentation}${name}${questionToken}: ${value}`
}

function printMembers(properties: Array<ast.PropertySignature>, i: number): string {
  const indentation = indent(i + 1)
  let s = '{\n'
  s += properties.map(property => printProperty(property, indentation, i)).join(',\n')
  s += `\n${indent(i)}}`
  return s
}

function printTypeReference(ref: ast.TypeReference, i: number): string {
  if (ref.typeArguments) {
    return `${ref.typeName.text}<${ref.typeArguments.map(t => print(t, i)).join(', ')}>`
  } else {
    return ref.typeName.text
  }
}

function printUnionType(type: ast.UnionType, i: number): string {
  const indentation = indent(i + 1)
  return type.types.map(t => '\n' + indentation + '| ' + print(t, i)).join('')
}

function printLastTypeNode(type: ast.LastTypeNode, i: number): string {
  const literal = type.literal
  switch (literal.kind) {
    case 9 :
      return escapeString(literal.text)
    case 8 :
      return literal.text
    case 100 :
      return 'true'
    case 85 :
      return 'false'
  }
}

export function print(type: ast.Type, i: number): string {
  switch (type.kind) {
    case 134 :
      return 'string'
    case 133 :
      return 'number'
    case 121 :
      return 'boolean'
    case 94 :
      return 'null'
    case 137 :
      return 'undefined'
    case 104 :
      return 'void'
    case 118 :
      return 'any'
    case 129 :
      return 'never'
    case 161 :
      return printMembers(type.members, i)
    case 157 :
      return printTypeReference(type, i)
    case 164 :
      return printUnionType(type, i)
    case 171 :
      return printLastTypeNode(type, i)
  }
}

export function printTypeAliasDeclaration(declaration: ast.TypeAliasDeclaration): string {
  return `type ${declaration.name.text} = ${print(declaration.type, 0)}`
}

export function printInterfaceDeclaration(declaration: ast.InterfaceDeclaration): string {
  return `interface ${declaration.name.text} ${printMembers(declaration.members, 0)}`
}
