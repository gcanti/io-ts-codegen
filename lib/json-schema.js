"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("./index");
function getRequiredProperties(schema) {
    var required = {};
    if (schema.required) {
        schema.required.forEach(function (k) {
            required[k] = true;
        });
    }
    return required;
}
function toInterfaceCombinator(schema) {
    var required = getRequiredProperties(schema);
    return t.interfaceCombinator(Object.keys(schema.properties).map(function (key) {
        return t.property(key, to(schema.properties[key]), !required.hasOwnProperty(key));
    }));
}
function to(schema) {
    switch (schema.type) {
        case 'string':
            return schema.enum ? t.keyofCombinator(schema.enum) : t.stringType;
        case 'number':
            return t.numberType;
        case 'boolean':
            return t.booleanType;
        case 'object':
            return toInterfaceCombinator(schema);
    }
}
exports.to = to;
//# sourceMappingURL=json-schema.js.map