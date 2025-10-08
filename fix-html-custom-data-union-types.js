import ts from 'typescript';
import htmlCustomData from './vscode.html-custom-data.json' with { type: 'json' };
import fs from 'fs';

const unionValuesMap = {};

const program = ts.createProgram(['src/index.ts'], {});
const checker = program.getTypeChecker();

for (const sourceFile of program.getSourceFiles()) {
  if (sourceFile.isDeclarationFile) continue; // Ignore .d.ts
  ts.forEachChild(sourceFile, visit);
}

function visit(node) {
  if (ts.isTypeAliasDeclaration(node)) {
    const name = node.name.text;
    const type = checker.getTypeAtLocation(node);

    const unionValues = extractUnionLiterals(type);
    if (unionValues) {
      unionValuesMap[name] = unionValues;
    }
  }
}

function extractUnionLiterals(type) {
  if (!type.isUnion()) return null;

  const values = [];
  for (const subType of type.types) {
    if (subType.isStringLiteral()) {
      values.push(subType.value);
    }
  }

  return values.length ? values : null;
}

for (const tag of htmlCustomData.tags) {
  for (const attribute of tag.attributes) {
    const values = [...attribute.values];
    for (const value of values) {

      const replacement = replaceUnionType(value);

      if (replacement !== value) {
        attribute.values.splice(attribute.values.indexOf(value), 1, ...replacement);
      }
    }

  }
}

function replaceUnionType(value) {
  if (!value.name.startsWith('Um') || !unionValuesMap[value.name]) {
    return value;
  }

  const unionValues = unionValuesMap[value.name];

  return unionValues.map(unionValue => ({
    name: unionValue
  }));
}

fs.writeFileSync('vscode.html-custom-data.json', JSON.stringify(htmlCustomData, null, 2));
