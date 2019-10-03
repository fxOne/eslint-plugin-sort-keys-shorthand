'use strict';

module.exports = {
  rules: {
    'sort-keys-shorthand': require('./lib/rules/sort-keys-shorthand')
  },
  configs: {
    recommended: {
      rules: {
        'sort-keys-shorthand/sort-keys-shorthand': 'warn'
      }
    }
  }
};
