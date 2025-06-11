import _import from "eslint-plugin-import";
import importHelpers from "eslint-plugin-import-helpers";
import jsdoc from "eslint-plugin-jsdoc";
import preferArrow from "eslint-plugin-prefer-arrow";
import unusedImports from "eslint-plugin-unused-imports";
import angularEslintEslintPlugin from "@angular-eslint/eslint-plugin";
import angularEslintEslintPluginTemplate from "@angular-eslint/eslint-plugin-template";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import stylistic from "@stylistic/eslint-plugin";
import { fixupPluginRules } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [{
  ignores: [
    "node_modules/*",
    "**/custom-elements.json",
    "projects/**/*",
    "dist/*",
    "**/*.js",
    "**/*.styles.ts",
  ],
}, ...compat.extends(
  "plugin:@angular-eslint/recommended",
  "plugin:@angular-eslint/template/process-inline-templates",
).map(config => ({
  ...config,
  files: ["**/*.ts"],
})), {
  files: ["**/*.ts"],

  plugins: {
    import: fixupPluginRules(_import),
    "import-helpers": importHelpers,
    jsdoc,
    "prefer-arrow": preferArrow,
    "unused-imports": unusedImports,
    "@angular-eslint": angularEslintEslintPlugin,
    "@angular-eslint/template": angularEslintEslintPluginTemplate,
    "@typescript-eslint": typescriptEslint,
    "@stylistic": stylistic,
  },

  languageOptions: {
    parser: tsParser,
    ecmaVersion: 5,
    sourceType: "script",

    parserOptions: {
      project: ["tsconfig.json"],
      createDefaultProgram: true,
    },
  },

  rules: {
    "@angular-eslint/directive-selector": ["error", {
      type: "attribute",
      prefix: "app",
      style: "camelCase",
    }],

    "@angular-eslint/component-selector": ["error", {
      type: "element",
      prefix: "app",
      style: "kebab-case",
    }],

    "@angular-eslint/no-conflicting-lifecycle": "error",
    "@angular-eslint/no-input-rename": "error",
    "@angular-eslint/no-inputs-metadata-property": "error",
    "@angular-eslint/no-output-native": "error",
    "@angular-eslint/no-output-on-prefix": "error",
    "@angular-eslint/no-output-rename": "error",
    "@angular-eslint/no-outputs-metadata-property": "error",
    "@angular-eslint/use-lifecycle-interface": "error",
    "@angular-eslint/use-pipe-transform-interface": "error",
    "@angular-eslint/prefer-standalone": "off",

    "@stylistic/array-bracket-newline": ["error", {
      multiline: true,
    }],

    "@stylistic/array-bracket-spacing": ["error", "never"],
    "@stylistic/array-element-newline": ["error", "consistent"],
    "@stylistic/arrow-parens": ["error", "as-needed"],
    "@stylistic/block-spacing": "error",
    "@stylistic/brace-style": "error",
    "@stylistic/comma-dangle": ["error", "always-multiline"],
    "@stylistic/comma-spacing": "error",
    "@stylistic/comma-style": "error",
    "@stylistic/computed-property-spacing": "error",
    "@stylistic/curly-newline": ["error", "always"],
    "@stylistic/dot-location": ["error", "property"],
    "@stylistic/eol-last": "error",
    "@stylistic/function-call-spacing": "error",
    "@stylistic/function-call-argument-newline": ["error", "consistent"],

    "@stylistic/indent": ["error", 2, {
      SwitchCase: 1,

      FunctionDeclaration: {
        parameters: "first",
      },

      FunctionExpression: {
        parameters: "first",
      },

      VariableDeclarator: "first",
      ObjectExpression: "first",
    }],

    "@stylistic/indent-binary-ops": ["error", 2],

    "@stylistic/key-spacing": ["error", {
      afterColon: true,
    }],

    "@stylistic/keyword-spacing": "error",

    "@stylistic/lines-between-class-members": ["error", {
      enforce: [{
        blankLine: "always",
        prev: "method",
        next: "*",
      }],
    }, {
      exceptAfterSingleLine: true,
    }],

    "@stylistic/member-delimiter-style": ["error", {
      multiline: {
        delimiter: "semi",
        requireLast: true,
      },

      singleline: {
        delimiter: "semi",
        requireLast: false,
      },
    }],

    "@stylistic/new-parens": "error",
    "@stylistic/newline-per-chained-call": "error",

    "@stylistic/no-extra-parens": ["error", "all", {
      conditionalAssign: false,
      nestedBinaryExpressions: false,
      nestedConditionalExpressions: false,
      ternaryOperandBinaryExpressions: false,
    }],

    "@stylistic/no-extra-semi": "error",
    "@stylistic/no-multi-spaces": "error",

    "@stylistic/no-multiple-empty-lines": ["error", {
      max: 1,
      maxEOF: 0,
      maxBOF: 0,
    }],

    "@stylistic/no-tabs": "error",
    "@stylistic/no-trailing-spaces": "error",
    "@stylistic/no-whitespace-before-property": "error",

    "@stylistic/object-curly-newline": ["error", {
      consistent: true,
    }],

    "@stylistic/object-curly-spacing": ["error", "always"],
    "@stylistic/one-var-declaration-per-line": ["error", "always"],

    "@stylistic/operator-linebreak": ["error", "before", {
      overrides: {
        "=": "after",
        "+=": "after",
        "-=": "after",
        "=+": "after",
        "=_": "after",
      },
    }],

    "@stylistic/quote-props": ["error", "as-needed"],
    "@stylistic/quotes": ["error", "single"],
    "@stylistic/rest-spread-spacing": "error",
    "@stylistic/semi": ["error", "always"],
    "@stylistic/semi-spacing": "error",
    "@stylistic/semi-style": "error",
    "@stylistic/space-before-blocks": "error",

    "@stylistic/space-before-function-paren": ["error", {
      anonymous: "always",
      named: "never",
      asyncArrow: "always",
    }],

    "@stylistic/space-in-parens": ["error", "never"],
    "@stylistic/space-infix-ops": "error",
    "@stylistic/space-unary-ops": "error",
    "@stylistic/spaced-comment": "error",
    "@stylistic/switch-colon-spacing": "error",
    "@stylistic/template-curly-spacing": "error",
    "@stylistic/template-tag-spacing": "error",
    "@stylistic/type-annotation-spacing": "error",
    "@stylistic/type-generic-spacing": "error",
    "@stylistic/type-named-tuple-spacing": "error",
    "@stylistic/wrap-iife": ["error", "inside"],
    "@stylistic/wrap-regex": "error",
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/class-literal-property-style": "error",
    "@typescript-eslint/consistent-generic-constructors": "error",
    "@typescript-eslint/consistent-indexed-object-style": "error",
    "@typescript-eslint/consistent-type-assertions": "error",
    "default-param-last": "off",
    "@typescript-eslint/default-param-last": "error",
    "dot-notation": "off",
    "@typescript-eslint/dot-notation": "error",

    "@typescript-eslint/explicit-member-accessibility": ["error", {
      accessibility: "no-public",
    }],

    "@typescript-eslint/member-ordering": "off",
    "no-array-constructor": "off",
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-array-delete": "error",
    "@typescript-eslint/no-confusing-non-null-assertion": "error",
    "no-dupe-class-members": "off",
    "@typescript-eslint/no-dupe-class-members": "error",
    "@typescript-eslint/no-duplicate-enum-values": "error",
    "@typescript-eslint/no-duplicate-type-constituents": "error",
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/no-empty-object-type": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-extra-non-null-assertion": "error",
    "@typescript-eslint/no-for-in-array": "error",
    "no-implied-eval": "off",
    "@typescript-eslint/no-implied-eval": "error",

    "@typescript-eslint/no-inferrable-types": ["error", {
      ignoreParameters: true,
    }],

    "no-loss-of-precision": "off",
    "@typescript-eslint/no-loss-of-precision": "error",
    "@typescript-eslint/no-meaningless-void-operator": "error",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-misused-spread": "error",
    "@typescript-eslint/no-mixed-enums": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-require-imports": "error",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-unnecessary-parameter-property-assignment": "error",
    "@typescript-eslint/no-unnecessary-qualifier": "error",
    "@typescript-eslint/no-unnecessary-template-expression": "error",
    "@typescript-eslint/no-unnecessary-type-arguments": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-unnecessary-type-constraint": "error",
    "@typescript-eslint/no-unnecessary-type-parameters": "error",
    "@typescript-eslint/no-unsafe-declaration-merging": "error",
    "@typescript-eslint/no-unsafe-enum-comparison": "error",
    "@typescript-eslint/no-unsafe-function-type": "error",
    "@typescript-eslint/no-unsafe-unary-minus": "error",
    "@typescript-eslint/no-unused-expressions": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "off",
    "@typescript-eslint/no-useless-empty-export": "error",
    "@typescript-eslint/no-wrapper-object-types": "error",
    "@typescript-eslint/non-nullable-type-assertion-style": "error",
    "@typescript-eslint/only-throw-error": "error",

    "@typescript-eslint/parameter-properties": ["error", {
      allow: [
        "readonly",
        "private",
        "protected",
        "private readonly",
        "protected readonly",
      ],
    }],

    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/prefer-find": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/prefer-includes": "error",
    "@typescript-eslint/prefer-literal-enum-member": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/prefer-reduce-type-parameter": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "require-await": "off",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/restrict-plus-operands": "error",

    "@typescript-eslint/triple-slash-reference": ["error", {
      path: "always",
      types: "prefer-import",
      lib: "always",
    }],

    "@typescript-eslint/unified-signatures": "off",
    "arrow-body-style": "error",
    complexity: "off",
    "constructor-super": "error",
    curly: "error",
    eqeqeq: ["error", "smart"],
    "guard-for-in": "error",

    "id-blacklist": [
      "error",
      "any",
      "Number",
      "number",
      "String",
      "string",
      "Boolean",
      "boolean",
      "Undefined",
      "undefined",
    ],

    "id-match": "error",
    "no-lonely-if": "error",

    "no-else-return": ["error", {
      allowElseIf: false,
    }],

    "padding-line-between-statements": ["error", {
      blankLine: "always",
      prev: "block-like",
      next: "*",
    }, {
      blankLine: "always",
      prev: "*",
      next: "block-like",
    }],

    "max-classes-per-file": "off",

    "max-len": ["error", {
      code: 200,
    }],

    "no-bitwise": "error",
    "no-caller": "error",
    "no-cond-assign": "error",

    "no-console": ["error", {
      allow: [
        "log",
        "warn",
        "dir",
        "timeLog",
        "assert",
        "clear",
        "count",
        "countReset",
        "group",
        "groupEnd",
        "table",
        "dirxml",
        "error",
        "groupCollapsed",
        "Console",
        "profile",
        "profileEnd",
        "timeStamp",
        "context",
      ],
    }],

    "no-debugger": "error",
    "no-empty": "off",
    "no-eval": "error",
    "no-fallthrough": "error",
    "no-invalid-this": "off",
    "no-new-wrappers": "error",
    "no-restricted-imports": ["error", "rxjs/Rx"],
    "no-throw-literal": "error",
    "no-undef-init": "error",
    "no-unsafe-finally": "error",
    "no-unused-labels": "error",
    "no-unused-private-class-members": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "one-var": ["error", "never"],
    "prefer-arrow/prefer-arrow-functions": "error",
    "prefer-const": "error",
    radix: "error",
    "sort-keys": 0,
    "use-isnan": "error",
    "valid-typeof": "off",
    "jsdoc/check-alignment": "error",
    "jsdoc/check-indentation": "error",
    "jsdoc/no-types": "error",
    "import/no-deprecated": "warn",

    "import-helpers/order-imports": ["error", {
      alphabetize: {
        order: "asc",
        ignoreCase: true,
      },

      newlinesBetween: "always",

      groups: [
        "/^@angular|^rxjs/",
        "/^@lit/",
        "/^lit/",
        "module",
        ["parent", "sibling", "index"],
      ],
    }],

    "unused-imports/no-unused-imports": "error",

    "unused-imports/no-unused-vars": ["error", {
      vars: "all",
      varsIgnorePattern: "^_",
      args: "after-used",
      argsIgnorePattern: "^_",
    }],
  },
}, ...compat.extends("plugin:@angular-eslint/template/recommended").map(config => ({
  ...config,
  files: ["**/*.html"],
})), {
  files: ["**/*.html"],
  rules: {},
}];
