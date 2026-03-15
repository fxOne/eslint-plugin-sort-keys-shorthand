# Release Process

This project uses **npm trusted publishing** with OIDC — no npm tokens are
needed for publishing. Provenance attestations are generated automatically.

---

## One-Time Setup

These steps only need to be done once, before the first release.

### 1. Configure trusted publishing on npmjs.com

1. Go to https://www.npmjs.com/package/eslint-plugin-sort-keys-shorthand/access
2. Sign in as a package owner
3. Scroll to **"Trusted Publisher"** and click **GitHub Actions**
4. Fill in the form:
   - **Organization or user:** `fxOne`
   - **Repository:** `eslint-plugin-sort-keys-shorthand`
   - **Workflow filename:** `release.yml`
   - **Environment name:** _(leave empty)_
5. Save

### 2. Lock down token access (recommended)

1. On the same package settings page, go to **"Publishing access"**
2. Select **"Require two-factor authentication and disallow tokens"**
3. Save

### 3. Remove the old NPM_TOKEN secret from GitHub

1. Go to https://github.com/fxOne/eslint-plugin-sort-keys-shorthand/settings/secrets/actions
2. Delete the `NPM_TOKEN` secret (no longer needed)
3. Optionally delete the `AUTOMERGE_TOKEN` secret as well
   (the `dependabot-auto-merge.yml` workflow has been removed)

### 4. Revoke old npm access tokens

1. Go to https://www.npmjs.com/settings/~/tokens
2. Revoke any automation/publish tokens that were previously used by CI

---

## Publishing a New Release

### Step 1: Merge the release PR

Merge the release pull request into `master` on GitHub.

### Step 2: Tag the release

```bash
git checkout master
git pull origin master
git tag v4.0.0
git push origin v4.0.0
```

### Step 3: Automated release

Pushing the `v*` tag automatically triggers the **Release** workflow which:

1. Checks out the code
2. Installs dependencies with pnpm
3. Runs the full test suite
4. Publishes to npm using OIDC (no token needed)
5. Creates a GitHub Release with auto-generated release notes

### Step 4: Verify

- Check the workflow run: https://github.com/fxOne/eslint-plugin-sort-keys-shorthand/actions/workflows/release.yml
- Verify the package on npm: https://www.npmjs.com/package/eslint-plugin-sort-keys-shorthand
- The package page should show a **"Provenance"** badge confirming the build origin

---

## How It Works

The release workflow uses **npm trusted publishing** via OpenID Connect (OIDC):

- No `NPM_TOKEN` secret is stored in GitHub
- GitHub Actions mints a short-lived OIDC token during the workflow run
- npm verifies the token against the trusted publisher config on npmjs.com
- Provenance attestations are generated automatically (signed by Sigstore)
- The OIDC token cannot be extracted, reused, or leaked

For more info: https://docs.npmjs.com/trusted-publishers
