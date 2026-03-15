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

## Release Process

This project uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers) with OIDC. Provenance attestations are generated automatically — no npm tokens are needed for publishing.

### One-time setup

These steps only need to be done once, before the first trusted publishing release.

1. **Configure trusted publisher on npmjs.com**
   - Go to [package settings](https://www.npmjs.com/package/eslint-plugin-sort-keys-shorthand/access)
   - Under **Trusted Publisher**, select **GitHub Actions**
   - Set: org/user = `fxOne`, repo = `eslint-plugin-sort-keys-shorthand`, workflow = `release.yml`
   - Save

2. **Lock down token access** (recommended)
   - On the same page under **Publishing access**, select **"Require two-factor authentication and disallow tokens"**

3. **Clean up old secrets**
   - Delete the `NPM_TOKEN` secret from [GitHub repo settings](https://github.com/fxOne/eslint-plugin-sort-keys-shorthand/settings/secrets/actions)
   - Revoke old automation tokens on [npmjs.com](https://www.npmjs.com/settings/~/tokens)

### Publishing a release

1. Go to [Actions > Release](https://github.com/fxOne/eslint-plugin-sort-keys-shorthand/actions/workflows/release.yml)
2. Click **"Run workflow"** on the `master` branch
3. The workflow runs tests, publishes to npm with provenance, and creates a GitHub Release
