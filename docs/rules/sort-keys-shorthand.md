# require object keys to be sorted (sort-keys)

When declaring multiple properties, some developers prefer to sort property names alphabetically to be able to find necessary property easier at the later time. Others feel that it adds complexity and becomes burden to maintain.

## Rule Details

This rule checks all property definitions of object expressions and verifies that all variables are sorted alphabetically.

Examples of **incorrect** code for this rule:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: "error"*/
/*eslint-env es6*/

let obj = { a: 1, c: 3, b: 2 };
let obj = { a: 1, c: 3, b: 2 };

// Case-sensitive by default.
let obj = { a: 1, b: 2, C: 3 };

// Non-natural order by default.
let obj = { 1: a, 2: c, 10: b };

// This rule checks computed properties which have a simple name as well.
// Simple names are names which are expressed by an Identifier node or a Literal node.
const S = Symbol('s');
let obj = { a: 1, ['c']: 3, b: 2 };
let obj = { a: 1, [S]: 3, b: 2 };
```

Examples of **correct** code for this rule:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: "error"*/
/*eslint-env es6*/

let obj = { a: 1, b: 2, c: 3 };
let obj = { a: 1, b: 2, c: 3 };

// Case-sensitive by default.
let obj = { C: 3, a: 1, b: 2 };

// Non-natural order by default.
let obj = { 1: a, 10: b, 2: c };

// This rule checks computed properties which have a simple name as well.
let obj = { a: 1, ['b']: 2, c: 3 };
let obj = { a: 1, [b]: 2, c: 3 };

// This rule ignores computed properties which have a non-simple name.
let obj = { a: 1, [c + d]: 3, b: 2 };
let obj = { a: 1, ['c' + 'd']: 3, b: 2 };
let obj = { a: 1, [`${c}`]: 3, b: 2 };
let obj = { a: 1, [tag`c`]: 3, b: 2 };

// This rule does not report unsorted properties that are separated by a spread property.
let obj = { b: 1, ...c, a: 2 };
```

## The `Fix order` suggestion

Every report offers a `Fix order` suggestion. It is a suggestion rather than an
auto-fix because re-ordering properties can change behaviour — think getters,
spread precedence or a key whose value depends on evaluation order. Applying it
is therefore always an explicit decision.

The suggestion sorts the **whole region** the reported property belongs to, not
just the two properties named in the message. A region is bounded by spread
properties, matching what the rule itself checks:

```js
// applying the suggestion on `a` sorts `d, a` and leaves `f, e` untouched
let obj = { d: 1, a: 2, ...x, f: 3, e: 4 };
```

A computed key the rule cannot name — a template literal with an expression, a
member expression — is skipped by the check, so the suggestion leaves it at its
position and sorts the keys around it:

```js
// applying the suggestion sorts `b, a` and leaves `[k.x]` where it is
let obj = { b: 1, [k.x]: 2, a: 3 };
```

Comments travel with their property:

- A comment on its own line above a property is that property's **leading**
  comment and moves with it. This includes suppression comments such as
  `eslint-disable-next-line` and `@ts-expect-error`, which would otherwise end
  up suppressing a different property.
- A comment that starts on the property's last line is its **trailing** comment
  and moves with it, landing after the comma of its new position.
- A comment on the object's opening line describes the object, and a comment on
  its own line after the last property belongs to no property. Both stay where
  they are.

Blank lines, commas and indentation are separators: they keep their positions.
A blank line therefore does not follow the property it used to precede, and
blank-line grouping is not preserved — the sort dissolves those groups anyway.

Two remaining limitations:

- Nested objects need one application per nesting level. Sorting an outer object
  does not sort the objects inside its values.
- The suggestion is withheld when a line comment cannot be placed without
  commenting out the code behind it, for example when it would have to move to
  the last position of a single-line object.

## Options

```json
{
  "sort-keys-shorthand/sort-keys-shorthand": [
    "error",
    "asc",
    {
      "caseSensitive": true,
      "ignoreSingleline": false,
      "minKeys": 2,
      "natural": false,
      "shorthand": "ignore"
    }
  ]
}
```

The 1st option is `"asc"` or `"desc"`.

- `"asc"` (default) - enforce properties to be in ascending order.
- `"desc"` - enforce properties to be in descending order.

The 2nd option is an object which has 3 properties.

