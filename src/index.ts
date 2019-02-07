export interface StringType {
  kind: 'StringType'
  name: 'string'
}

export interface NumberType {
  kind: 'NumberType'
  name: 'number'
}

/**
 * @deprecated
 */
export interface IntegerType {
  kind: 'IntegerType'
  name: 'Integer'
}

export interface IntType {
  kind: 'IntType'
  name: 'Int'
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

export interface UnknownType {
  kind: 'UnknownType'
  name: 'unknown'
}

export interface UnknownArrayType {
  kind: 'AnyArrayType'
  name: 'UnknownArray'
}

export interface UnknownRecordType {
  kind: 'AnyDictionaryType'
  name: 'UnknownRecord'
}

export interface FunctionType {
  kind: 'FunctionType'
  name: 'Function'
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

export interface Identifier {
  kind: 'Identifier'
  name: string
}

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

export type TypeReference = BasicType | Combinator | Identifier

export interface TypeDeclaration extends Readonly {
  kind: 'TypeDeclaration'
  name: string
  type: TypeReference
  isExported: boolean
}

export interface CustomTypeDeclaration {
  kind: 'CustomTypeDeclaration'
  name: string
  static: string
  runtime: string
  dependencies: Array<string>
}

export interface CustomCombinator {
  kind: 'CustomCombinator'
  static: string
  runtime: string
  dependencies: Array<string>
}

export interface ExactCombinator {
  kind: 'ExactCombinator'
  type: TypeReference
  name?: string
}

export interface StrictCombinator {
  kind: 'StrictCombinator'
  properties: Array<Property>
  name?: string
}

export interface ReadonlyCombinator {
  kind: 'ReadonlyCombinator'
  type: TypeReference
  name?: string
}

export type Node = TypeReference | TypeDeclaration | CustomTypeDeclaration

export const stringType: StringType = {
  kind: 'StringType',
  name: 'string'
}

export const numberType: NumberType = {
  kind: 'NumberType',
  name: 'number'
}

/**
 * @deprecated
 */
// tslint:disable-next-line: deprecation
export const integerType: IntegerType = {
  kind: 'IntegerType',
  name: 'Integer'
}

export const intType: IntType = {
  kind: 'IntType',
  name: 'Int'
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

export const unknownType: UnknownType = {
  kind: 'UnknownType',
  name: 'unknown'
}
export const unknownArrayType: UnknownArrayType = {
  kind: 'AnyArrayType',
  name: 'UnknownArray'
}

export const unknownRecordType: UnknownRecordType = {
  kind: 'AnyDictionaryType',
  name: 'UnknownRecord'
}

export const functionType: FunctionType = {
  kind: 'FunctionType',
  name: 'Function'
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

export function typeCombinator(properties: Array<Property>, name?: string): InterfaceCombinator {
  return {
    kind: 'InterfaceCombinator',
    properties,
    name
  }
}

/**
 * Use `typeCombinator` instead
 * @deprecated
 */
export const interfaceCombinator = typeCombinator

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

export function recordCombinator(domain: TypeReference, codomain: TypeReference, name?: string): DictionaryCombinator {
  return {
    kind: 'DictionaryCombinator',
    domain,
    codomain,
    name
  }
}

/**
 * Use `recordCombinator` instead
 * @deprecated
 */
export const dictionaryCombinator = recordCombinator

export function typeDeclaration(
  name: string,
  type: TypeReference,
  isExported: boolean = false,
  /** @deprecated */
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

export function customTypeDeclaration(
  name: string,
  staticRepr: string,
  runtimeRepr: string,
  dependencies: Array<string> = []
): CustomTypeDeclaration {
  return {
    kind: 'CustomTypeDeclaration',
    name,
    static: staticRepr,
    runtime: runtimeRepr,
    dependencies
  }
}

export function customCombinator(
  staticRepr: string,
  runtimeRepr: string,
  dependencies: Array<string> = []
): CustomCombinator {
  return {
    kind: 'CustomCombinator',
    static: staticRepr,
    runtime: runtimeRepr,
    dependencies
  }
}

export function exactCombinator(type: TypeReference, name?: string): ExactCombinator {
  return {
    kind: 'ExactCombinator',
    type,
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

export function readonlyCombinator(type: TypeReference, name?: string): ReadonlyCombinator {
  return {
    kind: 'ReadonlyCombinator',
    type,
    name
  }
}

export class Vertex {
  public afters: Array<string> = []
  constructor(public id: string) {}
}

export type Graph = { [key: string]: Vertex }

/** topological sort */
export function tsort(graph: Graph): { sorted: Array<string>; recursive: { [key: string]: true } } {
  const sorted: Array<string> = []
  const visited: { [key: string]: true } = {}
  const recursive: { [key: string]: true } = {}

  Object.keys(graph).forEach(function visit(id, ancestors: any) {
    if (visited[id]) {
      return
    }
    if (!graph.hasOwnProperty(id)) {
      return
    }

    const vertex = graph[id]

    if (!Array.isArray(ancestors)) {
      ancestors = []
    }

    ancestors.push(id)
    visited[id] = true

    vertex.afters.forEach(afterId => {
      if (ancestors.indexOf(afterId) >= 0) {
        recursive[id] = true
        recursive[afterId] = true
      } else {
        visit(afterId, ancestors.slice())
      }
    })

    sorted.unshift(id)
  })

  return {
    sorted: sorted.filter(id => !recursive.hasOwnProperty(id)),
    recursive
  }
}

export function getTypeDeclarationMap(
  declarations: Array<TypeDeclaration | CustomTypeDeclaration>
): { [key: string]: TypeDeclaration | CustomTypeDeclaration } {
  const map: { [key: string]: TypeDeclaration | CustomTypeDeclaration } = {}
  declarations.forEach(d => {
    map[d.name] = d
  })
  return map
}

const flatten = <A>(aas: Array<Array<A>>): Array<A> => {
  const r: Array<A> = []
  aas.forEach(as => {
    r.push(...as)
  })
  return r
}

export const getNodeDependencies = (node: Node): Array<string> => {
  switch (node.kind) {
    case 'Identifier':
      return [node.name]
    case 'InterfaceCombinator':
    case 'StrictCombinator':
    case 'PartialCombinator':
      return flatten(node.properties.map(p => getNodeDependencies(p.type)))
    case 'TaggedUnionCombinator':
    case 'UnionCombinator':
    case 'IntersectionCombinator':
    case 'TupleCombinator':
      return flatten(node.types.map(type => getNodeDependencies(type)))
    case 'DictionaryCombinator':
      return getNodeDependencies(node.domain).concat(getNodeDependencies(node.codomain))
    case 'ArrayCombinator':
    case 'ReadonlyArrayCombinator':
    case 'TypeDeclaration':
    case 'RecursiveCombinator':
    case 'ExactCombinator':
    case 'ReadonlyCombinator':
      return getNodeDependencies(node.type)
    case 'CustomTypeDeclaration':
    case 'CustomCombinator':
      return node.dependencies
    case 'StringType':
    case 'NumberType':
    case 'BooleanType':
    case 'NullType':
    case 'UndefinedType':
    case 'IntegerType':
    case 'IntType':
    case 'AnyArrayType':
    case 'AnyDictionaryType':
    case 'FunctionType':
    case 'LiteralCombinator':
    case 'KeyofCombinator':
    case 'UnknownType':
      return []
  }
}

export function getTypeDeclarationGraph(declarations: Array<TypeDeclaration | CustomTypeDeclaration>): Graph {
  const graph: Graph = {}
  declarations.forEach(d => {
    const vertex = (graph[d.name] = new Vertex(d.name))
    vertex.afters.push(...getNodeDependencies(d))
  })
  return graph
}

function indent(n: number): string {
  let s = ''
  for (let i = 0; i < n; i++) {
    s += '  '
  }
  return s
}

function escapeString(s: string): string {
  return "'" + s.replace(/'/g, "\\'") + "'"
}

function isValidPropertyKey(s: string): boolean {
  return /[-\/\s\.\[\]]/.exec(s) === null
}

function addRuntimeName(s: string, name?: string): string {
  if (name) {
    return s + ', ' + escapeString(name)
  }
  return s
}

function escapePropertyKey(key: string): string {
  return isValidPropertyKey(key) ? key : escapeString(key)
}

function printRuntimeLiteralCombinator(literalCombinator: LiteralCombinator): string {
  const value =
    typeof literalCombinator.value === 'string' ? escapeString(literalCombinator.value) : literalCombinator.value
  let s = `t.literal(${value}`
  s = addRuntimeName(s, literalCombinator.name)
  s += ')'
  return s
}

function printDescription(description: string | undefined, i: number): string {
  if (description) {
    return `${indent(i)}/** ${description} */\n`
  }
  return ''
}

function printRuntimeProperty(p: Property, i: number): string {
  return `${printDescription(p.description, i)}${indent(i)}${escapePropertyKey(p.key)}: ${printRuntime(p.type, i)}`
}

function printRuntimeInterfaceCombinator(ic: InterfaceCombinator, i: number): string {
  let requiredProperties: Property[] = []
  let optionalProperties: Property[] = []
  ic.properties.forEach(p => (p.isOptional ? optionalProperties.push(p) : requiredProperties.push(p)))

  if (requiredProperties.length > 0 && optionalProperties.length > 0) {
    return printRuntimeIntersectionCombinator(
      intersectionCombinator([typeCombinator(requiredProperties), partialCombinator(optionalProperties)], ic.name),
      i
    )
  }

  if (optionalProperties.length > 0) {
    return printRuntimePartialCombinator(partialCombinator(optionalProperties, ic.name), i)
  }

  let s = 't.type({\n'
  s += ic.properties.map(p => printRuntimeProperty(p, i + 1)).join(',\n')
  s += `\n${indent(i)}}`
  s = addRuntimeName(s, ic.name)
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
  s += c.values.map(v => `${indentation}${escapePropertyKey(v)}: null`).join(',\n')
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

function printRuntimeExactCombinator(c: ExactCombinator, i: number): string {
  let s = `t.exact(${printRuntime(c.type, i)}`
  s = addRuntimeName(s, c.name)
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

function printRuntimeReadonlyCombinator(rc: ReadonlyCombinator, i: number): string {
  let s = `t.readonly(${printRuntime(rc.type, i)}`
  s = addRuntimeName(s, rc.name)
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
  const type = declaration.type
  const name = declaration.name
  let s = printRuntime(type, i)
  if (declaration.isReadonly) {
    s = `t.readonly(${s}, ${escapeString(name)})`
  }
  if (type.kind === 'RecursiveCombinator') {
    s = `const ${name}: t.RecursiveType<t.Type<${name}>> = ${s}`
  } else {
    s = `const ${name} = ${s}`
  }
  if (declaration.isExported) {
    s = `export ${s}`
  }
  return s
}

function printRuntimeRecursiveCombinator(c: RecursiveCombinator, i: number): string {
  let s = `t.recursion(${escapeString(c.name)}, () => ${printRuntime(c.type, i)})`
  return s
}

function printRuntimeDictionaryCombinator(c: DictionaryCombinator, i: number): string {
  let s = `t.record(${printRuntime(c.domain, i)}, ${printRuntime(c.codomain, i)}`
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
    case 'IntType':
    case 'AnyArrayType':
    case 'AnyDictionaryType':
    case 'FunctionType':
    case 'UnknownType':
      return `t.${node.name}`
    case 'LiteralCombinator':
      return printRuntimeLiteralCombinator(node)
    case 'InterfaceCombinator':
      return printRuntimeInterfaceCombinator(node, i)
    case 'PartialCombinator':
      return printRuntimePartialCombinator(node, i)
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
    case 'CustomTypeDeclaration':
    case 'CustomCombinator':
      return node.runtime
    case 'ExactCombinator':
      return printRuntimeExactCombinator(node, i)
    case 'StrictCombinator':
      return printRuntimeStrictCombinator(node, i)
    case 'ReadonlyCombinator':
      return printRuntimeReadonlyCombinator(node, i)
  }
}

export function getRecursiveTypeDeclaration(declaration: TypeDeclaration): TypeDeclaration {
  const name = declaration.name
  const recursive = recursiveCombinator(identifier(name), name, declaration.type)
  return typeDeclaration(name, recursive, declaration.isExported, declaration.isReadonly)
}

export function sort(
  declarations: Array<TypeDeclaration | CustomTypeDeclaration>
): Array<TypeDeclaration | CustomTypeDeclaration> {
  const graph = getTypeDeclarationGraph(declarations)
  const { sorted, recursive } = tsort(graph)
  const keys = Object.keys(recursive)
  const recursions: Array<TypeDeclaration | CustomTypeDeclaration> = []
  const map = getTypeDeclarationMap(declarations)
  for (let i = 0; i < keys.length; i++) {
    const td = map[keys[i]]
    if (td.kind === 'TypeDeclaration') {
      recursions.push(getRecursiveTypeDeclaration(td))
    }
  }
  return recursions.concat(sorted.reverse().map(name => map[name]))
}

function printStaticProperty(p: Property, i: number): string {
  const optional = p.isOptional ? '?' : ''
  return `${printDescription(p.description, i)}${indent(i)}${escapePropertyKey(p.key)}${optional}: ${printStatic(
    p.type,
    i
  )}`
}

function printStaticLiteralCombinator(c: LiteralCombinator): string {
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

function printStaticExactCombinator(c: ExactCombinator, i: number): string {
  return printStatic(c.type, i)
}

function printStaticStrictCombinator(c: StrictCombinator, i: number): string {
  let s = '{\n'
  s += c.properties.map(p => printStaticProperty(p, i + 1)).join(',\n')
  s += `\n${indent(i)}}`
  return s
}

function printStaticReadonlyCombinator(c: ReadonlyCombinator, i: number): string {
  return `Readonly<${printStatic(c.type, i)}>`
}

function printStaticReadonlyArrayCombinator(c: ReadonlyArrayCombinator, i: number): string {
  return `ReadonlyArray<${printStatic(c.type, i)}>`
}

function printStaticDictionaryCombinator(c: DictionaryCombinator, i: number): string {
  return `Record<${printStatic(c.domain, i)}, ${printStatic(c.codomain, i)}>`
}

function printStaticTupleCombinator(c: TupleCombinator, i: number): string {
  const indentation = indent(i + 1)
  let s = '[\n'
  s += c.types.map(t => `${indentation}${printStatic(t, i)}`).join(',\n')
  s += `\n${indent(i)}]`
  return s
}

const useInterface = (type: TypeReference): boolean => {
  return (
    type.kind === 'InterfaceCombinator' ||
    type.kind === 'PartialCombinator' ||
    type.kind === 'StrictCombinator' ||
    (type.kind === 'RecursiveCombinator' && useInterface(type.type)) ||
    (type.kind === 'ExactCombinator' && useInterface(type.type))
  )
}

function printStaticTypeDeclaration(declaration: TypeDeclaration, i: number): string {
  let s = printStatic(declaration.type, i)
  if (useInterface(declaration.type) && !declaration.isReadonly) {
    s = `interface ${declaration.name} ${s}`
  } else {
    if (declaration.isReadonly) {
      s = `Readonly<${s}>`
    }
    s = `type ${declaration.name} =${s.length > 0 && s.substring(0, 1) === '\n' ? s : ' ' + s}`
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
    case 'FunctionType':
    case 'UnknownType':
      return node.name
    case 'IntType':
      return `t.${node.name}`
    case 'IntegerType':
      return 'number'
    case 'AnyArrayType':
      return 'Array<unknown>'
    case 'AnyDictionaryType':
      return 'Record<string, unknown>'
    case 'LiteralCombinator':
      return printStaticLiteralCombinator(node)
    case 'InterfaceCombinator':
      return printStaticInterfaceCombinator(node, i)
    case 'PartialCombinator':
      return printStaticPartialCombinator(node, i)
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
    case 'CustomTypeDeclaration':
    case 'CustomCombinator':
      return node.static
    case 'ExactCombinator':
      return printStaticExactCombinator(node, i)
    case 'StrictCombinator':
      return printStaticStrictCombinator(node, i)
    case 'ReadonlyCombinator':
      return printStaticReadonlyCombinator(node, i)
  }
}
