import * as ast from './ast'

import * as sast from '../static/ast'
import * as rast from '../runtime/ast'

import * as sgen from '../static/gen'
import * as rgen from '../runtime/gen'

import { Nodes, Node, tsort } from '../tsort'

function ensureModelKind(model: any): void {
  if (model.values) {
    model.kind = 'CaseEnum'
  } else {
    model.kind = 'CaseClass'
  }
}

function ensureKinds(models: Array<ast.Model>): void {
  models.forEach(model => ensureModelKind(model))
}

function sort(models: Array<ast.Model>): Array<ast.Model> {
  ensureKinds(models)
  const nodes: Nodes = {}
  const modelMap: { [key: string]: ast.Model } = {}

  function visit(model: ast.Model) {
    const node = nodes[model.name] = new Node(model.name)
    if (model.kind === 'CaseClass') {
      model.members.forEach(member => {
        const name = member.tpe.name
        if (modelMap.hasOwnProperty(name)) {
          node.afters.push(name)
        }
      })
    }
  }

  models.forEach(model => modelMap[model.name] = model)
  models.forEach(visit)
  const sorted = tsort(nodes).reverse()
  return sorted.map(name => modelMap[name])
}

function toStaticType(tpe: ast.Tpe): sast.Type {
  switch (tpe.name) {
    case 'String' :
    case 'Date' : // TODO
      return sast.stringKeyword
    case 'Int' :
      return sast.numberKeyword // TODO
    case 'Option' :
      return toStaticType(tpe.args![0])
    case 'List' :
      return sast.typeReference(sast.identifier('Array'), [toStaticType(tpe.args![0])])
    default :
      return sast.typeReference(sast.identifier(tpe.name))
  }
}

function toStaticAST(models: Array<ast.Model>): Array<sast.TypeAliasDeclaration | sast.InterfaceDeclaration> {
  return models.map(model => {
    switch (model.kind) {
      case 'CaseClass' :
        return sast.interfaceDeclaration(
          sast.identifier(model.name),
          model.members.map(m => {
            const leadingComments = m.desc ? [sast.multiLineCommentTrivia(`/** ${m.desc} */`, true)] : undefined
            const questionToken = m.tpe.name === 'Option' ? sast.questionToken : undefined
            return sast.propertySignature(sast.identifier(m.name), toStaticType(m.tpe), questionToken, leadingComments)
          })
        )
      case 'CaseEnum' :
        return sast.typeAliasDeclaration(
          sast.identifier(model.name),
          sast.unionType(model.values.map(v => sast.lastTypeNode(sast.stringLiteral(v.name))))
        )
    }
  })
}

function printStaticAST(declarations: Array<sast.TypeAliasDeclaration | sast.InterfaceDeclaration>): Array<string> {
  return declarations.map(d => d.kind === 228 ? sgen.printTypeAliasDeclaration(d) : sgen.printInterfaceDeclaration(d))
}

function toRuntimeType(tpe: ast.Tpe): rast.Type {
  switch (tpe.name) {
    case 'String' :
    case 'Date' : // TODO
      return rast.stringType
    case 'Int' :
      return rast.numberType // TODO
    case 'Option' :
      const optionArgs = tpe.args || []
      return rast.unionCombinator([toRuntimeType(optionArgs[0]), rast.undefinedType])
    case 'List' :
      const listArgs = tpe.args || []
      return rast.arrayCombinator(toRuntimeType(listArgs[0]))
    default :
      return rast.identifier(tpe.name)
  }
}

function toRuntimeAST(models: Array<ast.Model>): Array<rast.CombinatorDeclaration> {
  return models.map(model => {
    switch (model.kind) {
      case 'CaseClass' :
        return rast.combinatorDeclaration(
          model.name,
          rast.interfaceCombinator(model.members.map(m => {
            const description = m.desc ? `/** ${m.desc} */` : undefined
            return rast.prop(m.name, toRuntimeType(m.tpe), description)
          }))
        )
      case 'CaseEnum' :
        return rast.combinatorDeclaration(
          model.name,
          rast.keyofCombinator(model.values.map(v => v.name))
        )
    }
  })
}

function printRuntimeAST(declarations: Array<rast.CombinatorDeclaration>): Array<string> {
  return declarations.map(d => rgen.printCombinatorDeclaration(d))
}

export function print(source: Array<ast.Model>): string {
  const models = sort(source)
  const statics = printStaticAST(toStaticAST(models))
  const runtimes = printRuntimeAST(toRuntimeAST(models))
  const types: string = statics.map((s, i) => {
    return `export ${s}\n\nexport ${runtimes[i]}`
  }).join('\n\n')
  const imports = `import * as t from 'io-ts'`
  return imports + `\n\n` + types
}
