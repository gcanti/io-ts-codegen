export class Node {
  public afters: Array<string> = []
  constructor(public id: string) {}
}

export type Edges = Array<[string, string]>

export type Nodes = { [key: string]: Node }

export function tsort(nodes: Nodes) {
  const sorted: Array<string> = []
  const visited: { [key: string]: true } = {}

  Object.keys(nodes).forEach(function visit(id, ancestors: any) {
    if (visited[id]) {
      return
    }

    const node = nodes[id]

    if (!Array.isArray(ancestors)) {
      ancestors = []
    }

    ancestors.push(id)
    visited[id] = true

    node.afters.forEach(afterId => {
      if (ancestors.indexOf(afterId) >= 0) {
        throw new Error('cycle: ' +  afterId + ' is in ' + id)
      } else {
        visit(afterId.toString(), ancestors.slice())
      }
    });

    sorted.unshift(id)
  });

  return sorted;
}
