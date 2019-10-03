'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const naturalCompare = require('natural-compare');

function getStaticPropertyName(node) {
  let prop;

  switch (node && node.type) {
    case 'Property':
    case 'MethodDefinition':
      prop = node.key;
      break;

    case 'MemberExpression':
      prop = node.property;
      break;

    // no default
  }

  switch (prop && prop.type) {
    case 'Literal':
      return { isShorthand: false, name: String(prop.value) };

    case 'TemplateLiteral':
      if (prop.expressions.length === 0 && prop.quasis.length === 1) {
        return { isShorthand: false, name: prop.quasis[0].value.cooked };
      }
      break;

    case 'Identifier':
      if (!node.computed) {
        return { isShorthand: node.shorthand, name: prop.name };
      }
      break;

    // no default
  }

  return null;
}

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets the property name of the given `Property` node.
 *
 * - If the property's key is an `Identifier` node, this returns the key's name
 *   whether it's a computed property or not.
 * - If the property has a static name, this returns the static name.
 * - Otherwise, this returns null.
 * @param {ASTNode} node The `Property` node to get.
 * @returns {string|null} The property name or null.
 * @private
 */
function getPropertyData(node) {
  const staticName = getStaticPropertyName(node);

  if (staticName !== null && staticName.name !== null) {
    return staticName;
  }

  return { isShorthand: false, name: node.key.name || null };
}

function checkShorthand(cmpFn, shorthand, aIsShorthand, bIsShorthand) {
  if (shorthand === 'ignore' || aIsShorthand === bIsShorthand) {
    return cmpFn();
  }
  if (shorthand === 'first') {
    return aIsShorthand;
  }
  return !aIsShorthand;
}

/**
 * Functions which check that the given 2 names are in specific order.
 *
 * Postfix `I` is meant insensitive.
 * Postfix `N` is meant natual.
 * @private
 */
const isValidOrders = {
  asc(a, b, shorthand, aIsShorthand, bIsShorthand) {
    return checkShorthand(
      function() {
        return a <= b;
      },
      shorthand,
      aIsShorthand,
      bIsShorthand
    );
  },
  ascI(a, b, shorthand, aIsShorthand, bIsShorthand) {
    return checkShorthand(
      function() {
        return a.toLowerCase() <= b.toLowerCase();
      },
      shorthand,
      aIsShorthand,
      bIsShorthand
    );
  },
  ascN(a, b, shorthand, aIsShorthand, bIsShorthand) {
    return checkShorthand(
      function() {
        return naturalCompare(a, b) <= 0;
      },
      shorthand,
      aIsShorthand,
      bIsShorthand
    );
  },
  ascIN(a, b, shorthand, aIsShorthand, bIsShorthand) {
    return checkShorthand(
      function() {
        return naturalCompare(a.toLowerCase(), b.toLowerCase()) <= 0;
      },
      shorthand,
      aIsShorthand,
      bIsShorthand
    );
  },
  desc(a, b, shorthand, aIsShorthand, bIsShorthand) {
    return isValidOrders.asc(b, a, shorthand, bIsShorthand, aIsShorthand);
  },
  descI(a, b, shorthand, aIsShorthand, bIsShorthand) {
    return isValidOrders.ascI(b, a, shorthand, bIsShorthand, aIsShorthand);
  },
  descN(a, b, shorthand, aIsShorthand, bIsShorthand) {
    return isValidOrders.ascN(b, a, shorthand, bIsShorthand, aIsShorthand);
  },
  descIN(a, b, shorthand, aIsShorthand, bIsShorthand) {
    return isValidOrders.ascIN(b, a, shorthand, bIsShorthand, aIsShorthand);
  }
};

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',

    docs: {
      description: 'require object keys to be sorted',
      category: 'Stylistic Issues',
      recommended: false,
      url:
        'https://github.com/fxOne/eslint-plugin-sort-keys-shorthand/blob/master/docs/rules/sort-keys-shorthand.md'
    },

    schema: [
      {
        enum: ['asc', 'desc']
      },
      {
        type: 'object',
        properties: {
          caseSensitive: {
            type: 'boolean',
            default: true
          },
          natural: {
            type: 'boolean',
            default: false
          },
          minKeys: {
            type: 'integer',
            minimum: 2,
            default: 2
          },
          shorthand: {
            enum: ['first', 'last', 'ignore'],
            default: 'ignore'
          }
        },
        additionalProperties: false
      }
    ]
  },

  create(context) {
    // Parse options.
    const order = context.options[0] || 'asc';
    const options = context.options[1];
    const insensitive = options && options.caseSensitive === false;
    const natual = options && options.natural;
    const minKeys = options && options.minKeys;
    const shorthand = (options && options.shorthand) || 'ignore';
    const isValidOrder =
      isValidOrders[order + (insensitive ? 'I' : '') + (natual ? 'N' : '')];
    // The stack to save the previous property's name for each object literals.
    let stack = null;

    return {
      ObjectExpression(node) {
        stack = {
          isShorthand: false,
          upper: stack,
          prevName: null,
          numKeys: node.properties.length
        };
      },

      'ObjectExpression:exit'() {
        stack = stack.upper;
      },

      SpreadElement(node) {
        if (node.parent.type === 'ObjectExpression') {
          stack.prevName = null;
          stack.isShorthand = false;
        }
      },

      Property(node) {
        if (node.parent.type === 'ObjectPattern') {
          return;
        }

        const prevName = stack.prevName;
        const prevIsShorthand = stack.isShorthand;
        const numKeys = stack.numKeys;

        const data = getPropertyData(node);
        const thisName = data && data.name;
        if (thisName !== null) {
          stack.prevName = thisName;
          stack.isShorthand = data.isShorthand;
        }

        if (prevName === null || thisName === null || numKeys < minKeys) {
          return;
        }

        if (
          !isValidOrder(
            prevName,
            thisName,
            shorthand,
            prevIsShorthand,
            data.isShorthand
          )
        ) {
          context.report({
            node,
            loc: node.key.loc,
            message:
              "Expected object keys to be in {{natual}}{{insensitive}}{{order}}ending order{{shorthand}}. '{{thisName}}' should be before '{{prevName}}'.",
            data: {
              prevName,
              order,
              thisName,
              insensitive: insensitive ? 'insensitive ' : '',
              natual: natual ? 'natural ' : '',
              shorthand:
                shorthand === 'ignore'
                  ? ''
                  : ' with shorthand properties ' + shorthand
            }
          });
        }
      }
    };
  }
};
