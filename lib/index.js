"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringType = {
    kind: 'StringType',
    name: 'string'
};
exports.numberType = {
    kind: 'NumberType',
    name: 'number'
};
exports.integerType = {
    kind: 'IntegerType',
    name: 'Integer'
};
exports.booleanType = {
    kind: 'BooleanType',
    name: 'boolean'
};
exports.nullType = {
    kind: 'NullType',
    name: 'null'
};
exports.undefinedType = {
    kind: 'UndefinedType',
    name: 'undefined'
};
exports.anyType = {
    kind: 'AnyType',
    name: 'any'
};
function identifier(name) {
    return {
        kind: 'Identifier',
        name: name
    };
}
exports.identifier = identifier;
function property(key, type, isOptional, description) {
    if (isOptional === void 0) { isOptional = false; }
    return {
        kind: 'Property',
        key: key,
        type: type,
        isOptional: isOptional,
        description: description
    };
}
exports.property = property;
function literalCombinator(value, name) {
    return {
        kind: 'LiteralCombinator',
        value: value,
        name: name
    };
}
exports.literalCombinator = literalCombinator;
function partialCombinator(properties, name) {
    return {
        kind: 'PartialCombinator',
        properties: properties,
        name: name
    };
}
exports.partialCombinator = partialCombinator;
function interfaceCombinator(properties, name) {
    return {
        kind: 'InterfaceCombinator',
        properties: properties,
        name: name
    };
}
exports.interfaceCombinator = interfaceCombinator;
function strictCombinator(properties, name) {
    return {
        kind: 'StrictCombinator',
        properties: properties,
        name: name
    };
}
exports.strictCombinator = strictCombinator;
function unionCombinator(types, name) {
    return {
        kind: 'UnionCombinator',
        types: types,
        name: name
    };
}
exports.unionCombinator = unionCombinator;
function taggedUnionCombinator(tag, types, name) {
    return {
        kind: 'TaggedUnionCombinator',
        tag: tag,
        types: types,
        name: name
    };
}
exports.taggedUnionCombinator = taggedUnionCombinator;
function intersectionCombinator(types, name) {
    return {
        kind: 'IntersectionCombinator',
        types: types,
        name: name
    };
}
exports.intersectionCombinator = intersectionCombinator;
function keyofCombinator(values, name) {
    return {
        kind: 'KeyofCombinator',
        values: values,
        name: name
    };
}
exports.keyofCombinator = keyofCombinator;
function arrayCombinator(type, name) {
    return {
        kind: 'ArrayCombinator',
        type: type,
        name: name
    };
}
exports.arrayCombinator = arrayCombinator;
function readonlyArrayCombinator(type, name) {
    return {
        kind: 'ReadonlyArrayCombinator',
        type: type,
        name: name
    };
}
exports.readonlyArrayCombinator = readonlyArrayCombinator;
function tupleCombinator(types, name) {
    return {
        kind: 'TupleCombinator',
        types: types,
        name: name
    };
}
exports.tupleCombinator = tupleCombinator;
function recursiveCombinator(typeParameter, name, type) {
    return {
        kind: 'RecursiveCombinator',
        typeParameter: typeParameter,
        name: name,
        type: type
    };
}
exports.recursiveCombinator = recursiveCombinator;
function dictionaryCombinator(domain, codomain, name) {
    return {
        kind: 'DictionaryCombinator',
        domain: domain,
        codomain: codomain,
        name: name
    };
}
exports.dictionaryCombinator = dictionaryCombinator;
function typeDeclaration(name, type, isExported, isReadonly) {
    if (isExported === void 0) { isExported = false; }
    if (isReadonly === void 0) { isReadonly = false; }
    return {
        kind: 'TypeDeclaration',
        name: name,
        type: type,
        isExported: isExported,
        isReadonly: isReadonly
    };
}
exports.typeDeclaration = typeDeclaration;
function customTypeDeclaration(name, staticRepr, runtimeRepr, dependencies) {
    return {
        kind: 'CustomTypeDeclaration',
        name: name,
        static: staticRepr,
        runtime: runtimeRepr,
        dependencies: dependencies
    };
}
exports.customTypeDeclaration = customTypeDeclaration;
var Vertex = /** @class */ (function () {
    function Vertex(id) {
        this.id = id;
        this.afters = [];
    }
    return Vertex;
}());
exports.Vertex = Vertex;
/** topological sort */
function tsort(graph) {
    var sorted = [];
    var visited = {};
    var recursive = {};
    Object.keys(graph).forEach(function visit(id, ancestors) {
        if (visited[id]) {
            return;
        }
        var vertex = graph[id];
        if (!Array.isArray(ancestors)) {
            ancestors = [];
        }
        ancestors.push(id);
        visited[id] = true;
        vertex.afters.forEach(function (afterId) {
            if (ancestors.indexOf(afterId) >= 0) {
                recursive[id] = true;
                recursive[afterId] = true;
            }
            else {
                visit(afterId, ancestors.slice());
            }
        });
        sorted.unshift(id);
    });
    return {
        sorted: sorted.filter(function (id) { return !recursive.hasOwnProperty(id); }),
        recursive: recursive
    };
}
exports.tsort = tsort;
function getTypeDeclarationMap(declarations) {
    var map = {};
    declarations.forEach(function (d) {
        map[d.name] = d;
    });
    return map;
}
exports.getTypeDeclarationMap = getTypeDeclarationMap;
function getTypeDeclarationGraph(declarations, map) {
    var graph = {};
    function visit(vertex, node) {
        switch (node.kind) {
            case 'Identifier':
                if (map.hasOwnProperty(node.name)) {
                    vertex.afters.push(node.name);
                }
                break;
            case 'InterfaceCombinator':
            case 'StrictCombinator':
                node.properties.forEach(function (p) { return visit(vertex, p.type); });
                break;
            case 'TaggedUnionCombinator':
            case 'UnionCombinator':
            case 'IntersectionCombinator':
            case 'TupleCombinator':
                node.types.forEach(function (n) { return visit(vertex, n); });
                break;
            case 'ArrayCombinator':
            case 'ReadonlyArrayCombinator':
                visit(vertex, node.type);
                break;
        }
    }
    declarations.forEach(function (d) {
        var vertex = (graph[d.name] = new Vertex(d.name));
        if (d.kind === 'TypeDeclaration') {
            visit(vertex, d.type);
        }
        else {
            (_a = vertex.afters).push.apply(_a, d.dependencies);
        }
        var _a;
    });
    return graph;
}
exports.getTypeDeclarationGraph = getTypeDeclarationGraph;
var indentations = {
    1: '  ',
    2: '    ',
    3: '      ',
    4: '        ',
    5: '          ',
    6: '            ',
    7: '              ',
    8: '                ',
    9: '                  '
};
function indent(i) {
    if (i === 0) {
        return '';
    }
    return indentations[i] || new Array(i).join("  ");
}
function escapeString(s) {
    return "'" + s.replace(/'/g, "\\'") + "'";
}
function isValidPropertyKey(s) {
    return /[-\/\s]/.exec(s) === null;
}
function addRuntimeName(s, name) {
    if (name) {
        return s + ', ' + escapeString(name);
    }
    return s;
}
function escapePropertyKey(key) {
    return isValidPropertyKey(key) ? key : escapeString(key);
}
function printRuntimeLiteralCombinator(literalCombinator, i) {
    var value = typeof literalCombinator.value === 'string' ? escapeString(literalCombinator.value) : literalCombinator.value;
    var s = "t.literal(" + value;
    s = addRuntimeName(s, literalCombinator.name);
    s += ')';
    return s;
}
function printDescription(description, i) {
    if (description) {
        return indent(i) + "/** " + description + " */\n";
    }
    return '';
}
function containsUndefined(type) {
    if (type.kind === 'UnionCombinator') {
        return type.types.some(containsUndefined);
    }
    else {
        return type.kind === 'UndefinedType';
    }
}
function getRuntimePropertyType(p) {
    if (p.isOptional && !containsUndefined(p.type)) {
        return unionCombinator([p.type, exports.undefinedType]);
    }
    else {
        return p.type;
    }
}
function printRuntimeProperty(p, i) {
    var type = getRuntimePropertyType(p);
    return "" + printDescription(p.description, i) + indent(i) + escapePropertyKey(p.key) + ": " + printRuntime(type, i);
}
function printRuntimeInterfaceCombinator(interfaceCombinator, i) {
    var s = 't.interface({\n';
    s += interfaceCombinator.properties.map(function (p) { return printRuntimeProperty(p, i + 1); }).join(',\n');
    s += "\n" + indent(i) + "}";
    s = addRuntimeName(s, interfaceCombinator.name);
    s += ')';
    return s;
}
function printRuntimePartialCombinator(partialCombinator, i) {
    var s = 't.partial({\n';
    s += partialCombinator.properties.map(function (p) { return printRuntimeProperty(__assign({}, p, { isOptional: false }), i + 1); }).join(',\n');
    s += "\n" + indent(i) + "}";
    s = addRuntimeName(s, partialCombinator.name);
    s += ')';
    return s;
}
function printRuntimeStrictCombinator(strictCombinator, i) {
    var s = 't.strict({\n';
    s += strictCombinator.properties.map(function (p) { return printRuntimeProperty(p, i + 1); }).join(',\n');
    s += "\n" + indent(i) + "}";
    s = addRuntimeName(s, strictCombinator.name);
    s += ')';
    return s;
}
function printRuntimeTypesCombinator(combinatorKind, types, combinatorName, i) {
    var indentation = indent(i + 1);
    var s = "t." + combinatorKind + "([\n";
    s += types.map(function (t) { return "" + indentation + printRuntime(t, i + 1); }).join(',\n');
    s += "\n" + indent(i) + "]";
    s = addRuntimeName(s, combinatorName);
    s += ')';
    return s;
}
function printRuntimeUnionCombinator(c, i) {
    return printRuntimeTypesCombinator('union', c.types, c.name, i);
}
function printRuntimeTaggedUnionCombinator(c, i) {
    var indentation = indent(i + 1);
    var s = "t.taggedUnion(" + escapeString(c.tag) + ", [\n";
    s += c.types.map(function (t) { return "" + indentation + printRuntime(t, i + 1); }).join(',\n');
    s += "\n" + indent(i) + "]";
    s = addRuntimeName(s, c.name);
    s += ')';
    return s;
}
function printRuntimeIntersectionCombinator(c, i) {
    return printRuntimeTypesCombinator('intersection', c.types, c.name, i);
}
function printRuntimeKeyofCombinator(c, i) {
    var indentation = indent(i + 1);
    var s = "t.keyof({\n";
    s += c.values.map(function (v) { return "" + indentation + escapePropertyKey(v) + ": true"; }).join(',\n');
    s += "\n" + indent(i) + "}";
    s = addRuntimeName(s, c.name);
    s += ')';
    return s;
}
function printRuntimeArrayCombinator(c, i) {
    var s = "t.array(" + printRuntime(c.type, i);
    s = addRuntimeName(s, c.name);
    s += ')';
    return s;
}
function printRuntimeReadonlyArrayCombinator(c, i) {
    var s = "t.readonlyArray(" + printRuntime(c.type, i);
    s = addRuntimeName(s, c.name);
    s += ')';
    return s;
}
function printRuntimeTupleCombinator(c, i) {
    return printRuntimeTypesCombinator('tuple', c.types, c.name, i);
}
function printRuntimeTypeDeclaration(declaration, i) {
    var s = printRuntime(declaration.type, i);
    if (declaration.isReadonly) {
        s = "t.readonly(" + s + ")";
    }
    s = "const " + declaration.name + " = " + s;
    if (declaration.isExported) {
        s = "export " + s;
    }
    return s;
}
function printRuntimeRecursiveCombinator(c, i) {
    var s = "t.recursive<" + c.typeParameter.name + ">(" + escapeString(c.name) + ", (" + c.name + ": t.Any) => " + printRuntime(c.type, i);
    return s;
}
function printRuntimeDictionaryCombinator(c, i) {
    var s = "t.dictionary(" + printRuntime(c.domain, i) + ", " + printRuntime(c.codomain, i);
    s = addRuntimeName(s, c.name);
    s += ')';
    return s;
}
function printRuntime(node, i) {
    if (i === void 0) { i = 0; }
    switch (node.kind) {
        case 'Identifier':
            return node.name;
        case 'StringType':
        case 'NumberType':
        case 'BooleanType':
        case 'NullType':
        case 'UndefinedType':
        case 'IntegerType':
        case 'AnyType':
            return "t." + node.name;
        case 'LiteralCombinator':
            return printRuntimeLiteralCombinator(node, i);
        case 'InterfaceCombinator':
            return printRuntimeInterfaceCombinator(node, i);
        case 'PartialCombinator':
            return printRuntimePartialCombinator(node, i);
        case 'StrictCombinator':
            return printRuntimeStrictCombinator(node, i);
        case 'UnionCombinator':
            return printRuntimeUnionCombinator(node, i);
        case 'TaggedUnionCombinator':
            return printRuntimeTaggedUnionCombinator(node, i);
        case 'IntersectionCombinator':
            return printRuntimeIntersectionCombinator(node, i);
        case 'KeyofCombinator':
            return printRuntimeKeyofCombinator(node, i);
        case 'ArrayCombinator':
            return printRuntimeArrayCombinator(node, i);
        case 'ReadonlyArrayCombinator':
            return printRuntimeReadonlyArrayCombinator(node, i);
        case 'TupleCombinator':
            return printRuntimeTupleCombinator(node, i);
        case 'RecursiveCombinator':
            return printRuntimeRecursiveCombinator(node, i);
        case 'DictionaryCombinator':
            return printRuntimeDictionaryCombinator(node, i);
        case 'TypeDeclaration':
            return printRuntimeTypeDeclaration(node, i);
        case 'CustomTypeDeclaration':
            return node.runtime;
    }
}
exports.printRuntime = printRuntime;
function getRecursiveTypeDeclaration(declaration) {
    var name = declaration.name;
    var recursive = recursiveCombinator(identifier(name), name, declaration.type);
    return typeDeclaration(name, recursive, declaration.isExported, declaration.isReadonly);
}
function sort(declarations) {
    var map = getTypeDeclarationMap(declarations);
    var graph = getTypeDeclarationGraph(declarations, map);
    var _a = tsort(graph), sorted = _a.sorted, recursive = _a.recursive;
    var keys = Object.keys(recursive);
    var recursions = [];
    for (var i = 0; i < keys.length; i++) {
        var td = map[name];
        if (td.kind === 'TypeDeclaration') {
            recursions.push(getRecursiveTypeDeclaration(td));
        }
    }
    return sorted
        .reverse()
        .map(function (name) { return map[name]; })
        .concat(recursions);
}
exports.sort = sort;
function printStaticProperty(p, i) {
    var optional = p.isOptional ? '?' : '';
    return "" + printDescription(p.description, i) + indent(i) + escapePropertyKey(p.key) + optional + ": " + printStatic(p.type, i);
}
function printStaticLiteralCombinator(c, i) {
    return typeof c.value === 'string' ? escapeString(c.value) : String(c.value);
}
function printStaticInterfaceCombinator(c, i) {
    var s = '{\n';
    s += c.properties.map(function (p) { return printStaticProperty(p, i + 1); }).join(',\n');
    s += "\n" + indent(i) + "}";
    return s;
}
function printStaticPartialCombinator(c, i) {
    var s = '{\n';
    s += c.properties.map(function (p) { return printStaticProperty(__assign({}, p, { isOptional: true }), i + 1); }).join(',\n');
    s += "\n" + indent(i) + "}";
    return s;
}
function printStaticStrictCombinator(c, i) {
    var s = '{\n';
    s += c.properties.map(function (p) { return printStaticProperty(p, i + 1); }).join(',\n');
    s += "\n" + indent(i) + "}";
    return s;
}
function printStaticTypesCombinator(types, separator, i) {
    var indentation = indent(i + 1);
    return types.map(function (t) { return "\n" + indentation + separator + " " + printStatic(t, i); }).join('');
}
function printStaticUnionCombinator(c, i) {
    return printStaticTypesCombinator(c.types, '|', i);
}
function printStaticTaggedUnionCombinator(c, i) {
    return printStaticTypesCombinator(c.types, '|', i);
}
function printStaticIntersectionCombinator(c, i) {
    return printStaticTypesCombinator(c.types, '&', i);
}
function printStaticKeyofCombinator(c, i) {
    return printStatic(unionCombinator(c.values.map(function (value) { return literalCombinator(value); })), i);
}
function printStaticArrayCombinator(c, i) {
    return "Array<" + printStatic(c.type, i) + ">";
}
function printStaticReadonlyArrayCombinator(c, i) {
    return "ReadonlyArray<" + printStatic(c.type, i) + ">";
}
function printStaticDictionaryCombinator(c, i) {
    return "{ [key: " + printStatic(c.domain, i) + "]: " + printStatic(c.codomain, i) + " }";
}
function printStaticTupleCombinator(c, i) {
    var indentation = indent(i + 1);
    var s = '[\n';
    s += c.types.map(function (t) { return "" + indentation + printStatic(t, i); }).join(',\n');
    s += "\n" + indent(i) + "]";
    return s;
}
function printStaticTypeDeclaration(declaration, i) {
    var s = printStatic(declaration.type, i);
    if ((declaration.type.kind === 'InterfaceCombinator' ||
        declaration.type.kind === 'StrictCombinator' ||
        declaration.type.kind === 'PartialCombinator') &&
        !declaration.isReadonly) {
        s = "interface " + declaration.name + " " + s;
    }
    else {
        if (declaration.isReadonly) {
            s = "Readonly<" + s + ">";
        }
        s = "type " + declaration.name + " = " + s;
    }
    if (declaration.isExported) {
        s = "export " + s;
    }
    return s;
}
function printStatic(node, i) {
    if (i === void 0) { i = 0; }
    switch (node.kind) {
        case 'Identifier':
            return node.name;
        case 'StringType':
        case 'NumberType':
        case 'BooleanType':
        case 'NullType':
        case 'UndefinedType':
        case 'AnyType':
            return node.name;
        case 'IntegerType':
            return 'number';
        case 'LiteralCombinator':
            return printStaticLiteralCombinator(node, i);
        case 'InterfaceCombinator':
            return printStaticInterfaceCombinator(node, i);
        case 'PartialCombinator':
            return printStaticPartialCombinator(node, i);
        case 'StrictCombinator':
            return printStaticStrictCombinator(node, i);
        case 'UnionCombinator':
            return printStaticUnionCombinator(node, i);
        case 'TaggedUnionCombinator':
            return printStaticTaggedUnionCombinator(node, i);
        case 'IntersectionCombinator':
            return printStaticIntersectionCombinator(node, i);
        case 'KeyofCombinator':
            return printStaticKeyofCombinator(node, i);
        case 'ArrayCombinator':
            return printStaticArrayCombinator(node, i);
        case 'ReadonlyArrayCombinator':
            return printStaticReadonlyArrayCombinator(node, i);
        case 'TupleCombinator':
            return printStaticTupleCombinator(node, i);
        case 'RecursiveCombinator':
            return printStatic(node.type, i);
        case 'DictionaryCombinator':
            return printStaticDictionaryCombinator(node, i);
        case 'TypeDeclaration':
            return printStaticTypeDeclaration(node, i);
        case 'CustomTypeDeclaration':
            return node.static;
    }
}
exports.printStatic = printStatic;
//# sourceMappingURL=index.js.map