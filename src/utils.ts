import { getTypeDeclarationMap, TypeDeclaration, Node, identifier, recursiveCombinator, typeDeclaration } from './io-codegen'

export class Vertex {
  public afters: Array<string> = []
  constructor(public id: string) { }
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


export function getTypeDeclarationGraph(
  declarations: Array<TypeDeclaration>,
  map: { [key: string]: TypeDeclaration }
): Graph {
  const graph: Graph = {}

  function visit(vertex: Vertex, node: Node): void {
    switch (node.kind) {
      case 'Identifier':
        if (map.hasOwnProperty(node.name)) {
          vertex.afters.push(node.name)
        }
        break
      case 'InterfaceCombinator':
      case 'StrictCombinator':
        node.properties.forEach(p => visit(vertex, p.type))
        break
      case 'UnionCombinator':
      case 'IntersectionCombinator':
      case 'TupleCombinator':
        node.types.forEach(n => visit(vertex, n))
        break
      case 'ArrayCombinator':
      case 'ReadonlyArrayCombinator':
        visit(vertex, node.type)
        break
    }
  }

  declarations.forEach(d => {
    const vertex = (graph[d.name] = new Vertex(d.name))
    visit(vertex, d.type)
  })
  return graph
}

function getRecursiveTypeDeclaration(declaration: TypeDeclaration): TypeDeclaration {
  const name = declaration.name
  const recursive = recursiveCombinator(identifier(name), name, declaration.type)
  return typeDeclaration(name, recursive, declaration.isExported, declaration.isReadonly)
}


export function sort(declarations: Array<TypeDeclaration>): Array<TypeDeclaration> {
  const map = getTypeDeclarationMap(declarations)
  const graph = getTypeDeclarationGraph(declarations, map)
  const { sorted, recursive } = tsort(graph)
  const recursions = Object.keys(recursive).map(name => getRecursiveTypeDeclaration(map[name]))
  return sorted
    .reverse()
    .map(name => map[name])
    .concat(recursions)
}

