export interface StringType {
  kind: 'StringType'
  name: 'string'
}

export interface NumberType {
  kind: 'NumberType'
  name: 'number'
}

export interface IntegerType {
  kind: 'IntegerType'
  name: 'Integer'
}

export interface BooleanType {
  kind: 'BooleanType'
  name: 'boolean'
}

export interface NullType {
  kind: 'NullType'
  name: 'null'
}

export interface UndefinedType {
  kind: 'UndefinedType'
  name: 'undefined'
}

export interface AnyType {
  kind: 'AnyType'
  name: 'any'
}

export interface ObjectType {
  kind: 'ObjectType'
  name: 'object'
}


export interface Readonly {
  isReadonly: boolean
}

export interface Optional {
  isOptional: boolean
}

export interface Property extends Optional {
  kind: 'Property'
  key: string
  type: TypeReference
  description?: string
}

export interface LiteralCombinator {
  kind: 'LiteralCombinator'
  value: string | number | boolean
  name?: string
}

export interface InterfaceCombinator {
  kind: 'InterfaceCombinator'
  properties: Array<Property>
  name?: string
}

export interface PartialCombinator {
  kind: 'PartialCombinator'
  properties: Array<Property>
  name?: string
}

export interface StrictCombinator {
  kind: 'StrictCombinator'
  properties: Array<Property>
  name?: string
}

export interface UnionCombinator {
  kind: 'UnionCombinator'
  types: Array<TypeReference>
  name?: string
}

export interface TaggedUnionCombinator {
  kind: 'TaggedUnionCombinator'
  tag: string
  types: Array<TypeReference>
  name?: string
}

export interface IntersectionCombinator {
  kind: 'IntersectionCombinator'
  types: Array<TypeReference>
  name?: string
}

export interface KeyofCombinator {
  kind: 'KeyofCombinator'
  values: Array<string>
  name?: string
}

export interface ArrayCombinator {
  kind: 'ArrayCombinator'
  type: TypeReference
  name?: string
}

export interface ReadonlyArrayCombinator {
  kind: 'ReadonlyArrayCombinator'
  type: TypeReference
  name?: string
}

export interface DictionaryCombinator {
  kind: 'DictionaryCombinator'
  domain: TypeReference
  codomain: TypeReference
  name?: string
}

export interface TupleCombinator {
  kind: 'TupleCombinator'
  types: Array<TypeReference>
  name?: string
}

export interface RecursiveCombinator {
  kind: 'RecursiveCombinator'
  typeParameter: Identifier
  name: string
  type: TypeReference
}

export type Combinator =
  | InterfaceCombinator
  | UnionCombinator
  | LiteralCombinator
  | IntersectionCombinator
  | StrictCombinator
  | KeyofCombinator
  | ArrayCombinator
  | ReadonlyArrayCombinator
  | TupleCombinator
  | RecursiveCombinator
  | DictionaryCombinator
  | PartialCombinator
  | TaggedUnionCombinator

export interface Identifier {
  kind: 'Identifier'
  name: string
}

export type BasicType = StringType | NumberType | BooleanType | NullType | UndefinedType | IntegerType | AnyType | ObjectType

export type TypeReference = BasicType | Combinator | Identifier

export interface TypeDeclaration extends Readonly {
  kind: 'TypeDeclaration'
  name: string
  type: TypeReference
  isExported: boolean
}

export type Node = TypeReference | TypeDeclaration

export const stringType: StringType = {
  kind: 'StringType',
  name: 'string'
}

export const numberType: NumberType = {
  kind: 'NumberType',
  name: 'number'
}

export const integerType: IntegerType = {
  kind: 'IntegerType',
  name: 'Integer'
}

export const booleanType: BooleanType = {
  kind: 'BooleanType',
  name: 'boolean'
}

export const nullType: NullType = {
  kind: 'NullType',
  name: 'null'
}

export const undefinedType: UndefinedType = {
  kind: 'UndefinedType',
  name: 'undefined'
}

export const anyType: AnyType = {
  kind: 'AnyType',
  name: 'any'
}

export const objectType: ObjectType = {
  kind: 'ObjectType',
  name: 'object'
}


