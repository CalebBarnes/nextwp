/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

const project = "./tsconfig.json";

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/node",
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/react",
    "@vercel/style-guide/eslint/next",
    // "eslint-config-turbo",
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/"],
  // add rules configurations here
  rules: {
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    camelcase: "off",
    "import/no-named-as-default": "off",
    "@typescript-eslint/restrict-template-expressions": "warn",
    "@typescript-eslint/no-base-to-string": "warn",
    "@typescript-eslint/no-misused-promises": "warn",
    "@typescript-eslint/non-nullable-type-assertion-style": "warn",
    "@typescript-eslint/consistent-indexed-object-style": "warn",
    "no-implicit-coercion": "warn",
    "no-extra-boolean-cast": "warn",
    "@typescript-eslint/no-shadow": "warn",
    "@typescript-eslint/no-confusing-void-expression": "warn",
    "no-param-reassign": "warn",
    "@typescript-eslint/require-await": "warn",
    "no-return-await": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-floating-promises": "warn",
    "no-case-declarations": "warn",
    // "turbo/no-undeclared-env-vars": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "no-console": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",

    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "import/no-named-as-default-member": "off",
    "import/no-default-export": "off",
    "import/no-extraneous-dependencies": "off",
    "import/order": [
      "warn",
      {
        groups: [
          "builtin", // Node.js built-in modules
          "external", // Packages
          "internal", // Aliased modules
          "parent", // Relative parent
          "sibling", // Relative sibling
          "index", // Relative index
        ],
        "newlines-between": "never",
        pathGroups: [
          {
            pattern: "@/**",
            group: "internal",
            position: "after",
          },
          {
            pattern: "ui/**",
            group: "internal",
            position: "after",
          },
        ],
        distinctGroup: false,
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
  },
};
