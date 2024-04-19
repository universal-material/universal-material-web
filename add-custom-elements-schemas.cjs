const customElementsSchemas = [
  './custom-elements.json'
]

const customElementsDefinitions = [];

for (const customElementSchema of customElementsSchemas) {
  const customElements = require(customElementSchema);
  customElementsDefinitions.push(customElements);
}

function parsePropertyType(type) {
  switch (type) {
    case 'boolean':
      return '!';
    case 'number':
      return '#';
    default:
      return '';
  }
}

function buildElementDefinition(name, properties) {
  return `${name}^[HTMLElement]|${properties.join(',')}`;
}

function mapSchema(customElementsDefinition, SCHEMAS) {
  for (const module of customElementsDefinition.modules) {

    const customElementDefinition = module.exports.find(e => e.kind === 'custom-element-definition');
    const classDeclaration = module.declarations.find(e => e.kind === 'class');

    if (!classDeclaration || !customElementDefinition) {
      continue;
    }

    const properties = [];

    if (classDeclaration.attributes) {
      for (const attr of classDeclaration.attributes) {
        properties.push(`${parsePropertyType(attr.type?.text)}${attr.name}`);
      }
    }

    SCHEMAS.push(buildElementDefinition(customElementDefinition.name, properties));
  }
}

exports.mapSchemas = SCHEMAS => {
  for (const customElementsDefinition of customElementsDefinitions) {
    mapSchema(customElementsDefinition, SCHEMAS)
  }
}
