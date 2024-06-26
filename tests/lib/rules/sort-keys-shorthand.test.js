'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/sort-keys-shorthand'),
  { RuleTester } = require('eslint');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run('sort-keys-shorthand', rule, {
  valid: [
    // default (asc)
    {
      code: "var obj = {'':1, [``]:2}",
      options: [],
      parserOptions: { ecmaVersion: 6 }
    },
    {
      code: "var obj = {[``]:1, '':2}",
      options: [],
      parserOptions: { ecmaVersion: 6 }
    },
    { code: "var obj = {'':1, a:2}", options: [] },
    {
      code: 'var obj = {[``]:1, a:2}',
      options: [],
      parserOptions: { ecmaVersion: 6 }
    },
    { code: 'var obj = {_:2, a:1, b:3} // default', options: [] },
    { code: 'var obj = {a:1, b:3, c:2}', options: [] },
    { code: 'var obj = {a:2, b:3, b_:1}', options: [] },
    { code: 'var obj = {C:3, b_:1, c:2}', options: [] },
    { code: 'var obj = {$:1, A:3, _:2, a:4}', options: [] },
    { code: "var obj = {1:1, '11':2, 2:4, A:3}", options: [] },
    { code: "var obj = {'#':1, 'Z':2, À:3, è:4}", options: [] },

    // ignore non-simple computed properties.
    {
      code: 'var obj = {a:1, b:3, [a + b]: -1, c:2}',
      options: [],
      parserOptions: { ecmaVersion: 6 }
    },
    {
      code: "var obj = {'':1, [f()]:2, a:3}",
      options: [],
      parserOptions: { ecmaVersion: 6 }
    },
    {
      code: "var obj = {a:1, [b++]:2, '':3}",
      options: ['desc'],
      parserOptions: { ecmaVersion: 6 }
    },

    // ignore properties separated by spread properties
    {
      code: 'var obj = {a:1, ...z, b:1}',
      options: [],
      parserOptions: { ecmaVersion: 2018 }
    },
    {
      code: 'var obj = {b:1, ...z, a:1}',
      options: [],
      parserOptions: { ecmaVersion: 2018 }
    },
    {
      code: 'var obj = {...a, b:1, ...c, d:1}',
      options: [],
      parserOptions: { ecmaVersion: 2018 }
    },
    {
      code: 'var obj = {...a, b:1, ...d, ...c, e:2, z:5}',
      options: [],
      parserOptions: { ecmaVersion: 2018 }
    },
    {
      code: 'var obj = {b:1, ...c, ...d, e:2}',
      options: [],
      parserOptions: { ecmaVersion: 2018 }
    },
    {
      code: "var obj = {a:1, ...z, '':2}",
      options: [],
      parserOptions: { ecmaVersion: 2018 }
    },
    {
      code: "var obj = {'':1, ...z, 'a':2}",
      options: ['desc'],
      parserOptions: { ecmaVersion: 2018 }
    },

    // not ignore properties not separated by spread properties
    {
      code: 'var obj = {...z, a:1, b:1}',
      options: [],
      parserOptions: { ecmaVersion: 2018 }
    },
    {
      code: 'var obj = {...z, ...c, a:1, b:1}',
      options: [],
      parserOptions: { ecmaVersion: 2018 }
    },
    {
      code: 'var obj = {a:1, b:1, ...z}',
      options: [],
      parserOptions: { ecmaVersion: 2018 }
    },
    {
      code: 'var obj = {...z, ...x, a:1, ...c, ...d, f:5, e:4}',
      options: ['desc'],
      parserOptions: { ecmaVersion: 2018 }
    },

    // works when spread occurs somewhere other than an object literal
    {
      code: 'function fn(...args) { return [...args].length; }',
      options: [],
      parserOptions: { ecmaVersion: 2018 }
    },
    {
      code: 'function g() {}; function f(...args) { return g(...args); }',
      options: [],
      parserOptions: { ecmaVersion: 2018 }
    },

    // ignore destructuring patterns.
    { code: 'let {a, b} = {}', options: [], parserOptions: { ecmaVersion: 6 } },

    // nested
    { code: 'var obj = {a:1, b:{x:1, y:1}, c:1}', options: [] },

    // asc
    { code: 'var obj = {_:2, a:1, b:3} // asc', options: ['asc'] },
    { code: 'var obj = {a:1, b:3, c:2}', options: ['asc'] },
    { code: 'var obj = {a:2, b:3, b_:1}', options: ['asc'] },
    { code: 'var obj = {C:3, b_:1, c:2}', options: ['asc'] },
    { code: 'var obj = {$:1, A:3, _:2, a:4}', options: ['asc'] },
    { code: "var obj = {1:1, '11':2, 2:4, A:3}", options: ['asc'] },
    { code: "var obj = {'#':1, 'Z':2, À:3, è:4}", options: ['asc'] },

    // asc, minKeys should ignore unsorted keys when number of keys is less than minKeys
    { code: 'var obj = {a:1, c:2, b:3}', options: ['asc', { minKeys: 4 }] },

    // asc, insensitive
    {
      code: 'var obj = {_:2, a:1, b:3} // asc, insensitive',
      options: ['asc', { caseSensitive: false }]
    },
    {
      code: 'var obj = {a:1, b:3, c:2}',
      options: ['asc', { caseSensitive: false }]
    },
    {
      code: 'var obj = {a:2, b:3, b_:1}',
      options: ['asc', { caseSensitive: false }]
    },
    {
      code: 'var obj = {b_:1, C:3, c:2}',
      options: ['asc', { caseSensitive: false }]
    },
    {
      code: 'var obj = {b_:1, c:3, C:2}',
      options: ['asc', { caseSensitive: false }]
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      options: ['asc', { caseSensitive: false }]
    },
    {
      code: "var obj = {1:1, '11':2, 2:4, A:3}",
      options: ['asc', { caseSensitive: false }]
    },
    {
      code: "var obj = {'#':1, 'Z':2, À:3, è:4}",
      options: ['asc', { caseSensitive: false }]
    },

    // asc, insensitive, minKeys should ignore unsorted keys when number of keys is less than minKeys
    {
      code: 'var obj = {$:1, A:3, _:2, a:4}',
      options: ['asc', { caseSensitive: false, minKeys: 5 }]
    },

    // asc, natural
    {
      code: 'var obj = {_:2, a:1, b:3} // asc, natural',
      options: ['asc', { natural: true }]
    },
    { code: 'var obj = {a:1, b:3, c:2}', options: ['asc', { natural: true }] },
    { code: 'var obj = {a:2, b:3, b_:1}', options: ['asc', { natural: true }] },
    { code: 'var obj = {C:3, b_:1, c:2}', options: ['asc', { natural: true }] },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      options: ['asc', { natural: true }]
    },
    {
      code: "var obj = {1:1, 2:4, '11':2, A:3}",
      options: ['asc', { natural: true }]
    },
    {
      code: "var obj = {'#':1, 'Z':2, À:3, è:4}",
      options: ['asc', { natural: true }]
    },

    // asc, natural, minKeys should ignore unsorted keys when number of keys is less than minKeys
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      options: ['asc', { natural: true, minKeys: 4 }]
    },

    // asc, natural, insensitive
    {
      code: 'var obj = {_:2, a:1, b:3} // asc, natural, insensitive',
      options: ['asc', { natural: true, caseSensitive: false }]
    },
    {
      code: 'var obj = {a:1, b:3, c:2}',
      options: ['asc', { natural: true, caseSensitive: false }]
    },
    {
      code: 'var obj = {a:2, b:3, b_:1}',
      options: ['asc', { natural: true, caseSensitive: false }]
    },
    {
      code: 'var obj = {b_:1, C:3, c:2}',
      options: ['asc', { natural: true, caseSensitive: false }]
    },
    {
      code: 'var obj = {b_:1, c:3, C:2}',
      options: ['asc', { natural: true, caseSensitive: false }]
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      options: ['asc', { natural: true, caseSensitive: false }]
    },
    {
      code: "var obj = {1:1, 2:4, '11':2, A:3}",
      options: ['asc', { natural: true, caseSensitive: false }]
    },
    {
      code: "var obj = {'#':1, 'Z':2, À:3, è:4}",
      options: ['asc', { natural: true, caseSensitive: false }]
    },

    // asc, natural, insensitive, minKeys should ignore unsorted keys when number of keys is less than minKeys
    {
      code: 'var obj = {a:1, _:2, b:3}',
      options: ['asc', { natural: true, caseSensitive: false, minKeys: 4 }]
    },

    // desc
    { code: 'var obj = {b:3, a:1, _:2} // desc', options: ['desc'] },
    { code: 'var obj = {c:2, b:3, a:1}', options: ['desc'] },
    { code: 'var obj = {b_:1, b:3, a:2}', options: ['desc'] },
    { code: 'var obj = {c:2, b_:1, C:3}', options: ['desc'] },
    { code: 'var obj = {a:4, _:2, A:3, $:1}', options: ['desc'] },
    { code: "var obj = {A:3, 2:4, '11':2, 1:1}", options: ['desc'] },
    { code: "var obj = {è:4, À:3, 'Z':2, '#':1}", options: ['desc'] },

    // desc, minKeys should ignore unsorted keys when number of keys is less than minKeys
    { code: 'var obj = {a:1, c:2, b:3}', options: ['desc', { minKeys: 4 }] },

    // desc, insensitive
    {
      code: 'var obj = {b:3, a:1, _:2} // desc, insensitive',
      options: ['desc', { caseSensitive: false }]
    },
    {
      code: 'var obj = {c:2, b:3, a:1}',
      options: ['desc', { caseSensitive: false }]
    },
    {
      code: 'var obj = {b_:1, b:3, a:2}',
      options: ['desc', { caseSensitive: false }]
    },
    {
      code: 'var obj = {c:2, C:3, b_:1}',
      options: ['desc', { caseSensitive: false }]
    },
    {
      code: 'var obj = {C:2, c:3, b_:1}',
      options: ['desc', { caseSensitive: false }]
    },
    {
      code: 'var obj = {a:4, A:3, _:2, $:1}',
      options: ['desc', { caseSensitive: false }]
    },
    {
      code: "var obj = {A:3, 2:4, '11':2, 1:1}",
      options: ['desc', { caseSensitive: false }]
    },
    {
      code: "var obj = {è:4, À:3, 'Z':2, '#':1}",
      options: ['desc', { caseSensitive: false }]
    },

    // desc, insensitive, minKeys should ignore unsorted keys when number of keys is less than minKeys
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      options: ['desc', { caseSensitive: false, minKeys: 5 }]
    },

    // desc, natural
    {
      code: 'var obj = {b:3, a:1, _:2} // desc, natural',
      options: ['desc', { natural: true }]
    },
    { code: 'var obj = {c:2, b:3, a:1}', options: ['desc', { natural: true }] },
    {
      code: 'var obj = {b_:1, b:3, a:2}',
      options: ['desc', { natural: true }]
    },
    {
      code: 'var obj = {c:2, b_:1, C:3}',
      options: ['desc', { natural: true }]
    },
    {
      code: 'var obj = {a:4, A:3, _:2, $:1}',
      options: ['desc', { natural: true }]
    },
    {
      code: "var obj = {A:3, '11':2, 2:4, 1:1}",
      options: ['desc', { natural: true }]
    },
    {
      code: "var obj = {è:4, À:3, 'Z':2, '#':1}",
      options: ['desc', { natural: true }]
    },

    // desc, natural, minKeys should ignore unsorted keys when number of keys is less than minKeys
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      options: ['desc', { natural: true, minKeys: 4 }]
    },

    // desc, natural, insensitive
    {
      code: 'var obj = {b:3, a:1, _:2} // desc, natural, insensitive',
      options: ['desc', { natural: true, caseSensitive: false }]
    },
    {
      code: 'var obj = {c:2, b:3, a:1}',
      options: ['desc', { natural: true, caseSensitive: false }]
    },
    {
      code: 'var obj = {b_:1, b:3, a:2}',
      options: ['desc', { natural: true, caseSensitive: false }]
    },
    {
      code: 'var obj = {c:2, C:3, b_:1}',
      options: ['desc', { natural: true, caseSensitive: false }]
    },
    {
      code: 'var obj = {C:2, c:3, b_:1}',
      options: ['desc', { natural: true, caseSensitive: false }]
    },
    {
      code: 'var obj = {a:4, A:3, _:2, $:1}',
      options: ['desc', { natural: true, caseSensitive: false }]
    },
    {
      code: "var obj = {A:3, '11':2, 2:4, 1:1}",
      options: ['desc', { natural: true, caseSensitive: false }]
    },
    {
      code: "var obj = {è:4, À:3, 'Z':2, '#':1}",
      options: ['desc', { natural: true, caseSensitive: false }]
    },

    // desc, natural, insensitive, minKeys should ignore unsorted keys when number of keys is less than minKeys
    {
      code: 'var obj = {a:1, _:2, b:3}',
      options: ['desc', { natural: true, caseSensitive: false, minKeys: 4 }]
    },

    // shorthand first
    {
      code: 'var obj = {a, _:2, b:3}',
      options: [
        'desc',
        { natural: true, caseSensitive: false, minKeys: 4, shorthand: 'first' }
      ],
      parserOptions: { ecmaVersion: 2018 }
    },
    {
      code: 'var obj = {d, a:1, b:{x:1, y:1}, c:1}',
      options: ['asc', { shorthand: 'first' }],
      parserOptions: { ecmaVersion: 2018 }
    },

    //shorthand last
    {
      code: 'var obj = { _:2, b:3,a}',
      options: [
        'desc',
        { natural: true, caseSensitive: false, minKeys: 4, shorthand: 'last' }
      ],
      parserOptions: { ecmaVersion: 2018 }
    },
    {
      code: 'var obj = {a:1, b:{x:1, y:1}, c:1, d}',
      options: ['asc', { shorthand: 'last' }],
      parserOptions: { ecmaVersion: 2018 }
    },
    //ignore single lines
    {
      code: 'var obj = {d, a:1, b:{x:1, y:1}, c:1}',
      options: ['asc', { shorthand: 'last', ignoreSingleline: true }],
      parserOptions: { ecmaVersion: 2018 }
    },
    {
      code: 'var obj = {d, a:1, b:{x:1, y:1}, c:1, e}',
      options: ['asc', { shorthand: 'last', ignoreSingleline: true }],
      parserOptions: { ecmaVersion: 2018 }
    }
  ],
  invalid: [
    // default (asc)
    {
      code: "var obj = {a:1, '':2} // default",
      errors: [
        "Expected object keys to be in ascending order. '' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {a:1, [``]:2} // default',
      parserOptions: { ecmaVersion: 6 },
      errors: [
        "Expected object keys to be in ascending order. '' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {a:1, _:2, b:3} // default',
      errors: [
        "Expected object keys to be in ascending order. '_' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      errors: [
        "Expected object keys to be in ascending order. 'b' should be before 'c'."
      ]
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      errors: [
        "Expected object keys to be in ascending order. 'a' should be before 'b_'."
      ]
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      errors: [
        "Expected object keys to be in ascending order. 'C' should be before 'c'."
      ]
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      errors: [
        "Expected object keys to be in ascending order. 'A' should be before '_'."
      ]
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      errors: [
        "Expected object keys to be in ascending order. '11' should be before 'A'."
      ]
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      errors: [
        "Expected object keys to be in ascending order. 'Z' should be before 'À'."
      ]
    },

    // not ignore properties not separated by spread properties
    {
      code: 'var obj = {...z, c:1, b:1}',
      options: [],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        "Expected object keys to be in ascending order. 'b' should be before 'c'."
      ]
    },
    {
      code: 'var obj = {...z, ...c, d:4, b:1, ...y, ...f, e:2, a:1}',
      options: [],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        "Expected object keys to be in ascending order. 'b' should be before 'd'.",
        "Expected object keys to be in ascending order. 'a' should be before 'e'."
      ]
    },
    {
      code: 'var obj = {c:1, b:1, ...a}',
      options: [],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        "Expected object keys to be in ascending order. 'b' should be before 'c'."
      ]
    },
    {
      code: 'var obj = {...z, ...a, c:1, b:1}',
      options: [],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        "Expected object keys to be in ascending order. 'b' should be before 'c'."
      ]
    },
    {
      code: 'var obj = {...z, b:1, a:1, ...d, ...c}',
      options: [],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        "Expected object keys to be in ascending order. 'a' should be before 'b'."
      ]
    },
    {
      code: 'var obj = {...z, a:2, b:0, ...x, ...c}',
      options: ['desc'],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        "Expected object keys to be in descending order. 'b' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {...z, a:2, b:0, ...x}',
      options: ['desc'],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        "Expected object keys to be in descending order. 'b' should be before 'a'."
      ]
    },
    {
      code: "var obj = {...z, '':1, a:2}",
      options: ['desc'],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        "Expected object keys to be in descending order. 'a' should be before ''."
      ]
    },

    // ignore non-simple computed properties, but their position shouldn't affect other comparisons.
    {
      code: "var obj = {a:1, [b+c]:2, '':3}",
      parserOptions: { ecmaVersion: 6 },
      errors: [
        "Expected object keys to be in ascending order. '' should be before 'a'."
      ]
    },
    {
      code: "var obj = {'':1, [b+c]:2, a:3}",
      options: ['desc'],
      parserOptions: { ecmaVersion: 6 },
      errors: [
        "Expected object keys to be in descending order. 'a' should be before ''."
      ]
    },
    {
      code: "var obj = {b:1, [f()]:2, '':3, a:4}",
      options: ['desc'],
      parserOptions: { ecmaVersion: 6 },
      errors: [
        "Expected object keys to be in descending order. 'a' should be before ''."
      ]
    },

    // not ignore simple computed properties.
    {
      code: 'var obj = {a:1, b:3, [a]: -1, c:2}',
      parserOptions: { ecmaVersion: 6 },
      errors: [
        "Expected object keys to be in ascending order. 'a' should be before 'b'."
      ]
    },

    // nested
    {
      code: 'var obj = {a:1, c:{y:1, x:1}, b:1}',
      errors: [
        "Expected object keys to be in ascending order. 'x' should be before 'y'.",
        "Expected object keys to be in ascending order. 'b' should be before 'c'."
      ]
    },

    // asc
    {
      code: 'var obj = {a:1, _:2, b:3} // asc',
      options: ['asc'],
      errors: [
        "Expected object keys to be in ascending order. '_' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      options: ['asc'],
      errors: [
        "Expected object keys to be in ascending order. 'b' should be before 'c'."
      ]
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      options: ['asc'],
      errors: [
        "Expected object keys to be in ascending order. 'a' should be before 'b_'."
      ]
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      options: ['asc'],
      errors: [
        "Expected object keys to be in ascending order. 'C' should be before 'c'."
      ]
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      options: ['asc'],
      errors: [
        "Expected object keys to be in ascending order. 'A' should be before '_'."
      ]
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      options: ['asc'],
      errors: [
        "Expected object keys to be in ascending order. '11' should be before 'A'."
      ]
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      options: ['asc'],
      errors: [
        "Expected object keys to be in ascending order. 'Z' should be before 'À'."
      ]
    },

    // asc, minKeys should error when number of keys is greater than or equal to minKeys
    {
      code: 'var obj = {a:1, _:2, b:3}',
      options: ['asc', { minKeys: 3 }],
      errors: [
        "Expected object keys to be in ascending order. '_' should be before 'a'."
      ]
    },

    // asc, insensitive
    {
      code: 'var obj = {a:1, _:2, b:3} // asc, insensitive',
      options: ['asc', { caseSensitive: false }],
      errors: [
        "Expected object keys to be in insensitive ascending order. '_' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      options: ['asc', { caseSensitive: false }],
      errors: [
        "Expected object keys to be in insensitive ascending order. 'b' should be before 'c'."
      ]
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      options: ['asc', { caseSensitive: false }],
      errors: [
        "Expected object keys to be in insensitive ascending order. 'a' should be before 'b_'."
      ]
    },
    {
      code: 'var obj = {$:1, A:3, _:2, a:4}',
      options: ['asc', { caseSensitive: false }],
      errors: [
        "Expected object keys to be in insensitive ascending order. '_' should be before 'A'."
      ]
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      options: ['asc', { caseSensitive: false }],
      errors: [
        "Expected object keys to be in insensitive ascending order. '11' should be before 'A'."
      ]
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      options: ['asc', { caseSensitive: false }],
      errors: [
        "Expected object keys to be in insensitive ascending order. 'Z' should be before 'À'."
      ]
    },

    // asc, insensitive, minKeys should error when number of keys is greater than or equal to minKeys
    {
      code: 'var obj = {a:1, _:2, b:3}',
      options: ['asc', { caseSensitive: false, minKeys: 3 }],
      errors: [
        "Expected object keys to be in insensitive ascending order. '_' should be before 'a'."
      ]
    },

    // asc, natural
    {
      code: 'var obj = {a:1, _:2, b:3} // asc, natural',
      options: ['asc', { natural: true }],
      errors: [
        "Expected object keys to be in natural ascending order. '_' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      options: ['asc', { natural: true }],
      errors: [
        "Expected object keys to be in natural ascending order. 'b' should be before 'c'."
      ]
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      options: ['asc', { natural: true }],
      errors: [
        "Expected object keys to be in natural ascending order. 'a' should be before 'b_'."
      ]
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      options: ['asc', { natural: true }],
      errors: [
        "Expected object keys to be in natural ascending order. 'C' should be before 'c'."
      ]
    },
    {
      code: 'var obj = {$:1, A:3, _:2, a:4}',
      options: ['asc', { natural: true }],
      errors: [
        "Expected object keys to be in natural ascending order. '_' should be before 'A'."
      ]
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      options: ['asc', { natural: true }],
      errors: [
        "Expected object keys to be in natural ascending order. '11' should be before 'A'."
      ]
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      options: ['asc', { natural: true }],
      errors: [
        "Expected object keys to be in natural ascending order. 'Z' should be before 'À'."
      ]
    },

    // asc, natural, minKeys should error when number of keys is greater than or equal to minKeys
    {
      code: 'var obj = {a:1, _:2, b:3}',
      options: ['asc', { natural: true, minKeys: 2 }],
      errors: [
        "Expected object keys to be in natural ascending order. '_' should be before 'a'."
      ]
    },

    // asc, natural, insensitive
    {
      code: 'var obj = {a:1, _:2, b:3} // asc, natural, insensitive',
      options: ['asc', { natural: true, caseSensitive: false }],
      errors: [
        "Expected object keys to be in natural insensitive ascending order. '_' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      options: ['asc', { natural: true, caseSensitive: false }],
      errors: [
        "Expected object keys to be in natural insensitive ascending order. 'b' should be before 'c'."
      ]
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      options: ['asc', { natural: true, caseSensitive: false }],
      errors: [
        "Expected object keys to be in natural insensitive ascending order. 'a' should be before 'b_'."
      ]
    },
    {
      code: 'var obj = {$:1, A:3, _:2, a:4}',
      options: ['asc', { natural: true, caseSensitive: false }],
      errors: [
        "Expected object keys to be in natural insensitive ascending order. '_' should be before 'A'."
      ]
    },
    {
      code: "var obj = {1:1, '11':2, 2:4, A:3}",
      options: ['asc', { natural: true, caseSensitive: false }],
      errors: [
        "Expected object keys to be in natural insensitive ascending order. '2' should be before '11'."
      ]
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      options: ['asc', { natural: true, caseSensitive: false }],
      errors: [
        {
          message: "Expected object keys to be in natural insensitive ascending order. 'Z' should be before 'À'.",
          suggestions: [{
            desc: "Fix order",
            output: "var obj = {'#':1, 'Z':2,À:3, è:4}"
          }],
        }
      ]
    },

    // asc, natural, insensitive, minKeys should error when number of keys is greater than or equal to minKeys
    {
      code: 'var obj = {a:1, _:2, b:3}',
      options: ['asc', { natural: true, caseSensitive: false, minKeys: 3 }],
      errors: [
        "Expected object keys to be in natural insensitive ascending order. '_' should be before 'a'."
      ]
    },

    // desc
    {
      code: "var obj = {'':1, a:'2'} // desc",
      options: ['desc'],
      errors: [
        {
          message: "Expected object keys to be in descending order. 'a' should be before ''.",
          suggestions: [{
            desc: "Fix order",
            output: "var obj = {a:'2','':1} // desc"
          }],
        }
      ]
    },
    {
      code: "var obj = {[``]:1, a:'2'} // desc",
      options: ['desc'],
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: "Expected object keys to be in descending order. 'a' should be before ''.",
          suggestions: [{
            desc: "Fix order",
            output: "var obj = {a:'2',[``]:1} // desc"
          }],
        }
      ]
    },
    {
      code: 'var obj = {a:1, _:2, b:3} // desc',
      options: ['desc'],
      errors: [
        "Expected object keys to be in descending order. 'b' should be before '_'."
      ]
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      options: ['desc'],
      errors: [
        "Expected object keys to be in descending order. 'c' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      options: ['desc'],
      errors: [
        "Expected object keys to be in descending order. 'b' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      options: ['desc'],
      errors: [
        "Expected object keys to be in descending order. 'c' should be before 'b_'."
      ]
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      options: ['desc'],
      errors: [
        "Expected object keys to be in descending order. '_' should be before '$'.",
        "Expected object keys to be in descending order. 'a' should be before 'A'."
      ]
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      options: ['desc'],
      errors: [
        {
          message: "Expected object keys to be in descending order. '2' should be before '1'.",
          suggestions: [{
            desc: "Fix order",
            output: "var obj = {2:4,1:1, A:3, '11':2}"
          }],
        },
        {
          message: "Expected object keys to be in descending order. 'A' should be before '2'.",
          suggestions: [{
            desc: "Fix order",
            output: "var obj = {1:1, A:3,2:4, '11':2}"
          }],
        }
      ]
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      options: ['desc'],
      errors: [
        "Expected object keys to be in descending order. 'À' should be before '#'.",
        "Expected object keys to be in descending order. 'è' should be before 'Z'."
      ]
    },

    // desc, minKeys should error when number of keys is greater than or equal to minKeys
    {
      code: 'var obj = {a:1, _:2, b:3}',
      options: ['desc', { minKeys: 3 }],
      errors: [
        "Expected object keys to be in descending order. 'b' should be before '_'."
      ]
    },

    // desc, insensitive
    {
      code: 'var obj = {a:1, _:2, b:3} // desc, insensitive',
      options: ['desc', { caseSensitive: false }],
      errors: [
        "Expected object keys to be in insensitive descending order. 'b' should be before '_'."
      ]
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      options: ['desc', { caseSensitive: false }],
      errors: [
        "Expected object keys to be in insensitive descending order. 'c' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      options: ['desc', { caseSensitive: false }],
      errors: [
        "Expected object keys to be in insensitive descending order. 'b' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      options: ['desc', { caseSensitive: false }],
      errors: [
        "Expected object keys to be in insensitive descending order. 'c' should be before 'b_'."
      ]
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      options: ['desc', { caseSensitive: false }],
      errors: [
        "Expected object keys to be in insensitive descending order. '_' should be before '$'.",
        "Expected object keys to be in insensitive descending order. 'A' should be before '_'."
      ]
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      options: ['desc', { caseSensitive: false }],
      errors: [
        "Expected object keys to be in insensitive descending order. '2' should be before '1'.",
        "Expected object keys to be in insensitive descending order. 'A' should be before '2'."
      ]
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      options: ['desc', { caseSensitive: false }],
      errors: [
        "Expected object keys to be in insensitive descending order. 'À' should be before '#'.",
        "Expected object keys to be in insensitive descending order. 'è' should be before 'Z'."
      ]
    },

    // desc, insensitive should error when number of keys is greater than or equal to minKeys
    {
      code: 'var obj = {a:1, _:2, b:3}',
      options: ['desc', { caseSensitive: false, minKeys: 2 }],
      errors: [
        "Expected object keys to be in insensitive descending order. 'b' should be before '_'."
      ]
    },

    // desc, natural
    {
      code: 'var obj = {a:1, _:2, b:3} // desc, natural',
      options: ['desc', { natural: true }],
      errors: [
        "Expected object keys to be in natural descending order. 'b' should be before '_'."
      ]
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      options: ['desc', { natural: true }],
      errors: [
        "Expected object keys to be in natural descending order. 'c' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      options: ['desc', { natural: true }],
      errors: [
        "Expected object keys to be in natural descending order. 'b' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      options: ['desc', { natural: true }],
      errors: [
        "Expected object keys to be in natural descending order. 'c' should be before 'b_'."
      ]
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      options: ['desc', { natural: true }],
      errors: [
        "Expected object keys to be in natural descending order. '_' should be before '$'.",
        "Expected object keys to be in natural descending order. 'A' should be before '_'.",
        "Expected object keys to be in natural descending order. 'a' should be before 'A'."
      ]
    },
    {
      code: "var obj = {1:1, 2:4, A:3, '11':2}",
      options: ['desc', { natural: true }],
      errors: [
        "Expected object keys to be in natural descending order. '2' should be before '1'.",
        "Expected object keys to be in natural descending order. 'A' should be before '2'."
      ]
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      options: ['desc', { natural: true }],
      errors: [
        "Expected object keys to be in natural descending order. 'À' should be before '#'.",
        "Expected object keys to be in natural descending order. 'è' should be before 'Z'."
      ]
    },

    // desc, natural should error when number of keys is greater than or equal to minKeys
    {
      code: 'var obj = {a:1, _:2, b:3}',
      options: ['desc', { natural: true, minKeys: 3 }],
      errors: [
        "Expected object keys to be in natural descending order. 'b' should be before '_'."
      ]
    },

    // desc, natural, insensitive
    {
      code: 'var obj = {a:1, _:2, b:3} // desc, natural, insensitive',
      options: ['desc', { natural: true, caseSensitive: false }],
      errors: [
        "Expected object keys to be in natural insensitive descending order. 'b' should be before '_'."
      ]
    },
    {
      code: 'var obj = {a:1, c:2, b:3}',
      options: ['desc', { natural: true, caseSensitive: false }],
      errors: [
        "Expected object keys to be in natural insensitive descending order. 'c' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {b_:1, a:2, b:3}',
      options: ['desc', { natural: true, caseSensitive: false }],
      errors: [
        "Expected object keys to be in natural insensitive descending order. 'b' should be before 'a'."
      ]
    },
    {
      code: 'var obj = {b_:1, c:2, C:3}',
      options: ['desc', { natural: true, caseSensitive: false }],
      errors: [
        "Expected object keys to be in natural insensitive descending order. 'c' should be before 'b_'."
      ]
    },
    {
      code: 'var obj = {$:1, _:2, A:3, a:4}',
      options: ['desc', { natural: true, caseSensitive: false }],
      errors: [
        "Expected object keys to be in natural insensitive descending order. '_' should be before '$'.",
        "Expected object keys to be in natural insensitive descending order. 'A' should be before '_'."
      ]
    },
    {
      code: "var obj = {1:1, 2:4, '11':2, A:3}",
      options: ['desc', { natural: true, caseSensitive: false }],
      errors: [
        "Expected object keys to be in natural insensitive descending order. '2' should be before '1'.",
        "Expected object keys to be in natural insensitive descending order. '11' should be before '2'.",
        "Expected object keys to be in natural insensitive descending order. 'A' should be before '11'."
      ]
    },
    {
      code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
      options: ['desc', { natural: true, caseSensitive: false }],
      errors: [
        "Expected object keys to be in natural insensitive descending order. 'À' should be before '#'.",
        "Expected object keys to be in natural insensitive descending order. 'è' should be before 'Z'."
      ]
    },

    // desc, natural, insensitive should error when number of keys is greater than or equal to minKeys
    {
      code: 'var obj = {a:1, _:2, b:3}',
      options: ['desc', { natural: true, caseSensitive: false, minKeys: 2 }],
      errors: [
        "Expected object keys to be in natural insensitive descending order. 'b' should be before '_'."
      ]
    },

    //shorthand first
    {
      code: 'var obj = {a:1, b:{x:1, y:1}, c:1, d}',
      options: ['asc', { shorthand: 'first' }],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        "Expected object keys to be in ascending order with shorthand properties first. 'd' should be before 'c'."
      ]
    },
    {
      code: 'var obj = {e,a:1, b:{x:1, y:1}, c:1, d}',
      options: ['asc', { shorthand: 'first' }],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        "Expected object keys to be in ascending order with shorthand properties first. 'd' should be before 'c'."
      ]
    },

    //shorthand last
    {
      code: 'var obj = {d, a:1, b:{x:1, y:1}, c:1}',
      options: ['asc', { shorthand: 'last' }],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        "Expected object keys to be in ascending order with shorthand properties last. 'a' should be before 'd'."
      ]
    },
    {
      code: 'var obj = {d, a:1, b:{x:1, y:1}, c:1, e}',
      options: ['asc', { shorthand: 'last' }],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        "Expected object keys to be in ascending order with shorthand properties last. 'a' should be before 'd'."
      ]
    },
    //with ignore singleline
    {
      code: `var obj = {
        d, a:1, b:{x:1, y:1}, c:1
      }`,
      options: ['asc', { shorthand: 'last', ignoreSingleline: true }],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        "Expected object keys to be in ascending order with shorthand properties last. 'a' should be before 'd'."
      ]
    },
    {
      code: `var obj = {
        d,
        a:1, b:{x:1, y:1}, c:1, e
      }`,
      options: ['asc', { shorthand: 'last', ignoreSingleline: true }],
      parserOptions: { ecmaVersion: 2018 },
      errors: [
        {
          message: "Expected object keys to be in ascending order with shorthand properties last. 'a' should be before 'd'.",
          suggestions: [{
            desc: "Fix order",
            output: `var obj = {
        a:1,d, b:{x:1, y:1}, c:1, e
      }`
          }],
        }
      ]
    }
  ]
});
