// This is a try to generate io-ts from typescript type annotations. 

import fs from 'fs';

import * as ts from "typescript";
import * as t from '../src/base'

function ts_type_to_io(s_type: string): t.TypeReference | void {
  switch (s_type) {
    case 'string':
      return t.stringType
  }
  return t.anyType
}

function doInterfaceDeclaration(node: ts.InterfaceDeclaration) {
  let name = node.name.escapedText

  // node.modifers ExportKeyword

  for (let member of node.members) {
    if (member.kind == ts.SyntaxKind.PropertySignature) {
      const tprop = (member as ts.PropertySignature)
      // tprop.type -> elementType
      // tprop.kind == ts.SyntaxKind.StringKeyword
      console.log(tprop.name)
    }
  }
}

function doTypeAliasDeclaration(node: ts.TypeAliasDeclaration) {
  // debugger;

  let name = node.name.text
  let type = node.type

  console.log(`type ${name}`)

  if (type.kind == ts.SyntaxKind.TypeLiteral) { //
    let ctype = type as ts.TypeLiteralNode
    for (let member of ctype.members) {
      if (member.kind === ts.SyntaxKind.PropertySignature) {
        let cmember = member as ts.PropertySignature

        let text = (cmember.name as any).text

        if ((cmember.type as any).kind == ts.SyntaxKind.StringKeyword) {
          console.log(`prop ${text}:string`)
        } else if ((cmember.type as any).kind == ts.SyntaxKind.ArrayType) { // 165
          let ctype = cmember.type as ts.ArrayTypeNode
          let elementType = ctype.elementType //ts.TypeReference

          if (elementType.kind == ts.SyntaxKind.TypeReference) {
            let type_value = ((elementType as ts.TypeReferenceNode).typeName as any).escapedText // PictureVariant

            console.log(`prop ${text}:Array<${type_value}>`)
          }

        } else {

          debugger;
          console.log(cmember)
          throw new Error('cmember')
        }
      } else {
        throw new Error('not a PropertySignature')
      }
    }
  }

}

function transcode() {

  let file_contents = fs.readFileSync('./myfile.ts').toString()

  let sourceFile = ts.createSourceFile("myfile.ts", file_contents, ts.ScriptTarget.ES2015, /*setParentNodes */ true);

  for (let stmt of sourceFile.statements) {

    if (stmt.kind == ts.SyntaxKind.InterfaceDeclaration) {
      doInterfaceDeclaration(stmt as ts.InterfaceDeclaration)
    } else if (stmt.kind == ts.SyntaxKind.TypeAliasDeclaration) {
      doTypeAliasDeclaration(stmt as ts.TypeAliasDeclaration)
    }

  }
}