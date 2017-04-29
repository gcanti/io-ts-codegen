export interface Type {
  name?: string
}

export interface StringType extends Type {
  kind: 'StringType',
  name: 'string'
}

export interface NumberType extends Type {
  kind: 'NumberType',
  name: 'number'
}

export interface BooleanType extends Type {
  kind: 'BooleanType',
  name: 'boolean'
}

export interface NullType extends Type {
  kind: 'NullType',
  name: 'null'
}

export interface UndefinedType extends Type {
  kind: 'UndefinedType',
  name: 'undefined'
}

export interface Readonly {
  isReadonly: boolean
}

export interface Optional {
  isOptional: boolean
}

export interface Property extends Optional {
  kind: 'Property',
  key: string,
  type: TypeReference,
  description?: string
}

export interface LiteralCombinator extends Type {
  kind: 'LiteralCombinator',
  value: string | number | boolean
}

export interface InterfaceCombinator extends Type {
  kind: 'InterfaceCombinator',
  properties: Array<Property>
}

export interface UnionCombinator extends Type {
  kind: 'UnionCombinator',
  types: Array<TypeReference>
}

export interface IntersectionCombinator extends Type {
  kind: 'IntersectionCombinator',
  types: Array<TypeReference>
}

export interface EnumCombinator extends Type {
  kind: 'EnumCombinator',
  values: Array<string>
}

export interface ArrayCombinator extends Type {
  kind: 'ArrayCombinator',
  type: TypeReference
}

export interface ReadonlyArrayCombinator extends Type {
  kind: 'ReadonlyArrayCombinator',
  type: TypeReference
}

export interface DictionaryCombinator extends Type {
  kind: 'DictionaryCombinator',
  domain: TypeReference,
  codomain: TypeReference
}

export interface TupleCombinator extends Type {
  kind: 'TupleCombinator',
  types: Array<TypeReference>
}

export interface RecursiveCombinator extends Type {
  kind: 'RecursiveCombinator',
  typeParameter: Identifier,
  name: string,
  type: TypeReference
}

export type Combinator =
  | InterfaceCombinator
  | UnionCombinator
  | LiteralCombinator
  | IntersectionCombinator
  | EnumCombinator
  | ArrayCombinator
  | ReadonlyArrayCombinator
  | TupleCombinator
  | RecursiveCombinator
  | DictionaryCombinator

export interface Identifier {
  kind: 'Identifier',
  name: string
}

export type BuiltinType =
  | StringType
  | NumberType
  | BooleanType
  | NullType
  | UndefinedType

export type TypeReference =
  | BuiltinType
  | Combinator
  | Identifier

export interface TypeDeclaration extends Readonly {
  kind: 'TypeDeclaration',
  name: string,
  type: TypeReference,
  isExported: boolean
}

export type Node =
  | TypeReference
  | TypeDeclaration

export const stringType: StringType = {
  kind: 'StringType',
  name: 'string'
}

