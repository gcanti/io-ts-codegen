import * as t from './index';
export interface StringSchema {
    type: 'string';
    enum?: Array<string>;
}
export interface NumberSchema {
    type: 'number';
}
export interface BooleanSchema {
    type: 'boolean';
}
export interface ObjectSchema {
    type: 'object';
    properties: {
        [key: string]: JSONSchema;
    };
    required?: Array<string>;
}
export declare type JSONSchema = StringSchema | NumberSchema | BooleanSchema | ObjectSchema;
export declare function to(schema: JSONSchema): t.TypeReference;
