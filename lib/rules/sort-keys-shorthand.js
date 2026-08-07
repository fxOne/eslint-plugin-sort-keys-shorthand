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

function isSameLine(node) {
  return node.loc.start.line === node.loc.end.line;
}

/**
 * Collects the properties that are re-ordered together with the given one.
 *
 * A region is bounded by spread properties, matching what the rule itself
 * checks - a spread resets the comparison, so the keys on either side of it are
 * never compared with each other.
 * @param {Array<ASTNode>} siblings The properties of the object literal.
 * @param {ASTNode} node The reported `Property` node.
 * @returns {Array<ASTNode>} The region's properties, in source order.
 * @private
 */
function getRegion(siblings, node) {
  const idx = siblings.indexOf(node);
  let start = idx;
  let end = idx;

  while (start > 0 && siblings[start - 1].type === 'Property') {
    start--;
  }
  while (end < siblings.length - 1 && siblings[end + 1].type === 'Property') {
    end++;
  }

  return siblings.slice(start, end + 1);
}

/**
 * Builds the comparator that orders two properties the way the rule reports.
 * @param {Function} isValidOrder The order predicate the rule reports against.
 * @param {string} shorthand The `shorthand` option.
 * @returns {Function} The comparator.
 * @private
 */
function compareProperties(isValidOrder, shorthand) {
  return function(a, b) {
    const ad = getPropertyData(a);
    const bd = getPropertyData(b);

    if (ad.name === bd.name && ad.isShorthand === bd.isShorthand) {
      return 0;
    }

    return isValidOrder(
      ad.name,
      bd.name,
      shorthand,
      ad.isShorthand,
      bd.isShorthand
    )
      ? -1
      : 1;
  };
}

/**
 * Sorts a region's properties into the order the rule expects.
 *
 * A property whose key the rule cannot name - a computed key it does not
 * evaluate - keeps its position. The check skips such a property rather than
 * comparing it, so sorting it along would move a key the rule never complained
 * about; and since comparing a `null` name is not a total order, the sort would
 * leave the region unchanged instead, making the suggestion a no-op.
 * @param {Array<ASTNode>} region The region's properties, in source order.
 * @param {Function} isValidOrder The order predicate the rule reports against.
 * @param {string} shorthand The `shorthand` option.
 * @returns {Array<ASTNode>} The same properties, in sorted order.
 * @private
 */
function sortRegion(region, isValidOrder, shorthand) {
  const positions = [];

  region.forEach(function(prop, i) {
    if (getPropertyData(prop).name !== null) {
      positions.push(i);
    }
  });

  const sorted = positions
    .map(function(position) {
      return region[position];
    })
    .sort(compareProperties(isValidOrder, shorthand));
  const result = region.slice();

  positions.forEach(function(position, i) {
    result[position] = sorted[i];
  });

  return result;
}

/**
 * Collects the text that travels with a property when a region is re-ordered.
 *
 * A unit is made of the property's own-line leading comments, the property
 * itself and the comments trailing on the property's last line. Everything
 * else between two properties - the comma, line breaks, blank lines and
 * indentation - is a separator and keeps its position.
 * @param {SourceCode} sourceCode The source code object.
 * @param {ASTNode} prop The `Property` node to describe.
 * @returns {{trailing: Array<ASTNode>, commaEnd: number, end: number, start: number}} The unit.
 * @private
 */
function getPropertyUnit(sourceCode, prop) {
  const tokenBefore = sourceCode.getTokenBefore(prop);
  const leading = sourceCode.getCommentsBefore(prop).filter(function(comment) {
    return comment.loc.start.line !== tokenBefore.loc.end.line;
  });
  const nextToken = sourceCode.getTokenAfter(prop);
  const comma =
    nextToken && nextToken.type === 'Punctuator' && nextToken.value === ','
      ? nextToken
      : null;
  const candidates = comma
    ? sourceCode.getCommentsAfter(prop).concat(sourceCode.getCommentsAfter(comma))
    : sourceCode.getCommentsAfter(prop);
  const trailing = candidates.filter(function(comment) {
    return comment.loc.start.line === prop.loc.end.line;
  });

  return {
    trailing,
    commaEnd: comma ? comma.range[1] : prop.range[1],
    end: prop.range[1],
    start: leading.length > 0 ? leading[0].range[0] : prop.range[0]
  };
}

/**
 * The offset the fix has to replace up to.
 *
 * The region reaches past the comma of its last property, otherwise a trailing
 * comment moving into the last position would have nowhere to go.
 * @param {Object} lastUnit The unit of the region's last property.
 * @returns {number} The end of the region.
 * @private
 */
