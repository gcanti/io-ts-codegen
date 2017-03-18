import * as t from './index'

export interface StringSchema {
  type: 'string',
  enum?: Array<string>
}

export interface NumberSchema {
  type: 'number'
}

export interface BooleanSchema {
  type: 'boolean'
}

export interface ObjectSchema {
  type: 'object',
  properties: { [key: string]: JSONSchema },
  required?: Array<string>
}

export type JSONSchema =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | ObjectSchema

function getRequiredProperties(schema: ObjectSchema): { [key: string]: true } {
  const required: { [key: string]: true } = {}
  if (schema.required) {
    schema.required.forEach(function (k) {
      required[k] = true
    })
  }
  return required
}

function toInterfaceCombinator(schema: ObjectSchema): t.InterfaceCombinator {
  const required = getRequiredProperties(schema)
  return t.interfaceCombinator(
    Object.keys(schema.properties).map(key => t.property(
      key,
      to(schema.properties[key]),
      !required.hasOwnProperty(key)
    ))
  )
}

export function to(schema: JSONSchema): t.TypeReference {
  switch (schema.type) {
    case 'string' :
      return schema.enum ? t.enumCombinator(schema.enum) : t.stringType
    case 'number' :
      return t.numberType
    case 'boolean' :
      return t.booleanType
    case 'object' :
      return toInterfaceCombinator(schema)
  }
}
