import * as assert from 'assert'
import * as fs from 'fs'
const expected = fs.readFileSync(__dirname + '/fixtures/expected.ts', 'utf-8')

import * as t from '../src'

const models = require('./fixtures/source.json').models
const declarations = getDeclarations(models)
const sortedDeclarations = t.sort(declarations)
const actual = `import * as t from 'io-ts'\n\n` + sortedDeclarations.map(d => {
  return t.printStaticNode(d, 0) + '\n\n' + t.printRuntimeNode(d, 0)
}).join('\n\n')

function getType(tpe: any): t.TypeReference {
  switch (tpe.name) {
    case 'String' :
    case 'Date' : // TODO
      return t.stringType
    case 'Int' :
      return t.numberType // TODO
    case 'Option' :
      return getType(tpe.args[0])
    case 'List' :
      return t.arrayCombinator(getType(tpe.args[0]))
    default :
      return t.identifier(tpe.name)
  }
}

function getProperty(member: any): t.Property {
  const isOptional = member.tpe.name === 'Option'
  return t.property(member.name, getType(member.tpe), isOptional, member.desc)
}

function getDeclarations(models: Array<any>): Array<t.TypeDeclaration> {
  return models.map(model => {
    if (model.hasOwnProperty('values')) {
      return t.typeDeclaration(
        model.name,
        t.enumCombinator(model.values.map((v: any) => v.name)),
        true
      )
    }
    return t.typeDeclaration(
      model.name,
      t.interfaceCombinator(model.members.map(getProperty)),
      true
    )
  })
}

function trimRight(s: string): string {
  return s.split('\n').map(s => (s as any).trimRight()).join('\n') + '\n'
}

describe('metarpheus', () => {

  it('should output the model', () => {
    assert.strictEqual(trimRight(actual), expected)
  })

})
