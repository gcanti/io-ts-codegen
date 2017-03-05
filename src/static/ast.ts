export interface Identifier {
  kind: 70,
  text: string
}

export interface StringKeyword {
  kind: 134
}

export interface NumberKeyword {
  kind: 133
}

export interface BooleanKeyword {
  kind: 121
}

export interface NullKeyword {
  kind: 94
}

export interface UndefinedKeyword {
  kind: 137
}

export interface VoidKeyword {
  kind: 104
}

export interface AnyKeyword {
  kind: 118
}

export interface NeverKeyword {
  kind: 129
}

export interface TypeReference {
  kind: 157,
  typeName: Identifier,
  typeArguments?: Array<Type>
}

export interface UnionType {
  kind: 164,
  types: Array<Type>
}

export interface StringLiteral {
  kind: 9,
  text: string
}

export interface FirstLiteralToken {
  kind: 8,
  text: string
}

export interface TrueKeyword {
  kind: 100
}

export const trueKeyword: TrueKeyword = {
  kind: 100
}

export interface FalseKeyword {
  kind: 85
}

export const falseKeyword: FalseKeyword = {
  kind: 85
}

export type Literal =
 | StringLiteral
 | FirstLiteralToken
 | TrueKeyword
 | FalseKeyword

export interface LastTypeNode {
  kind: 171,
  literal: Literal
}

export type TypeKeyword =
  | StringKeyword
  | NumberKeyword
  | BooleanKeyword
  | NullKeyword
  | UndefinedKeyword
  | VoidKeyword
  | AnyKeyword
  | NeverKeyword

export type Type =
  | TypeKeyword
  | TypeLiteral
  | TypeReference
  | UnionType
  | LastTypeNode

export interface MultiLineCommentTrivia {
  kind: 3,
  type: 'MultiLineCommentTrivia',
  hasTrailingNewLine: boolean,
  text: string
}

export interface QuestionToken {
  kind: 54
}

export const questionToken: QuestionToken = {
  kind: 54
}

export interface PropertySignature {
  kind: 146,
  name: Identifier,
  type: Type,
  questionToken?: QuestionToken
  leadingComments?: Array<MultiLineCommentTrivia>
}

export interface TypeLiteral {
  kind: 161,
  members: Array<PropertySignature>
}

export interface TypeAliasDeclaration {
  kind: 228,
  name: Identifier,
  type: Type
}

export interface InterfaceDeclaration {
  kind: 227,
  name: Identifier,
  members: Array<PropertySignature>
}

export function identifier(text: string): Identifier {
  return {
    kind: 70,
    text
  }
}

export const stringKeyword: StringKeyword = {
  kind: 134
}

export const numberKeyword: NumberKeyword = {
  kind: 133
}

export const undefinedKeyword: UndefinedKeyword = {
  kind: 137
}

// TODO others keywords

export function typeReference(typeName: Identifier, typeArguments?: Array<Type>): TypeReference {
  return {
    kind: 157,
    typeName,
    typeArguments
  }
}

export function multiLineCommentTrivia(text: string, hasTrailingNewLine: boolean): MultiLineCommentTrivia {
  return {
    kind: 3,
    type: 'MultiLineCommentTrivia',
    hasTrailingNewLine,
    text
  }
}

export function propertySignature(name: Identifier, type: Type, questionToken?: QuestionToken, leadingComments?: Array<MultiLineCommentTrivia>): PropertySignature {
  return {
    kind: 146,
    name,
    type,
    questionToken,
    leadingComments
  }
}

export function typeLiteral(members: Array<PropertySignature>): TypeLiteral {
  return {
    kind: 161,
    members
  }
}

export function typeAliasDeclaration(name: Identifier, type: Type): TypeAliasDeclaration {
  return {
    kind: 228,
    name,
    type
  }
}

export function interfaceDeclaration(name: Identifier, members: Array<PropertySignature>): InterfaceDeclaration {
  return {
    kind: 227,
    name,
    members
  }
}

export function unionType(types: Array<Type>): UnionType {
  return {
    kind: 164,
    types
  }
}

export function firstLiteralToken(text: string): FirstLiteralToken {
  return {
    kind: 8,
    text
  }
}

export function lastTypeNode(literal: Literal): LastTypeNode {
  return {
    kind: 171,
    literal
  }
}

export function stringLiteral(text: string): StringLiteral {
  return {
    kind: 9,
    text
  }
}
