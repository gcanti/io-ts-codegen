export interface StringType {
    kind: 'StringType';
    name: 'string';
}
export interface NumberType {
    kind: 'NumberType';
    name: 'number';
}
export interface IntegerType {
    kind: 'IntegerType';
    name: 'Integer';
}
export interface BooleanType {
    kind: 'BooleanType';
    name: 'boolean';
}
export interface NullType {
    kind: 'NullType';
    name: 'null';
}
export interface UndefinedType {
    kind: 'UndefinedType';
    name: 'undefined';
}
export interface AnyType {
    kind: 'AnyType';
    name: 'any';
}
export interface Readonly {
    isReadonly: boolean;
}
export interface Optional {
    isOptional: boolean;
}
export interface Property extends Optional {
    kind: 'Property';
    key: string;
    type: TypeReference;
    description?: string;
}
export interface LiteralCombinator {
    kind: 'LiteralCombinator';
    value: string | number | boolean;
    name?: string;
}
export interface InterfaceCombinator {
    kind: 'InterfaceCombinator';
    properties: Array<Property>;
    name?: string;
}
export interface PartialCombinator {
    kind: 'PartialCombinator';
    properties: Array<Property>;
    name?: string;
}
export interface StrictCombinator {
    kind: 'StrictCombinator';
    properties: Array<Property>;
    name?: string;
}
export interface UnionCombinator {
    kind: 'UnionCombinator';
    types: Array<TypeReference>;
    name?: string;
}
export interface TaggedUnionCombinator {
    kind: 'TaggedUnionCombinator';
    tag: string;
    types: Array<TypeReference>;
    name?: string;
}
export interface IntersectionCombinator {
    kind: 'IntersectionCombinator';
    types: Array<TypeReference>;
    name?: string;
}
export interface KeyofCombinator {
    kind: 'KeyofCombinator';
    values: Array<string>;
    name?: string;
}
export interface ArrayCombinator {
    kind: 'ArrayCombinator';
    type: TypeReference;
    name?: string;
}
export interface ReadonlyArrayCombinator {
    kind: 'ReadonlyArrayCombinator';
    type: TypeReference;
    name?: string;
}
export interface DictionaryCombinator {
    kind: 'DictionaryCombinator';
    domain: TypeReference;
    codomain: TypeReference;
    name?: string;
}
export interface TupleCombinator {
    kind: 'TupleCombinator';
    types: Array<TypeReference>;
    name?: string;
}
export interface RecursiveCombinator {
    kind: 'RecursiveCombinator';
    typeParameter: Identifier;
    name: string;
    type: TypeReference;
}
export declare type Combinator = InterfaceCombinator | UnionCombinator | LiteralCombinator | IntersectionCombinator | StrictCombinator | KeyofCombinator | ArrayCombinator | ReadonlyArrayCombinator | TupleCombinator | RecursiveCombinator | DictionaryCombinator | PartialCombinator | TaggedUnionCombinator;
export interface Identifier {
    kind: 'Identifier';
    name: string;
}
export declare type BasicType = StringType | NumberType | BooleanType | NullType | UndefinedType | IntegerType | AnyType;
export declare type TypeReference = BasicType | Combinator | Identifier;
export interface TypeDeclaration extends Readonly {
    kind: 'TypeDeclaration';
    name: string;
    type: TypeReference;
    isExported: boolean;
}
export interface CustomTypeDeclaration {
    kind: 'CustomTypeDeclaration';
    name: string;
    static: string;
    runtime: string;
    dependencies: Array<string>;
}
export declare type Node = TypeReference | TypeDeclaration | CustomTypeDeclaration;
export declare const stringType: StringType;
export declare const numberType: NumberType;
export declare const integerType: IntegerType;
export declare const booleanType: BooleanType;
export declare const nullType: NullType;
export declare const undefinedType: UndefinedType;
export declare const anyType: AnyType;
export declare function identifier(name: string): Identifier;
export declare function property(key: string, type: TypeReference, isOptional?: boolean, description?: string): Property;
export declare function literalCombinator(value: string | boolean | number, name?: string): LiteralCombinator;
export declare function partialCombinator(properties: Array<Property>, name?: string): PartialCombinator;
export declare function interfaceCombinator(properties: Array<Property>, name?: string): InterfaceCombinator;
export declare function strictCombinator(properties: Array<Property>, name?: string): StrictCombinator;
export declare function unionCombinator(types: Array<TypeReference>, name?: string): UnionCombinator;
export declare function taggedUnionCombinator(tag: string, types: Array<TypeReference>, name?: string): TaggedUnionCombinator;
export declare function intersectionCombinator(types: Array<TypeReference>, name?: string): IntersectionCombinator;
export declare function keyofCombinator(values: Array<string>, name?: string): KeyofCombinator;
export declare function arrayCombinator(type: TypeReference, name?: string): ArrayCombinator;
export declare function readonlyArrayCombinator(type: TypeReference, name?: string): ReadonlyArrayCombinator;
export declare function tupleCombinator(types: Array<TypeReference>, name?: string): TupleCombinator;
export declare function recursiveCombinator(typeParameter: Identifier, name: string, type: TypeReference): RecursiveCombinator;
export declare function dictionaryCombinator(domain: TypeReference, codomain: TypeReference, name?: string): DictionaryCombinator;
export declare function typeDeclaration(name: string, type: TypeReference, isExported?: boolean, isReadonly?: boolean): TypeDeclaration;
export declare function customTypeDeclaration(name: string, staticRepr: string, runtimeRepr: string, dependencies: Array<string>): CustomTypeDeclaration;
export declare class Vertex {
    id: string;
    afters: Array<string>;
    constructor(id: string);
}
export declare type Graph = {
    [key: string]: Vertex;
};
/** topological sort */
export declare function tsort(graph: Graph): {
    sorted: Array<string>;
    recursive: {
        [key: string]: true;
    };
};
export declare function getTypeDeclarationMap(declarations: Array<TypeDeclaration | CustomTypeDeclaration>): {
    [key: string]: TypeDeclaration | CustomTypeDeclaration;
};
export declare function getTypeDeclarationGraph(declarations: Array<TypeDeclaration | CustomTypeDeclaration>, map: {
    [key: string]: TypeDeclaration | CustomTypeDeclaration;
}): Graph;
export declare function printRuntime(node: Node, i?: number): string;
export declare function sort(declarations: Array<TypeDeclaration | CustomTypeDeclaration>): Array<TypeDeclaration | CustomTypeDeclaration>;
export declare function printStatic(node: Node, i?: number): string;
