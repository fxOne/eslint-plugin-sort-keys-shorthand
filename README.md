# ESLint-plugin-sort-keys-shorthand

Extended short-key rule to handle shorthand properties as ESLint doesn't want to support it

- https://github.com/eslint/eslint/issues/7543

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally. (Note that locally, per project, is strongly preferred)

```sh
$ npm install eslint --save-dev
```

If you installed `ESLint` globally, you have to install React plugin globally too. Otherwise, install it locally.

```sh
$ npm install eslint-plugin-sort-keys-shorthand --save-dev
```

# Configuration

Add "sort-keys-shorthand" to the plugins section.

```json
{
  "plugins": ["sort-keys-shorthand"]
}
```

# Rules

- [sort-keys-shorthand/sort-keys-shorthand](docs/rules/sort-keys-shorthand.md): extended rule with shorthand support