export function identifier(name: string): Identifier {
  return {
    kind: 'Identifier',
    name
  }
}

export function property(
  key: string,
  type: TypeReference,
  isOptional: boolean = false,
  description?: string
): Property {
  return {
    kind: 'Property',
    key,
    type,
    isOptional,
    description
  }
}

export function literalCombinator(value: string | boolean | number, name?: string): LiteralCombinator {
  return {
    kind: 'LiteralCombinator',
    value,
    name
  }
}

export function partialCombinator(properties: Array<Property>, name?: string): PartialCombinator {
  return {
    kind: 'PartialCombinator',
    properties,
    name
  }
}

export function interfaceCombinator(properties: Array<Property>, name?: string): InterfaceCombinator {
  return {
    kind: 'InterfaceCombinator',
    properties,
    name
  }
}

export function strictCombinator(properties: Array<Property>, name?: string): StrictCombinator {
  return {
    kind: 'StrictCombinator',
    properties,
    name
  }
}

export function unionCombinator(types: Array<TypeReference>, name?: string): UnionCombinator {
  return {
    kind: 'UnionCombinator',
    types,
    name
  }
}

export function taggedUnionCombinator(tag: string, types: Array<TypeReference>, name?: string): TaggedUnionCombinator {
  return {
    kind: 'TaggedUnionCombinator',
    tag,
    types,
    name
  }
}

export function intersectionCombinator(types: Array<TypeReference>, name?: string): IntersectionCombinator {
  return {
    kind: 'IntersectionCombinator',
    types,
    name
  }
}

export function keyofCombinator(values: Array<string>, name?: string): KeyofCombinator {
  return {
    kind: 'KeyofCombinator',
    values,
    name
  }
}

export function arrayCombinator(type: TypeReference, name?: string): ArrayCombinator {
  return {
    kind: 'ArrayCombinator',
    type,
    name
  }
}

export function readonlyArrayCombinator(type: TypeReference, name?: string): ReadonlyArrayCombinator {
  return {
    kind: 'ReadonlyArrayCombinator',
    type,
    name
  }
}

export function tupleCombinator(types: Array<TypeReference>, name?: string): TupleCombinator {
  return {
    kind: 'TupleCombinator',
    types,
    name
  }
}

export function recursiveCombinator(typeParameter: Identifier, name: string, type: TypeReference): RecursiveCombinator {
  return {
    kind: 'RecursiveCombinator',
    typeParameter,
    name,
    type
  }
}

export function dictionaryCombinator(
  domain: TypeReference,
  codomain: TypeReference,
  name?: string
): DictionaryCombinator {
  return {
    kind: 'DictionaryCombinator',
    domain,
    codomain,
    name
  }
}

export function typeDeclaration(
  name: string,
  type: TypeReference,
  isExported: boolean = false,
  isReadonly: boolean = false
): TypeDeclaration {
  return {
    kind: 'TypeDeclaration',
    name,
    type,
    isExported,
    isReadonly
  }
}

export function getTypeDeclarationMap(declarations: Array<TypeDeclaration>): { [key: string]: TypeDeclaration } {
  const map: { [key: string]: TypeDeclaration } = {}
  declarations.forEach(d => {
    map[d.name] = d
  })
  return map
}

const indentations: { [key: number]: string } = {
  1: '  ',
  2: '    ',
  3: '      ',
  4: '        ',
  5: '          ',
  6: '            ',
  7: '              ',
  8: '                ',
  9: '                  '
}

export function indent(i: number): string {
  if (i === 0) {
    return ''
  }
  return indentations[i] || new Array(i).join(`  `)
}

export function escapeString(s: string): string {
  return "'" + s.replace(/'/g, "\\'") + "'"
}

function isValidPropertyKey(s: string): boolean {
  return /[-\/\s]/.exec(s) === null
}

function escapePropertyKey(key: string): string {
  return isValidPropertyKey(key) ? key : escapeString(key)
}


function printDescription(description: string | undefined, i: number): string {
  if (description) {
    return `${indent(i)}/** ${description} */\n`
  }
  return ''
}


export {
  printDescription,
  escapePropertyKey,
}