- `caseSensitive` - if `true`, enforce properties to be in case-sensitive order. Default is `true`.
- `ignoreSingleline` - if `true`, this rule is ignored on single line objects. Default is `false`.
- `minKeys` - Specifies the minimum number of keys that an object should have in order for the object's unsorted keys to produce an error. Default is `2`, which means by default all objects with unsorted keys will result in lint errors.
- `natural` - if `true`, enforce properties to be in natural order. Default is `false`. Natural Order compares strings containing combination of letters and numbers in the way a human being would sort. It basically sorts numerically, instead of sorting alphabetically. So the number 10 comes after the number 3 in Natural Sorting.
- `shorthand` handling for shorthand properties
  - `ignore` no rules for shorthands
  - `first` shorthand properties must be first
  - `last` shrothand properties must be last

Example for a list:

With `natural` as true, the ordering would be
1
3
6
8
10

With `natural` as false, the ordering would be
1
10
3
6
8

### desc

Examples of **incorrect** code for the `"desc"` option:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: ["error", "desc"]*/
/*eslint-env es6*/

let obj = { b: 2, c: 3, a: 1 };
let obj = { b: 2, c: 3, a: 1 };

// Case-sensitive by default.
let obj = { C: 1, b: 3, a: 2 };

// Non-natural order by default.
let obj = { 10: b, 2: c, 1: a };
```

Examples of **correct** code for the `"desc"` option:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: ["error", "desc"]*/
/*eslint-env es6*/

let obj = { c: 3, b: 2, a: 1 };
let obj = { c: 3, b: 2, a: 1 };

// Case-sensitive by default.
let obj = { b: 3, a: 2, C: 1 };

// Non-natural order by default.
let obj = { 2: c, 10: b, 1: a };
```

### insensitive

Examples of **incorrect** code for the `{caseSensitive: false}` option:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: ["error", "asc", {caseSensitive: false}]*/
/*eslint-env es6*/

let obj = { a: 1, c: 3, C: 4, b: 2 };
let obj = { a: 1, C: 3, c: 4, b: 2 };
```

Examples of **correct** code for the `{caseSensitive: false}` option:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: ["error", "asc", {caseSensitive: false}]*/
/*eslint-env es6*/

let obj = { a: 1, b: 2, c: 3, C: 4 };
let obj = { a: 1, b: 2, C: 3, c: 4 };
```

### ignoreSingleline

Examples of **incorrect** code for the `{ignoreSingleline: true}` option:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: ["error", "asc", {ignoreSingleline: true}]*/
/*eslint-env es6*/

let obj = {
  e: 1,
  c: 3,
  C: 4,
  b: 2
};
```

Examples of **correct** code for the `{ignoreSingleline: true}` option:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: ["error", "asc", {ignoreSingleline: true}]*/
/*eslint-env es6*/

let obj = { e: 1, b: 2, c: 3, C: 4 };
```

### natural

Examples of **incorrect** code for the `{natural: true}` option:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: ["error", "asc", {natural: true}]*/
/*eslint-env es6*/

let obj = { 1: a, 10: c, 2: b };
```

Examples of **correct** code for the `{natural: true}` option:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: ["error", "asc", {natural: true}]*/
/*eslint-env es6*/

let obj = { 1: a, 2: b, 10: c };
```

### minKeys

Examples of **incorrect** code for the `{minKeys: 4}` option:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: ["error", "asc", {minKeys: 4}]*/
/*eslint-env es6*/

// 4 keys
let obj = {
  b: 2,
  a: 1, // not sorted correctly (should be 1st key)
  c: 3,
  d: 4
};

// 5 keys
let obj = {
  2: 'a',
  1: 'b', // not sorted correctly (should be 1st key)
  3: 'c',
  4: 'd',
  5: 'e'
};
```

Examples of **correct** code for the `{minKeys: 4}` option:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: ["error", "asc", {minKeys: 4}]*//
/*eslint-env es6*/

// 3 keys
let obj = {
    b: 2,
    a: 1,
    c: 3,
};

// 2 keys
let obj = {
    2: 'b',
    1: 'a',
};
```

### shorthand

Examples of **incorrect** code for the `{shorthand: 'first'}` option:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: ["error", "asc", {shorthand: 'first'}]*/
/*eslint-env es6*/

let obj = {
  a: 1,
  b, // not sorted correctly (should be 1st key)
  c: 3,
  d: 4
};
```

Examples of **correct** code for the `{shorthand: 'first'}` option:

```js
/*eslint sort-keys-shorthand/sort-keys-shorthand: ["error", "asc", {shorthand: 'first'}]*//
/*eslint-env es6*/

let obj = {
    b,
    a: 1,
    c: 3,
};
```

## When Not To Use It

If you don't want to notify about properties' order, then it's safe to disable this rule.

## Compatibility

- **JSCS:** [validateOrderInObjectKeys](https://jscs-dev.github.io/rule/validateOrderInObjectKeys)
