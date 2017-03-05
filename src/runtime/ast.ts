export interface RuntimeType {
  kind: string,
  name: string
}

export interface StringType extends RuntimeType {
  kind: 'StringType',
  name: 'string'
}

export interface UndefinedType extends RuntimeType {
  kind: 'UndefinedType',
  name: 'undefined'
}

export const stringType: StringType = {
  kind: 'StringType',
  name: 'string'
}

export interface NumberType extends RuntimeType {
  kind: 'NumberType',
  name: 'number'
}

export const numberType: NumberType = {
  kind: 'NumberType',
  name: 'number'
}

export interface BooleanType extends RuntimeType {
  kind: 'BooleanType',
  name: 'boolean'
}

export const booleanType: BooleanType = {
  kind: 'BooleanType',
  name: 'boolean'
}

export const undefinedType: UndefinedType = {
  kind: 'UndefinedType',
  name: 'undefined'
}

// TODO others builtin types

export interface BaseCombinator {
  kind: string,
  name?: string
}

export interface LiteralCombinator extends BaseCombinator {
  kind: 'LiteralCombinator',
  value: string | boolean | number
}

export type BuiltinType =
  | StringType
  | NumberType
  | BooleanType
  | UndefinedType

export interface Identifier {
  kind: 'Identifier',
  name: string
}

export type Type = Identifier | BuiltinType | Combinator

export interface Prop {
  kind: 'Prop',
  name: string,
  type: Type,
  description?: string
}

export interface InterfaceCombinator extends BaseCombinator {
  kind: 'InterfaceCombinator',
  props: Array<Prop>
}

export interface ReadonlyCombinator extends BaseCombinator {
  kind: 'ReadonlyCombinator',
  type: Type
}

export interface ArrayCombinator extends BaseCombinator {
  kind: 'ArrayCombinator',
  type: Type
}

export interface UnionCombinator extends BaseCombinator {
  kind: 'UnionCombinator',
  types: Array<Type>
}

export interface IntersectionCombinator extends BaseCombinator {
  kind: 'IntersectionCombinator',
  types: Array<Type>
}

export interface TupleCombinator extends BaseCombinator {
  kind: 'TupleCombinator',
  types: Array<Type>
}

export interface KeyofCombinator extends BaseCombinator {
  kind: 'KeyofCombinator',
  values: Array<string>
}

export interface RecursionCombinator extends BaseCombinator {
  kind: 'RecursionCombinator',
  typeParameter: string,
  name: string,
  declaration: Combinator
}

export type Combinator =
  | LiteralCombinator
  | InterfaceCombinator
  | ReadonlyCombinator
  | ArrayCombinator
  | UnionCombinator
  | IntersectionCombinator
  | TupleCombinator
  | KeyofCombinator
  | RecursionCombinator

export interface CombinatorDeclaration {
  kind: 'CombinatorDeclaration',
  name: string,
  combinator: Combinator
}

export function identifier(name: string): Identifier {
  return {
    kind: 'Identifier',
    name
  }
}

export function literalCombinator(value: string | boolean | number, name?: string): LiteralCombinator {
  return {
    kind: 'LiteralCombinator',
    value,
    name
  }
}

export function prop(name: string, type: Type, description?: string): Prop {
  return {
    kind: 'Prop',
    name,
    type,
    description
  }
}

export function interfaceCombinator(props: Array<Prop>, name?: string): InterfaceCombinator {
  return {
    kind: 'InterfaceCombinator',
    props,
    name
  }
}

export function readonlyCombinator(type: Type, name?: string): ReadonlyCombinator {
  return {
    kind: 'ReadonlyCombinator',
    type,
    name
  }
}

export function arrayCombinator(type: Type, name?: string): ArrayCombinator {
  return {
    kind: 'ArrayCombinator',
    type,
    name
  }
}

export function unionCombinator(types: Array<Type>, name?: string): UnionCombinator {
  return {
    kind: 'UnionCombinator',
    types,
    name
  }
}

export function intersectionCombinator(types: Array<Type>, name?: string): IntersectionCombinator {
  return {
    kind: 'IntersectionCombinator',
    types,
    name
  }
}

export function tupleCombinator(types: Array<Type>, name?: string): TupleCombinator {
  return {
    kind: 'TupleCombinator',
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

export function recursionCombinator(typeParameter: string, name: string, declaration: Combinator): RecursionCombinator {
  return {
    kind: 'RecursionCombinator',
    typeParameter,
    name,
    declaration
  }
}

export function combinatorDeclaration(name: string, combinator: Combinator): CombinatorDeclaration {
  return {
    kind: 'CombinatorDeclaration',
    name,
    combinator
  }
}