function getRegionEnd(lastUnit) {
  if (lastUnit.trailing.length === 0) {
    return lastUnit.commaEnd;
  }

  return Math.max(
    lastUnit.commaEnd,
    lastUnit.trailing[lastUnit.trailing.length - 1].range[1]
  );
}

/**
 * Reads the text from `start` up to and including the next line break.
 *
 * Only that much of the remaining source decides whether a `Line` comment may
 * be placed there, and a suggestion is built for every report - taking the
 * whole rest of the file would scale with the file instead of with the line.
 * @param {string} text The source text.
 * @param {number} start The offset to read from.
 * @returns {string} The rest of the line, including its line break.
 * @private
 */
function readToLineBreak(text, start) {
  const lineEnd = text.indexOf('\n', start);

  return text.slice(start, lineEnd === -1 ? text.length : lineEnd + 1);
}

/**
 * Checks whether the given text only contains horizontal whitespace up to its
 * first line break. A `Line` comment may only be emitted in front of such text,
 * otherwise it would comment out whatever follows on the same line.
 * @param {string} text The text following the comment.
 * @returns {boolean} `true` if a line break follows the comment.
 * @private
 */
function isFollowedByLineBreak(text) {
  return /^[^\S\n]*\n/.test(text);
}

/**
 * Renders the re-ordered region.
 *
 * Position `i` gets the head of `sortedUnits[i]` followed by the separator that
 * belongs to position `i`, with the separator's own trailing comment swapped for
 * the incoming unit's one.
 * @param {SourceCode} sourceCode The source code object.
 * @param {Array<Object>} units The units in source order.
 * @param {Array<Object>} sortedUnits The same units in sorted order.
 * @param {number} regionEnd The end of the region being replaced.
 * @returns {string|null} The region text, or `null` if it cannot be rendered.
 * @private
 */
function buildRegionText(sourceCode, units, sortedUnits, regionEnd) {
  const text = sourceCode.text;
  let result = '';

  for (let i = 0; i < units.length; i++) {
    const incoming = sortedUnits[i];
    const outgoing = units[i].trailing;
    const sepEnd = i < units.length - 1 ? units[i + 1].start : regionEnd;
    const pre =
      outgoing.length > 0
        ? text.slice(units[i].end, outgoing[0].range[0])
        : text.slice(units[i].end, units[i].commaEnd);
    const post =
      outgoing.length > 0
        ? text.slice(outgoing[outgoing.length - 1].range[1], sepEnd)
        : text.slice(units[i].commaEnd, sepEnd);
    let separator = pre.replace(/[^\S\n]+$/, '');

    if (incoming.trailing.length > 0) {
      const last = incoming.trailing[incoming.trailing.length - 1];
      const following =
        i < units.length - 1
          ? post
          : post + readToLineBreak(text, regionEnd);

      if (last.type === 'Line' && !isFollowedByLineBreak(following)) {
        return null;
      }
      separator +=
        ' ' + text.slice(incoming.trailing[0].range[0], last.range[1]);
    }

    result += text.slice(incoming.start, incoming.end) + separator + post;
  }

  return result;
}

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
    hasSuggestions: true,
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
          },
          ignoreSingleline: {
            type: 'boolean',
            default: false
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
    const ignoreSingleline = (options && options.ignoreSingleline) || false;
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
          numKeys: node.properties.length,
          isSameLine: isSameLine(node),
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
        if (
          prevName === null ||
          thisName === null ||
          numKeys < minKeys ||
          (ignoreSingleline && stack.isSameLine)
        ) {
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
                  : ' with shorthand properties ' + shorthand,
            },
            suggest: [{
              desc: 'Fix order',
              fix(fixer) {
                const sourceCode = context.sourceCode;
                const region = getRegion(node.parent.properties, node);
                const sorted = sortRegion(region, isValidOrder, shorthand);
                const units = region.map(function(prop) {
                  return getPropertyUnit(sourceCode, prop);
                });
                const sortedUnits = sorted.map(function(prop) {
                  return units[region.indexOf(prop)];
                });
                const regionEnd = getRegionEnd(units[units.length - 1]);
                const regionText = buildRegionText(
                  sourceCode,
                  units,
                  sortedUnits,
                  regionEnd
                );

                if (regionText === null) {
                  return null;
                }

                return fixer.replaceTextRange(
                  [units[0].start, regionEnd],
                  regionText
                );
              }
            }],
          });
        }
      }
    };
  }
};
