# Change Log

## 5.1.1

- Fix the `Fix order` suggestion leaving comments behind ([#102](https://github.com/fxOne/eslint-plugin-sort-keys-shorthand/issues/102)). A property's leading and trailing comments now travel with it, so suppression comments such as `eslint-disable-next-line` and `@ts-expect-error` no longer end up on a different property. Blank lines, commas and indentation stay at their position. The suggestion is withheld in the rare case where a line comment cannot be placed without commenting out the code behind it.
- Fix the `Fix order` suggestion doing nothing when the sorted region contains a key the rule cannot name, such as a computed template literal with an expression. Those keys now keep their position - the check skips them too - while the keys around them are sorted.
- Document the `Fix order` suggestion in the rule docs.
- Update dev dependencies and drop the unused `eslint-plugin-import`; `pnpm audit` is clean again.

## 5.1.0

- Reworked the `Fix order` suggestion so that applying it sorts the entire spread-bounded region around the reported key in a single step, instead of only swapping it with its immediate neighbour.

## 5.0.0

### Major Changes

- c26e3a1: Add ESLint 10 support. This is a breaking change — ESLint 9 is no longer supported.

  - Replace deprecated `context.getSourceCode()` with `context.sourceCode` (fixes #96)
  - Update peer dependency to `eslint ^10.0.0`
  - Update all dev dependencies to latest versions

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## To Be Released

## 3.0.0

- Update to eslint 9

## 2.3.0

- Add support for suggestions

## 2.2.0

- Support ESLint 8 [#16](https://github.com/fxOne/eslint-plugin-sort-keys-shorthand/issues/14)

## 2.1.0

- Support ESLint 7

## 2.0.0

- Add support for ignoreSingleline

## 1.0.0

- Initial release
