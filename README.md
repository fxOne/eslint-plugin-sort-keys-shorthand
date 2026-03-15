# ESLint-plugin-sort-keys-shorthand

Extended sort-keys rule with shorthand property support, since ESLint doesn't want to support it natively.

- https://github.com/eslint/eslint/issues/7543

## Requirements

- **ESLint 10+**
- **Node.js 20+**

> **Note:** For ESLint 9 support, use [v3.x](https://github.com/fxOne/eslint-plugin-sort-keys-shorthand/tree/v3.0.0).

## Installation

```sh
npm install eslint-plugin-sort-keys-shorthand --save-dev
```

## Configuration

This plugin uses the ESLint [flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new) format. Create an `eslint.config.js` in your project root:

```js
import sortKeysShorthand from 'eslint-plugin-sort-keys-shorthand';

export default [
  {
    plugins: {
      'sort-keys-shorthand': sortKeysShorthand
    },
    rules: {
      'sort-keys-shorthand/sort-keys-shorthand': [
        'error',
        'asc',
        {
          caseSensitive: true,
          minKeys: 2,
          natural: false,
          shorthand: 'first'
        }
      ]
    }
  }
];
```

## Rules

- [sort-keys-shorthand/sort-keys-shorthand](docs/rules/sort-keys-shorthand.md): extended rule with shorthand support

Pushing a `v*` tag triggers the release workflow, which runs tests, publishes to npm with provenance, and creates a GitHub Release.
