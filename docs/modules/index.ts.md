---
title: index.ts
nav_order: 1
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [ArrayCombinator (interface)](#arraycombinator-interface)
- [BooleanType (interface)](#booleantype-interface)
- [BrandCombinator (interface)](#brandcombinator-interface)
- [CustomCombinator (interface)](#customcombinator-interface)
- [CustomTypeDeclaration (interface)](#customtypedeclaration-interface)
- [DictionaryCombinator (interface)](#dictionarycombinator-interface)
- [ExactCombinator (interface)](#exactcombinator-interface)
- [FunctionType (interface)](#functiontype-interface)
- [Identifier (interface)](#identifier-interface)
- [IntType (interface)](#inttype-interface)
- [~~IntegerType~~ (interface)](#integertype-interface)
- [InterfaceCombinator (interface)](#interfacecombinator-interface)
- [IntersectionCombinator (interface)](#intersectioncombinator-interface)
- [KeyofCombinator (interface)](#keyofcombinator-interface)
- [LiteralCombinator (interface)](#literalcombinator-interface)
- [NullType (interface)](#nulltype-interface)
- [NumberType (interface)](#numbertype-interface)
- [Optional (interface)](#optional-interface)
- [PartialCombinator (interface)](#partialcombinator-interface)
- [Property (interface)](#property-interface)
- [Readonly (interface)](#readonly-interface)
- [ReadonlyArrayCombinator (interface)](#readonlyarraycombinator-interface)
- [ReadonlyCombinator (interface)](#readonlycombinator-interface)
- [Recursion (interface)](#recursion-interface)
- [RecursiveCombinator (interface)](#recursivecombinator-interface)
- [StrictCombinator (interface)](#strictcombinator-interface)
- [StringType (interface)](#stringtype-interface)
- [TaggedUnionCombinator (interface)](#taggedunioncombinator-interface)
- [TupleCombinator (interface)](#tuplecombinator-interface)
- [TypeDeclaration (interface)](#typedeclaration-interface)
- [UndefinedType (interface)](#undefinedtype-interface)
- [UnionCombinator (interface)](#unioncombinator-interface)
- [UnknownArrayType (interface)](#unknownarraytype-interface)
- [UnknownRecordType (interface)](#unknownrecordtype-interface)
- [UnknownType (interface)](#unknowntype-interface)
- [BasicType (type alias)](#basictype-type-alias)
- [Combinator (type alias)](#combinator-type-alias)
- [Graph (type alias)](#graph-type-alias)
- [Node (type alias)](#node-type-alias)
- [TypeReference (type alias)](#typereference-type-alias)
- [Vertex (class)](#vertex-class)
- [booleanType (constant)](#booleantype-constant)
- [~~dictionaryCombinator~~ (constant)](#dictionarycombinator-constant)
- [functionType (constant)](#functiontype-constant)
- [intType (constant)](#inttype-constant)
- [~~integerType~~ (constant)](#integertype-constant)
- [~~interfaceCombinator~~ (constant)](#interfacecombinator-constant)
- [nullType (constant)](#nulltype-constant)
- [numberType (constant)](#numbertype-constant)
- [stringType (constant)](#stringtype-constant)
- [undefinedType (constant)](#undefinedtype-constant)
- [unknownArrayType (constant)](#unknownarraytype-constant)
- [unknownRecordType (constant)](#unknownrecordtype-constant)
- [unknownType (constant)](#unknowntype-constant)
- [arrayCombinator (function)](#arraycombinator-function)
- [brandCombinator (function)](#brandcombinator-function)
- [customCombinator (function)](#customcombinator-function)
- [customTypeDeclaration (function)](#customtypedeclaration-function)
- [exactCombinator (function)](#exactcombinator-function)
- [forceTypeCombinator (function)](#forcetypecombinator-function)
- [getNodeDependencies (function)](#getnodedependencies-function)
- [getRecursiveTypeDeclaration (function)](#getrecursivetypedeclaration-function)
- [getTypeDeclarationGraph (function)](#gettypedeclarationgraph-function)
- [getTypeDeclarationMap (function)](#gettypedeclarationmap-function)
- [identifier (function)](#identifier-function)
- [intersectionCombinator (function)](#intersectioncombinator-function)
- [keyofCombinator (function)](#keyofcombinator-function)
- [literalCombinator (function)](#literalcombinator-function)
- [partialCombinator (function)](#partialcombinator-function)
- [printRuntime (function)](#printruntime-function)
- [printStatic (function)](#printstatic-function)
- [property (function)](#property-function)
- [readonlyArrayCombinator (function)](#readonlyarraycombinator-function)
- [readonlyCombinator (function)](#readonlycombinator-function)
- [recordCombinator (function)](#recordcombinator-function)
- [recursiveCombinator (function)](#recursivecombinator-function)
- [sort (function)](#sort-function)
- [strictCombinator (function)](#strictcombinator-function)
- [taggedUnionCombinator (function)](#taggedunioncombinator-function)
- [tsort (function)](#tsort-function)
- [tupleCombinator (function)](#tuplecombinator-function)
- [typeCombinator (function)](#typecombinator-function)
- [typeDeclaration (function)](#typedeclaration-function)
- [unionCombinator (function)](#unioncombinator-function)

---

# ArrayCombinator (interface)

**Signature**

```ts
export interface ArrayCombinator {
  kind: 'ArrayCombinator'
  type: TypeReference
  name?: string
}
```

# BooleanType (interface)

**Signature**

```ts
export interface BooleanType {
  kind: 'BooleanType'
  name: 'boolean'
}
```

# BrandCombinator (interface)

**Signature**

```ts
export interface BrandCombinator {
  kind: 'BrandCombinator'
  type: TypeReference
  predicate: (variableName: string) => string
  name: string
}
```

# CustomCombinator (interface)

**Signature**

```ts
export interface CustomCombinator {
  kind: 'CustomCombinator'
  static: string
  runtime: string
  dependencies: Array<string>
}
```

# CustomTypeDeclaration (interface)

**Signature**

```ts
export interface CustomTypeDeclaration {
  kind: 'CustomTypeDeclaration'
  name: string
  static: string
  runtime: string
  dependencies: Array<string>
}
```

# DictionaryCombinator (interface)

**Signature**

```ts
export interface DictionaryCombinator {
  kind: 'DictionaryCombinator'
  domain: TypeReference
  codomain: TypeReference
  name?: string
}
```

# ExactCombinator (interface)

**Signature**

```ts
export interface ExactCombinator {
  kind: 'ExactCombinator'
  type: TypeReference
  name?: string
}
```

# FunctionType (interface)

**Signature**

```ts
export interface FunctionType {
  kind: 'FunctionType'
  name: 'Function'
}
```

# Identifier (interface)

**Signature**

```ts
export interface Identifier {
  kind: 'Identifier'
  name: string
}
```

# IntType (interface)

**Signature**

```ts
export interface IntType {
  kind: 'IntType'
  name: 'Int'
}
```

# ~~IntegerType~~ (interface)

**Signature**

```ts
export interface IntegerType {
  kind: 'IntegerType'
  name: 'Integer'
}
```

# InterfaceCombinator (interface)

**Signature**

```ts
export interface InterfaceCombinator {
  kind: 'InterfaceCombinator'
  properties: Array<Property>
  name?: string
  forceType?: boolean
}
```

# IntersectionCombinator (interface)

**Signature**

```ts
export interface IntersectionCombinator {
  kind: 'IntersectionCombinator'
  types: Array<TypeReference>
  name?: string
}
```

# KeyofCombinator (interface)

**Signature**

```ts
export interface KeyofCombinator {
  kind: 'KeyofCombinator'
  values: Array<string>
  name?: string
}
```

# LiteralCombinator (interface)

**Signature**

```ts
export interface LiteralCombinator {
  kind: 'LiteralCombinator'
  value: string | number | boolean
  name?: string
}
```

# NullType (interface)

**Signature**

```ts
export interface NullType {
  kind: 'NullType'
  name: 'null'
}
```

# NumberType (interface)

**Signature**

```ts
export interface NumberType {
  kind: 'NumberType'
  name: 'number'
}
```

# Optional (interface)

**Signature**

```ts
export interface Optional {
  isOptional: boolean
}
```

# PartialCombinator (interface)

**Signature**

```ts
export interface PartialCombinator {
  kind: 'PartialCombinator'
  properties: Array<Property>
  name?: string
  forceType?: boolean
}
```

# Property (interface)

**Signature**

```ts
export interface Property extends Optional {
  kind: 'Property'
  key: string
  type: TypeReference
  description?: string
}
```

# Readonly (interface)

**Signature**

```ts
export interface Readonly {
  isReadonly: boolean
}
```

# ReadonlyArrayCombinator (interface)

**Signature**

```ts
export interface ReadonlyArrayCombinator {
  kind: 'ReadonlyArrayCombinator'
  type: TypeReference
  name?: string
}
```

# ReadonlyCombinator (interface)

**Signature**

```ts
export interface ReadonlyCombinator {
  kind: 'ReadonlyCombinator'
  type: TypeReference
  name?: string
}
```

# Recursion (interface)

**Signature**

```ts
export interface Recursion {
  name: string
  output: boolean
}
```

# RecursiveCombinator (interface)

**Signature**

```ts
export interface RecursiveCombinator {
  kind: 'RecursiveCombinator'
  typeParameter: Identifier
  name: string
  type: TypeReference
}
```

# StrictCombinator (interface)

**Signature**

```ts
export interface StrictCombinator {
  kind: 'StrictCombinator'
  properties: Array<Property>
  name?: string
  forceType?: boolean
}
```

# StringType (interface)

**Signature**

```ts
export interface StringType {
  kind: 'StringType'
  name: 'string'
}
```

# TaggedUnionCombinator (interface)

**Signature**

```ts
export interface TaggedUnionCombinator {
  kind: 'TaggedUnionCombinator'
  tag: string
  types: Array<TypeReference>
  name?: string
}
```

# TupleCombinator (interface)

**Signature**

```ts
export interface TupleCombinator {
  kind: 'TupleCombinator'
  types: Array<TypeReference>
  name?: string
}
```

# TypeDeclaration (interface)

**Signature**

```ts
export interface TypeDeclaration extends Readonly {
  kind: 'TypeDeclaration'
  name: string
  type: TypeReference
  isExported: boolean
  description?: string
}
```

# UndefinedType (interface)

**Signature**

```ts
export interface UndefinedType {
  kind: 'UndefinedType'
  name: 'undefined'
}
```

# UnionCombinator (interface)

**Signature**

```ts
export interface UnionCombinator {
  kind: 'UnionCombinator'
  types: Array<TypeReference>
  name?: string
}
```

# UnknownArrayType (interface)

**Signature**

```ts
export interface UnknownArrayType {
  kind: 'AnyArrayType'
  name: 'UnknownArray'
}
```

# UnknownRecordType (interface)

**Signature**

```ts
export interface UnknownRecordType {
  kind: 'AnyDictionaryType'
  name: 'UnknownRecord'
}
```

# UnknownType (interface)

**Signature**

```ts
export interface UnknownType {
  kind: 'UnknownType'
  name: 'unknown'
}
```

# BasicType (type alias)

**Signature**

```ts
export type BasicType =
  | StringType
  | NumberType
  | BooleanType
  | NullType
  | UndefinedType
  // tslint:disable-next-line: deprecation
  | IntegerType
  | IntType
  | UnknownArrayType
  | UnknownRecordType
  | FunctionType
  | UnknownType
```

# Combinator (type alias)

**Signature**

```ts
export type Combinator =
  | InterfaceCombinator
  | UnionCombinator
  | LiteralCombinator
  | IntersectionCombinator
  | KeyofCombinator
  | ArrayCombinator
  | ReadonlyArrayCombinator
  | TupleCombinator
  | RecursiveCombinator
  | DictionaryCombinator
  | PartialCombinator
  | TaggedUnionCombinator
  | CustomCombinator
  | ExactCombinator
  | StrictCombinator
  | ReadonlyCombinator
  | BrandCombinator
```

# Graph (type alias)

**Signature**

```ts
export type Graph = { [key: string]: Vertex }
```

# Node (type alias)

**Signature**

```ts
export type Node = TypeReference | TypeDeclaration | CustomTypeDeclaration
```

# TypeReference (type alias)

**Signature**

```ts
export type TypeReference = BasicType | Combinator | Identifier
```

# Vertex (class)

**Signature**

```ts
export class Vertex {
  constructor(public id: string) { ... }
  ...
}
```

# booleanType (constant)

**Signature**

```ts
export const booleanType: BooleanType = ...
```

# ~~dictionaryCombinator~~ (constant)

Use `recordCombinator` instead

**Signature**

```ts
export const dictionaryCombinator = ...
```

# functionType (constant)

**Signature**

```ts
export const functionType: FunctionType = ...
```

# intType (constant)

**Signature**

```ts
export const intType: IntType = ...
```

# ~~integerType~~ (constant)

**Signature**

```ts
export const integerType: IntegerType = ...
```

# ~~interfaceCombinator~~ (constant)

Use `typeCombinator` instead

**Signature**

```ts
export const interfaceCombinator = ...
```

# nullType (constant)

**Signature**

```ts
export const nullType: NullType = ...
```

# numberType (constant)

**Signature**

```ts
export const numberType: NumberType = ...
```

# stringType (constant)

**Signature**

```ts
export const stringType: StringType = ...
```

# undefinedType (constant)

**Signature**

```ts
export const undefinedType: UndefinedType = ...
```

# unknownArrayType (constant)

**Signature**

```ts
export const unknownArrayType: UnknownArrayType = ...
```

# unknownRecordType (constant)

**Signature**

```ts
export const unknownRecordType: UnknownRecordType = ...
```

# unknownType (constant)

**Signature**

```ts
export const unknownType: UnknownType = ...
```

# arrayCombinator (function)

**Signature**

```ts
export function arrayCombinator(type: TypeReference, name?: string): ArrayCombinator { ... }
```

# brandCombinator (function)

**Signature**

```ts
export function brandCombinator(
  type: TypeReference,
  predicate: (variableName: string) => string,
  name: string
): BrandCombinator { ... }
```

# customCombinator (function)

**Signature**

```ts
export function customCombinator(
  staticRepr: string,
  runtimeRepr: string,
  dependencies: Array<string> = []
): CustomCombinator { ... }
```

# customTypeDeclaration (function)

**Signature**

```ts
export function customTypeDeclaration(
  name: string,
  staticRepr: string,
  runtimeRepr: string,
  dependencies: Array<string> = []
): CustomTypeDeclaration { ... }
```

# exactCombinator (function)

**Signature**

```ts
export function exactCombinator(type: TypeReference, name?: string): ExactCombinator { ... }
```

# forceTypeCombinator (function)

**Signature**

```ts
export function forceTypeCombinator<T extends InterfaceCombinator | StrictCombinator | PartialCombinator>(
  combinator: T
): T { ... }
```

# getNodeDependencies (function)

**Signature**

```ts
export const getNodeDependencies = (node: Node): Array<string> => ...
```

# getRecursiveTypeDeclaration (function)

**Signature**

```ts
export function getRecursiveTypeDeclaration(declaration: TypeDeclaration): TypeDeclaration { ... }
```

# getTypeDeclarationGraph (function)

**Signature**

```ts
export function getTypeDeclarationGraph(declarations: Array<TypeDeclaration | CustomTypeDeclaration>): Graph { ... }
```

# getTypeDeclarationMap (function)

**Signature**

```ts
export function getTypeDeclarationMap(
  declarations: Array<TypeDeclaration | CustomTypeDeclaration>
): { [key: string]: TypeDeclaration | CustomTypeDeclaration } { ... }
```

# identifier (function)

**Signature**

```ts
export function identifier(name: string): Identifier { ... }
```

# intersectionCombinator (function)

**Signature**

```ts
export function intersectionCombinator(types: Array<TypeReference>, name?: string): IntersectionCombinator { ... }
```

# keyofCombinator (function)

**Signature**

```ts
export function keyofCombinator(values: Array<string>, name?: string): KeyofCombinator { ... }
```

# literalCombinator (function)

**Signature**

```ts
export function literalCombinator(value: string | boolean | number, name?: string): LiteralCombinator { ... }
```

# partialCombinator (function)

**Signature**

```ts
export function partialCombinator(properties: Array<Property>, name?: string): PartialCombinator { ... }
```

# printRuntime (function)

**Signature**

```ts
export function printRuntime(node: Node, i: number = 0): string { ... }
```

# printStatic (function)

**Signature**

```ts
export function printStatic(node: Node, i: number = 0, recursion?: Recursion): string { ... }
```

# property (function)

**Signature**

```ts
export function property(
  key: string,
  type: TypeReference,
  isOptional: boolean = false,
  description?: string
): Property { ... }
```

# readonlyArrayCombinator (function)

**Signature**

```ts
export function readonlyArrayCombinator(type: TypeReference, name?: string): ReadonlyArrayCombinator { ... }
```

# readonlyCombinator (function)

**Signature**

```ts
export function readonlyCombinator(type: TypeReference, name?: string): ReadonlyCombinator { ... }
```

# recordCombinator (function)

**Signature**

```ts
export function recordCombinator(domain: TypeReference, codomain: TypeReference, name?: string): DictionaryCombinator { ... }
```

# recursiveCombinator (function)

**Signature**

```ts
export function recursiveCombinator(typeParameter: Identifier, name: string, type: TypeReference): RecursiveCombinator { ... }
```

# sort (function)

**Signature**

```ts
export function sort(
  declarations: Array<TypeDeclaration | CustomTypeDeclaration>
): Array<TypeDeclaration | CustomTypeDeclaration> { ... }
```

# strictCombinator (function)

**Signature**

```ts
export function strictCombinator(properties: Array<Property>, name?: string): StrictCombinator { ... }
```

# taggedUnionCombinator (function)

**Signature**

```ts
export function taggedUnionCombinator(tag: string, types: Array<TypeReference>, name?: string): TaggedUnionCombinator { ... }
```

# tsort (function)

topological sort

**Signature**

```ts
export function tsort(graph: Graph): { sorted: Array<string>; recursive: { [key: string]: true } } { ... }
```

# tupleCombinator (function)

**Signature**

```ts
export function tupleCombinator(types: Array<TypeReference>, name?: string): TupleCombinator { ... }
```

# typeCombinator (function)

**Signature**

```ts
export function typeCombinator(properties: Array<Property>, name?: string): InterfaceCombinator { ... }
```

# typeDeclaration (function)

**Signature**

```ts
export function typeDeclaration(
  name: string,
  type: TypeReference,
  isExported: boolean = false,
  /** @deprecated */
  isReadonly: boolean = false,
  description?: string
): TypeDeclaration { ... }
```

# unionCombinator (function)

**Signature**

```ts
export function unionCombinator(types: Array<TypeReference>, name?: string): UnionCombinator { ... }
```
