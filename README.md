# ESLint-plugin-sort-keys-shorthand

Extended short-key rule to handle shorthand properties as ESLint doesn't want to support it

- https://github.com/eslint/eslint/issues/7543

# ESLint 9+ Support

This plugin is compatible with **ESLint 9 and above**. If you are using ESLint 9+, please use the new [flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new) format as shown below.

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally. (Note that locally, per project, is strongly preferred)

```sh
$ npm install eslint --save-dev
```

If you installed `ESLint` globally, you have to install this plugin globally too. Otherwise, install it locally.

```sh
$ npm install eslint-plugin-sort-keys-shorthand --save-dev
```

# Configuration (ESLint 9+ Flat Config Example)

Create an `eslint.config.js` file in your project root:

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

# Migration from .eslintrc

If you are migrating from `.eslintrc` to flat config, move your plugin and rule configuration as shown above. The old `.eslintrc` format is no longer recommended for ESLint 9+.

# Rules

- [sort-keys-shorthand/sort-keys-shorthand](docs/rules/sort-keys-shorthand.md): extended rule with shorthand support
