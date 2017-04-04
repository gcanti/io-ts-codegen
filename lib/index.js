"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringType = {
    kind: 'StringType',
    name: 'string'
};
exports.numberType = {
    kind: 'NumberType',
    name: 'number'
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
function interfaceCombinator(properties, name) {
    return {
        kind: 'InterfaceCombinator',
        properties: properties,
        name: name
    };
}
exports.interfaceCombinator = interfaceCombinator;
function unionCombinator(types, name) {
    return {
        kind: 'UnionCombinator',
        types: types,
        name: name
    };
}
exports.unionCombinator = unionCombinator;
function intersectionCombinator(types, name) {
    return {
        kind: 'IntersectionCombinator',
        types: types,
        name: name
    };
}
exports.intersectionCombinator = intersectionCombinator;
function enumCombinator(values, name) {
    return {
        kind: 'EnumCombinator',
        values: values,
        name: name
    };
}
exports.enumCombinator = enumCombinator;
function arrayCombinator(type, name) {
    return {
        kind: 'ArrayCombinator',
        type: type,
        name: name
    };
}
exports.arrayCombinator = arrayCombinator;
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
var Vertex = (function () {
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
    declarations.forEach(function (d) { map[d.name] = d; });
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
                node.properties.forEach(function (p) { return visit(vertex, p.type); });
                break;
            case 'UnionCombinator':
            case 'IntersectionCombinator':
            case 'TupleCombinator':
                node.types.forEach(function (n) { return visit(vertex, n); });
                break;
            case 'ArrayCombinator':
                visit(vertex, node.type);
                break;
        }
    }
    declarations.forEach(function (d) {
        var vertex = graph[d.name] = new Vertex(d.name);
        visit(vertex, d.type);
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
    return '\'' + s.replace(/'/g, "\\'") + '\'';
}
function isValidPropertyKey(s) {
    return /[-\s]/.exec(s) === null;
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
function printRuntimeProperty(property, i) {
    var type = property.isOptional ? unionCombinator([property.type, exports.undefinedType]) : property.type;
    return "" + printDescription(property.description, i) + indent(i) + escapePropertyKey(property.key) + ": " + printRuntime(type, i);
}
function printRuntimeInterfaceCombinator(interfaceCombinator, i) {
    var s = 't.interface({\n';
    s += interfaceCombinator.properties.map(function (p) { return printRuntimeProperty(p, i + 1); }).join(',\n');
    s += "\n" + indent(i) + "}";
    s = addRuntimeName(s, interfaceCombinator.name);
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
function printRuntimeIntersectionCombinator(c, i) {
    return printRuntimeTypesCombinator('intersection', c.types, c.name, i);
}
function printRuntimeEnumCombinator(c, i) {
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
            return "t." + node.name;
        case 'LiteralCombinator':
            return printRuntimeLiteralCombinator(node, i);
        case 'InterfaceCombinator':
            return printRuntimeInterfaceCombinator(node, i);
        case 'UnionCombinator':
            return printRuntimeUnionCombinator(node, i);
        case 'IntersectionCombinator':
            return printRuntimeIntersectionCombinator(node, i);
        case 'EnumCombinator':
            return printRuntimeEnumCombinator(node, i);
        case 'ArrayCombinator':
            return printRuntimeArrayCombinator(node, i);
        case 'TupleCombinator':
            return printRuntimeTupleCombinator(node, i);
        case 'RecursiveCombinator':
            return printRuntimeRecursiveCombinator(node, i);
        case 'DictionaryCombinator':
            return printRuntimeDictionaryCombinator(node, i);
        case 'TypeDeclaration':
            return printRuntimeTypeDeclaration(node, i);
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
    var recursions = Object.keys(recursive).map(function (name) { return getRecursiveTypeDeclaration(map[name]); });
    return sorted.reverse().map(function (name) { return map[name]; }).concat(recursions);
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
function printStaticTypesCombinator(types, separator, i) {
    var indentation = indent(i + 1);
    return types.map(function (t) { return "\n" + indentation + separator + " " + printStatic(t, i); }).join('');
}
function printStaticUnionCombinator(c, i) {
    return printStaticTypesCombinator(c.types, '|', i);
}
function printStaticIntersectionCombinator(c, i) {
    return printStaticTypesCombinator(c.types, '&', i);
}
function printStaticEnumCombinator(c, i) {
    return printStatic(unionCombinator(c.values.map(function (value) { return literalCombinator(value); })), i);
}
function printStaticArrayCombinator(c, i) {
    return "Array<" + printStatic(c.type, i) + ">";
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
    if (declaration.isReadonly) {
        s = "Readonly<" + s + ">";
    }
    s = "type " + declaration.name + " = " + s;
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
            return node.name;
        case 'LiteralCombinator':
            return printStaticLiteralCombinator(node, i);
        case 'InterfaceCombinator':
            return printStaticInterfaceCombinator(node, i);
        case 'UnionCombinator':
            return printStaticUnionCombinator(node, i);
        case 'IntersectionCombinator':
            return printStaticIntersectionCombinator(node, i);
        case 'EnumCombinator':
            return printStaticEnumCombinator(node, i);
        case 'ArrayCombinator':
            return printStaticArrayCombinator(node, i);
        case 'TupleCombinator':
            return printStaticTupleCombinator(node, i);
        case 'RecursiveCombinator':
            return printStatic(node.type, i);
        case 'DictionaryCombinator':
            return printStaticDictionaryCombinator(node, i);
        case 'TypeDeclaration':
            return printStaticTypeDeclaration(node, i);
    }
}
exports.printStatic = printStatic;
//# sourceMappingURL=index.js.map