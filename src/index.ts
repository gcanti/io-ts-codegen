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

export interface TupleCombinator extends Type {
  kind: 'TupleCombinator',
  types: Array<TypeReference>
}

export type Combinator =
  | InterfaceCombinator
  | UnionCombinator
  | LiteralCombinator
  | IntersectionCombinator
  | EnumCombinator
  | ArrayCombinator
  | TupleCombinator

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

export function tupleCombinator(types: Array<TypeReference>, name?: string): TupleCombinator {
  return {
    kind: 'TupleCombinator',
    types,
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
export function tsort(graph: Graph): Array<string> {
  const sorted: Array<string> = []
  const visited: { [key: string]: true } = {}

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
        throw new Error('cycle: ' + afterId + ' is in ' + id) // TODO handle recursive types
      } else {
        visit(afterId.toString(), ancestors.slice())
      }
    })

    sorted.unshift(id)
  })

  return sorted
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
  return /[-\s]/.exec(s) === null
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
  return `${printDescription(property.description, i)}${indent(i)}${escapePropertyKey(property.key)}: ${printRuntimeNode(type, i)}`
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
  s += types.map(t => `${indentation}${printRuntimeNode(t, i + 1)}`).join(',\n')
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
  let s = `t.array(${printRuntimeNode(c.type, i)}`
  s = addRuntimeName(s, c.name)
  s += ')'
  return s
}

function printRuntimeTupleCombinator(c: TupleCombinator, i: number): string {
  return printRuntimeTypesCombinator('tuple', c.types, c.name, i)
}

function printRuntimeTypeDeclaration(declaration: TypeDeclaration, i: number): string {
  let s = printRuntimeNode(declaration.type, i)
  if (declaration.isReadonly) {
    s = `t.readonly(${s})`
  }
  s = `const ${declaration.name} = ${s}`
  if (declaration.isExported) {
    s = `export ${s}`
  }
  return s
}

export function printRuntimeNode(node: Node, i: number): string {
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
    case 'TupleCombinator' :
      return printRuntimeTupleCombinator(node, i)
    case 'TypeDeclaration' :
      return printRuntimeTypeDeclaration(node, i)
  }
}

export function printRuntime(declaration: TypeDeclaration): string {
  return printRuntimeNode(declaration, 0)
}

export function sort(declarations: Array<TypeDeclaration>): Array<TypeDeclaration> {
  const map = getTypeDeclarationMap(declarations)
  const graph = getTypeDeclarationGraph(declarations, map)
  const sorted = tsort(graph).reverse()
  return sorted.map(name => map[name])
}

function printStaticProperty(p: Property, i: number): string {
  const optional = p.isOptional ? '?' : ''
  return `${printDescription(p.description, i)}${indent(i)}${escapePropertyKey(p.key)}${optional}: ${printStaticNode(p.type, i)}`
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
  return types.map(t => `\n${indentation}${separator} ${printStaticNode(t, i)}`).join('')
}

function printStaticUnionCombinator(c: UnionCombinator, i: number): string {
  return printStaticTypesCombinator(c.types, '|', i)
}

function printStaticIntersectionCombinator(c: IntersectionCombinator, i: number): string {
  return printStaticTypesCombinator(c.types, '&', i)
}

function printStaticEnumCombinator(c: EnumCombinator, i: number): string {
  return printStaticNode(unionCombinator(c.values.map(value => literalCombinator(value))), i)
}

function printStaticArrayCombinator(c: ArrayCombinator, i: number): string {
  return `Array<${printStaticNode(c.type, i)}>`
}

function printStaticTupleCombinator(c: TupleCombinator, i: number): string {
  const indentation = indent(i + 1)
  let s = '[\n'
  s += c.types.map(t => `${indentation}${printStaticNode(t, i)}`).join(',\n')
  s += `\n${indent(i)}]`
  return s
}

function printStaticTypeDeclaration(declaration: TypeDeclaration, i: number): string {
  let s = printStaticNode(declaration.type, i)
  if (declaration.isReadonly) {
    s = `Readonly<${s}>`
  }
  s = `type ${declaration.name} = ${s}`
  if (declaration.isExported) {
    s = `export ${s}`
  }
  return s
}

export function printStaticNode(node: Node, i: number): string {
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
    case 'TupleCombinator' :
      return printStaticTupleCombinator(node, i)
    case 'TypeDeclaration' :
      return printStaticTypeDeclaration(node, i)
  }
}

export function printStatic(declaration: TypeDeclaration): string {
  return printStaticNode(declaration, 0)
}
