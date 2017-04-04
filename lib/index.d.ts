export interface Type {
    name?: string;
}
export interface StringType extends Type {
    kind: 'StringType';
    name: 'string';
}
export interface NumberType extends Type {
    kind: 'NumberType';
    name: 'number';
}
export interface BooleanType extends Type {
    kind: 'BooleanType';
    name: 'boolean';
}
export interface NullType extends Type {
    kind: 'NullType';
    name: 'null';
}
export interface UndefinedType extends Type {
    kind: 'UndefinedType';
    name: 'undefined';
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
export interface LiteralCombinator extends Type {
    kind: 'LiteralCombinator';
    value: string | number | boolean;
}
export interface InterfaceCombinator extends Type {
    kind: 'InterfaceCombinator';
    properties: Array<Property>;
}
export interface UnionCombinator extends Type {
    kind: 'UnionCombinator';
    types: Array<TypeReference>;
}
export interface IntersectionCombinator extends Type {
    kind: 'IntersectionCombinator';
    types: Array<TypeReference>;
}
export interface EnumCombinator extends Type {
    kind: 'EnumCombinator';
    values: Array<string>;
}
export interface ArrayCombinator extends Type {
    kind: 'ArrayCombinator';
    type: TypeReference;
}
export interface DictionaryCombinator extends Type {
    kind: 'DictionaryCombinator';
    domain: TypeReference;
    codomain: TypeReference;
}
export interface TupleCombinator extends Type {
    kind: 'TupleCombinator';
    types: Array<TypeReference>;
}
export interface RecursiveCombinator extends Type {
    kind: 'RecursiveCombinator';
    typeParameter: Identifier;
    name: string;
    type: TypeReference;
}
export declare type Combinator = InterfaceCombinator | UnionCombinator | LiteralCombinator | IntersectionCombinator | EnumCombinator | ArrayCombinator | TupleCombinator | RecursiveCombinator | DictionaryCombinator;
export interface Identifier {
    kind: 'Identifier';
    name: string;
}
export declare type BuiltinType = StringType | NumberType | BooleanType | NullType | UndefinedType;
export declare type TypeReference = BuiltinType | Combinator | Identifier;
export interface TypeDeclaration extends Readonly {
    kind: 'TypeDeclaration';
    name: string;
    type: TypeReference;
    isExported: boolean;
}
export declare type Node = TypeReference | TypeDeclaration;
export declare const stringType: StringType;
export declare const numberType: NumberType;
export declare const booleanType: BooleanType;
export declare const nullType: NullType;
export declare const undefinedType: UndefinedType;
export declare function identifier(name: string): Identifier;
export declare function property(key: string, type: TypeReference, isOptional?: boolean, description?: string): Property;
export declare function literalCombinator(value: string | boolean | number, name?: string): LiteralCombinator;
export declare function interfaceCombinator(properties: Array<Property>, name?: string): InterfaceCombinator;
export declare function unionCombinator(types: Array<TypeReference>, name?: string): UnionCombinator;
export declare function intersectionCombinator(types: Array<TypeReference>, name?: string): IntersectionCombinator;
export declare function enumCombinator(values: Array<string>, name?: string): EnumCombinator;
export declare function arrayCombinator(type: TypeReference, name?: string): ArrayCombinator;
export declare function tupleCombinator(types: Array<TypeReference>, name?: string): TupleCombinator;
export declare function recursiveCombinator(typeParameter: Identifier, name: string, type: TypeReference): RecursiveCombinator;
export declare function dictionaryCombinator(domain: TypeReference, codomain: TypeReference, name?: string): DictionaryCombinator;
export declare function typeDeclaration(name: string, type: TypeReference, isExported?: boolean, isReadonly?: boolean): TypeDeclaration;
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
export declare function getTypeDeclarationMap(declarations: Array<TypeDeclaration>): {
    [key: string]: TypeDeclaration;
};
export declare function getTypeDeclarationGraph(declarations: Array<TypeDeclaration>, map: {
    [key: string]: TypeDeclaration;
}): Graph;
export declare function printRuntime(node: Node, i?: number): string;
export declare function sort(declarations: Array<TypeDeclaration>): Array<TypeDeclaration>;
export declare function printStatic(node: Node, i?: number): string;