export const numberType: NumberType = {
  kind: 'NumberType',
  name: 'number'
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

export function identifier(name: string): Identifier {
  return {
    kind: 'Identifier',
    name
  }
}

export function property(key: string, type: TypeReference, isOptional: boolean = false, description?: string): Property {
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

export function interfaceCombinator(properties: Array<Property>, name?: string): InterfaceCombinator {
  return {
    kind: 'InterfaceCombinator',
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

export function intersectionCombinator(types: Array<TypeReference>, name?: string): IntersectionCombinator {
  return {
    kind: 'IntersectionCombinator',
    types,
    name
  }
}

export function enumCombinator(values: Array<string>, name?: string): EnumCombinator {
  return {
    kind: 'EnumCombinator',
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

export function dictionaryCombinator(domain: TypeReference, codomain: TypeReference, name?: string): DictionaryCombinator {
  return {
    kind: 'DictionaryCombinator',
    domain,
    codomain,
    name
  }
}

export function typeDeclaration(name: string, type: TypeReference, isExported: boolean = false, isReadonly: boolean = false): TypeDeclaration {
  return {
    kind: 'TypeDeclaration',
    name,
    type,
    isExported,
    isReadonly
  }
}

export class Vertex {
  public afters: Array<string> = []
  constructor(public id: string) {}
}

export type Graph = { [key: string]: Vertex }

/** topological sort */
export function tsort(graph: Graph): { sorted: Array<string>, recursive: { [key: string]: true } } {
  const sorted: Array<string> = []
  const visited: { [key: string]: true } = {}
  const recursive: { [key: string]: true } = {}

  Object.keys(graph).forEach(function visit(id, ancestors: any) {
    if (visited[id]) {
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

export function getTypeDeclarationMap(declarations: Array<TypeDeclaration>): { [key: string]: TypeDeclaration } {
  const map: { [key: string]: TypeDeclaration } = {}
  declarations.forEach(d => { map[d.name] = d })
  return map
}

export function getTypeDeclarationGraph(declarations: Array<TypeDeclaration>, map: { [key: string]: TypeDeclaration }): Graph {
  const graph: Graph = {}

  function visit(vertex: Vertex, node: Node): void {
    switch (node.kind) {
      case 'Identifier' :
        if (map.hasOwnProperty(node.name)) {
          vertex.afters.push(node.name)
        }
        break
      case 'InterfaceCombinator' :
        node.properties.forEach(p => visit(vertex, p.type))
        break
      case 'UnionCombinator' :
      case 'IntersectionCombinator' :
      case 'TupleCombinator' :
        node.types.forEach(n => visit(vertex, n))
        break
      case 'ArrayCombinator' :
      case 'ReadonlyArrayCombinator' :
        visit(vertex, node.type)
        break
    }
  }

  declarations.forEach(d => {
    const vertex = graph[d.name] = new Vertex(d.name)
    visit(vertex, d.type)
  })
  return graph
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

function indent(i: number): string {
  if (i === 0) {
    return ''
  }
  return indentations[i] || new Array(i).join(`  `)
}

function escapeString(s: string): string {
  return '\'' + s.replace(/'/g, "\\'") + '\''
}

function isValidPropertyKey(s: string): boolean {
  return /[-\/\s]/.exec(s) === null
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

function printRuntimeLiteralCombinator(literalCombinator: LiteralCombinator, i: number): string {
  const value = typeof literalCombinator.value === 'string' ? escapeString(literalCombinator.value) : literalCombinator.value
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

function printRuntimeProperty(property: Property, i: number): string {
  const type = property.isOptional ? unionCombinator([property.type, undefinedType]) : property.type
  return `${printDescription(property.description, i)}${indent(i)}${escapePropertyKey(property.key)}: ${printRuntime(type, i)}`
}

function printRuntimeInterfaceCombinator(interfaceCombinator: InterfaceCombinator, i: number): string {
  let s = 't.interface({\n'
  s += interfaceCombinator.properties.map(p => printRuntimeProperty(p, i + 1)).join(',\n')
  s += `\n${indent(i)}}`
  s = addRuntimeName(s, interfaceCombinator.name)
  s += ')'
  return s
}

function printRuntimeTypesCombinator(combinatorKind: string, types: Array<TypeReference>, combinatorName: string | undefined, i: number): string {
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

function printRuntimeIntersectionCombinator(c: IntersectionCombinator, i: number): string {
  return printRuntimeTypesCombinator('intersection', c.types, c.name, i)
}

function printRuntimeEnumCombinator(c: EnumCombinator, i: number): string {
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
  let s = `t.recursive<${c.typeParameter.name}>(${escapeString(c.name)}, (${c.name}: t.Any) => ${printRuntime(c.type, i)}`
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
    case 'Identifier' :
      return node.name
    case 'StringType' :
    case 'NumberType' :
    case 'BooleanType' :
    case 'NullType' :
    case 'UndefinedType' :
      return `t.${node.name}`
    case 'LiteralCombinator' :
      return printRuntimeLiteralCombinator(node, i)
    case 'InterfaceCombinator' :
      return printRuntimeInterfaceCombinator(node, i)
    case 'UnionCombinator' :
      return printRuntimeUnionCombinator(node, i)
    case 'IntersectionCombinator' :
      return printRuntimeIntersectionCombinator(node, i)
    case 'EnumCombinator' :
      return printRuntimeEnumCombinator(node, i)
    case 'ArrayCombinator' :
      return printRuntimeArrayCombinator(node, i)
    case 'ReadonlyArrayCombinator' :
      return printRuntimeReadonlyArrayCombinator(node, i)
    case 'TupleCombinator' :
      return printRuntimeTupleCombinator(node, i)
    case 'RecursiveCombinator' :
      return printRuntimeRecursiveCombinator(node, i)
    case 'DictionaryCombinator' :
      return printRuntimeDictionaryCombinator(node, i)
    case 'TypeDeclaration' :
      return printRuntimeTypeDeclaration(node, i)
  }
}

function getRecursiveTypeDeclaration(declaration: TypeDeclaration): TypeDeclaration {
  const name = declaration.name
  const recursive = recursiveCombinator(
    identifier(name),
    name,
    declaration.type
  )
  return typeDeclaration(name, recursive, declaration.isExported, declaration.isReadonly)
}

export function sort(declarations: Array<TypeDeclaration>): Array<TypeDeclaration> {
  const map = getTypeDeclarationMap(declarations)
  const graph = getTypeDeclarationGraph(declarations, map)
  const {sorted, recursive} = tsort(graph)
  const recursions = Object.keys(recursive).map(name => getRecursiveTypeDeclaration(map[name]))
  return sorted.reverse().map(name => map[name]).concat(recursions)
}

function printStaticProperty(p: Property, i: number): string {
  const optional = p.isOptional ? '?' : ''
  return `${printDescription(p.description, i)}${indent(i)}${escapePropertyKey(p.key)}${optional}: ${printStatic(p.type, i)}`
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

function printStaticTypesCombinator(types: Array<TypeReference>, separator: string, i: number): string {
  const indentation = indent(i + 1)
  return types.map(t => `\n${indentation}${separator} ${printStatic(t, i)}`).join('')
}

function printStaticUnionCombinator(c: UnionCombinator, i: number): string {
  return printStaticTypesCombinator(c.types, '|', i)
}

function printStaticIntersectionCombinator(c: IntersectionCombinator, i: number): string {
  return printStaticTypesCombinator(c.types, '&', i)
}

function printStaticEnumCombinator(c: EnumCombinator, i: number): string {
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
  if (declaration.type.kind === 'InterfaceCombinator' && !declaration.isReadonly) {
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
    case 'Identifier' :
      return node.name
    case 'StringType' :
    case 'NumberType' :
    case 'BooleanType' :
    case 'NullType' :
    case 'UndefinedType' :
      return node.name
    case 'LiteralCombinator' :
      return printStaticLiteralCombinator(node, i)
    case 'InterfaceCombinator' :
      return printStaticInterfaceCombinator(node, i)
    case 'UnionCombinator' :
      return printStaticUnionCombinator(node, i)
    case 'IntersectionCombinator' :
      return printStaticIntersectionCombinator(node, i)
    case 'EnumCombinator' :
      return printStaticEnumCombinator(node, i)
    case 'ArrayCombinator' :
      return printStaticArrayCombinator(node, i)
    case 'ReadonlyArrayCombinator' :
      return printStaticReadonlyArrayCombinator(node, i)
    case 'TupleCombinator' :
      return printStaticTupleCombinator(node, i)
    case 'RecursiveCombinator' :
      return printStatic(node.type, i)
    case 'DictionaryCombinator' :
      return printStaticDictionaryCombinator(node, i)
    case 'TypeDeclaration' :
      return printStaticTypeDeclaration(node, i)
  }
}
