export interface Tpe {
  name: string,
  args?: Array<Tpe>
}

export interface Member {
  name: string,
  tpe: Tpe,
  desc?: string
}

export interface CaseClass {
  kind: 'CaseClass',
  name: string,
  members: Array<Member>,
  desc?: string
}

export interface Value {
  name: string,
  desc?: string
}

export interface CaseEnum {
  kind: 'CaseEnum',
  name: string,
  values: Array<Value>,
  desc?: string
}

export type Model =
  | CaseClass
  | CaseEnum
