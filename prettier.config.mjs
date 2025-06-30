/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 * @type {import("prettier-plugin-organize-attributes").PrettierPluginOrganizeAttributesParserOptions}
 */
const config = {
  tabWidth: 2,
  printWidth: 120,
  singleAttributePerLine: true,
  plugins: ['prettier-plugin-organize-attributes'],
  attributeGroups: [
    "^class$",
    "$ANGULAR_STRUCTURAL_DIRECTIVE",
    "^slot$",
    "^(id|name)$",
    "^type$",
    "^variant$",
    "$DEFAULT",
    "^aria-",
    "^\\(click\\)$",
  ],
};

export default config;
