import { SyntaxKind } from 'ts-morph';

function getAttributeName(property) {
  const decorators = property.getDecorators();
  const propertyDecorator = decorators.find(d => d.getName() === 'property');

  if (!propertyDecorator) {
    return null;
  }

  const optionsArgument = propertyDecorator.getArguments()[0];

  if (!optionsArgument) {
    return property.getName();
  }

  return optionsArgument
    .getProperty('attribute')
    ?.getInitializer()
    ?.getText()
    ?.replaceAll(`'`, '') ?? property.getName();
}

function getJsDocsDescription(property) {
  const jsDocs = property.getJsDocs()[0];

  if (!jsDocs) {
    return null;
  }

  return jsDocs.getDescription().trim();
}

export function setClassInfo(classDeclaration, classInfo) {

  if (!classDeclaration || classDeclaration.getSourceFile().getFilePath().includes('node_modules')) {
    return;
  }

  for (const property of classDeclaration.getProperties().concat(classDeclaration.getGetAccessors())) {

    const propertyName = property.getName();

    if (property.isStatic()
      || property.hasModifier(SyntaxKind.PrivateKeyword)
      || property.hasModifier(SyntaxKind.ProtectedKeyword)
      || propertyName.startsWith('#')) {
      continue;
    }

    const attributeName = getAttributeName(property);

    const description = getJsDocsDescription(property);
    const typeText = property
      .getType()
      .getBaseTypeOfLiteralType()
      .getText();

    classInfo.push({
      type: typeText.includes('|')
        ? 'string'
        : typeText.replace(/import\(.+?\)\./, ''),
      attribute: attributeName,
      default: property.getInitializer
        ? property.getInitializer()?.getText() ?? 'undefined'
        : null,
      name: propertyName.startsWith('_')
        ? null
        : propertyName,
      description: description
    });
  }

  setClassInfo(classDeclaration.getBaseClass(), classInfo);
}
