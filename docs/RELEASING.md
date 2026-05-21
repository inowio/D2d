# Releasing Inowio D2d

This runbook is for maintainers cutting a new public release. D2d ships
desktop installers through GitHub Actions and ships an in-app auto-updater,
so a release has two halves: build/publish on CI, then auto-deliver to
installed desktop users.

If you are reading this for the first time, walk through
[One-time setup](#one-time-setup) before your first release. After that,
[Cutting a release](#cutting-a-release) is the loop you repeat.

> **Desktop only.** The release workflow and the auto-updater cover Windows,
> macOS, and Linux. Android and iOS builds are *not* part of this flow — the
> Google Play Store and Apple App Store deliver mobile updates themselves
> when you upload a new versioned build there. See
> [Mobile releases](#mobile-releases).

## How releases work (1-minute overview)

1. You write changelog entries under `## [Unreleased]` while developing.
2. You run `npm run release -- X.Y.Z`. The script bumps every version field,
   moves the Unreleased entries under `## [X.Y.Z] - YYYY-MM-DD`, and prints
   what to commit and tag.
3. You commit and push the `vX.Y.Z` tag. GitHub Actions runs
   `.github/workflows/release.yml`.
4. The workflow verifies the tag matches every version field, builds on
   Windows / Linux / macOS, signs each installer with the updater key, and
   uploads everything to a **draft** GitHub release along with `latest.json`.
5. You review the draft release and click **Publish**. As soon as it is
   published, every installed desktop app (running an updater-enabled build)
   sees the new version on its next startup and prompts the user to install.

## One-time setup

You only need to do this once per repository. Subsequent releases reuse the
keypair and secrets.

### 1. Generate the Tauri updater keypair

The updater verifies download artifacts with a minisign signature. Generate
the keypair locally:

```bash
npx tauri signer generate -w ~/.tauri/d2d-updater.key
```

Pick a strong password when prompted. The command prints a **public key** and
writes the **private key** to the file you specified.

> **Back up the private key file and password somewhere safe.** Losing them
> means every future release will be signed with a new key, which breaks
> auto-update for every existing install — those users will have to
> re-install manually.

### 2. Commit the public key

Replace the `PUT_YOUR_TAURI_UPDATER_PUBLIC_KEY_HERE` placeholder in
[`src-tauri/tauri.conf.json`](../src-tauri/tauri.conf.json) (the
`plugins.updater.pubkey` field) with the public key the command printed.
Commit and push the change on `main` **before** cutting your first release.

> **`bundle.createUpdaterArtifacts` must stay `true`.** Tauri 2 defaults this
> flag to `false`, which makes the bundler skip producing `.sig` files and
> `latest.json` *regardless* of whether the signing key is set. It is already
> set to `true` in `src-tauri/tauri.conf.json` — do not remove it, or the
> workflow will succeed but the auto-updater will have no manifest to fetch.

### 3. Set the CI secrets

The release workflow reads two secrets:

| Secret name                          | Value                                         |
| ------------------------------------- | --------------------------------------------- |
| `TAURI_SIGNING_PRIVATE_KEY`           | Contents of the private key file from step 1. |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`  | The password you chose for the key.           |

Using `gh`:

```bash
gh secret set TAURI_SIGNING_PRIVATE_KEY < ~/.tauri/d2d-updater.key
gh secret set TAURI_SIGNING_PRIVATE_KEY_PASSWORD
# (paste the password when prompted)
```

Or add them manually under **Settings → Secrets and variables → Actions**.

`GITHUB_TOKEN` is provided automatically by Actions; you do not need to add
it.

## Cutting a release

### Before you start

- [ ] You are on `main` with a clean working tree.
- [ ] `## [Unreleased]` in `CHANGELOG.md` has the entries you want to ship.
      The bump script refuses to run if this section is empty.
- [ ] CI is green on `main`.

### Bump the version

```bash
git checkout main
git pull
npm run release -- 0.2.0
```

The script:

- Validates `0.2.0` is valid semver and **strictly greater** than the current
  version.
- Refuses to run if the working tree is dirty, or if a `v0.2.0` tag already
  exists locally or on `origin`.
- Updates `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`,
  and the `inowio-d2d` entry in `src-tauri/Cargo.lock`.
- Renames `## [Unreleased]` in `CHANGELOG.md` to `## [0.2.0] - YYYY-MM-DD`
  and inserts a fresh empty `## [Unreleased]` block above it.
- Does **not** commit or tag — you do that explicitly so the commit message
  stays under your control.

### Commit, tag, and push

```bash
git add -A
git commit -m "chore(release): v0.2.0"
git tag v0.2.0
git push && git push origin v0.2.0
```

The `git push origin v0.2.0` is what fires the release workflow.

> **If `main` is a protected branch** (direct pushes rejected): push the bump
> commit on a `release/v0.2.0` branch, open a PR into `main`, and merge it.
> Then tag the resulting commit on `main` and push the tag:
>
> ```bash
> git checkout main && git pull
> git tag v0.2.0
> git push origin v0.2.0
> ```
>
> Tag the canonical commit on `main`, not the branch commit — a squash-merge
> changes the hash, and a tag on the branch would dangle.

### Watch the workflow

Open the Actions tab on GitHub and find the **Release** run for your tag.

- `verify-version` runs first. It fails fast if any version field disagrees
  with the tag (which should never happen if you used the bump script).
- Three platform jobs run in parallel (`windows-latest`, `ubuntu-22.04`,
  `macos-latest`). The macOS job builds a universal binary. The first run on
  each platform takes ~15 minutes; later runs are cached by
  `Swatinem/rust-cache`.

When all three platforms succeed, a **draft** release appears on the
[releases page](https://github.com/inowio/D2d/releases) with installers,
`.sig` files, and `latest.json` attached.

### Publish the draft

1. Open the draft release.
2. Skim the artifact list. For a healthy updater-enabled release you should
   see ~16 assets:
   - 6 installers — `.msi`, `*-setup.exe`, `.dmg`, `.AppImage`, `.deb`, `.rpm`
   - 5 `.sig` files — one per installer **except** the `.dmg`
   - `*_universal.app.tar.gz` and its `.sig` — the macOS update artifact
   - `latest.json` — the updater manifest
   - 2 source-code archives (auto-added by GitHub)
3. **Critical sanity check:** if `latest.json` or any `.sig` files are
   missing, do **not** publish. See
   [Updater artifacts didn't generate](#updater-artifacts-didnt-generate).
4. Edit the release notes if you want richer formatting than the changelog.
5. Click **Publish release**.

Within seconds the GitHub Releases "latest" URL points to your new release.
Installed desktop apps see it on next startup.

## Recovering from a failed build

### Updater artifacts didn't generate

Symptom: the draft release has installers but no `latest.json` and no `.sig`
files. The build log shows `Signature not found for the updater JSON.
Skipping upload...`.

Root cause is almost always **one** of these, in order of frequency:

1. `bundle.createUpdaterArtifacts` is `false` or missing in
   `src-tauri/tauri.conf.json`.
2. `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` doesn't match the password used when
   the keypair was generated. Signing fails silently and `tauri-action`
   carries on without the `.sig` files.
3. Either signing secret is missing or malformed (line endings mangled by a
   copy-paste, etc.).

Quick local check for #2 — try signing a throwaway file with the key:

```bash
echo test > t.txt
npx tauri signer sign -f ~/.tauri/d2d-updater.key -p "<YOUR-PASSWORD>" t.txt
```

If that produces `t.txt.sig`, your password matches the key.

After fixing the cause: delete the draft release, delete the tag locally and
on origin, re-tag `main`, and push the tag again.

```bash
git tag -d v0.2.0
git push origin --delete v0.2.0
git checkout main && git pull
git tag v0.2.0
git push origin v0.2.0
```

### One platform failed, the others succeeded

The draft release contains partial artifacts. Either:

1. **Re-run from the Actions UI** — open the failed job and click "Re-run
   failed jobs". The cache from successful platforms makes this fast.
2. **Re-dispatch the workflow** via `Actions → Release → Run workflow` and
   pass the existing tag (e.g. `v0.2.0`).

### All platforms failed for the same reason

Delete the draft release, fix the problem in code, bump to the next patch
version (`0.2.1`), and re-release. Do not re-use the same tag.

## Pre-releases (RC builds)

Tags containing a hyphen ship as GitHub prereleases automatically:

```bash
npm run release -- 0.2.0-rc.1
# ... commit ...
git tag v0.2.0-rc.1
git push origin v0.2.0-rc.1
```

GitHub's `releases/latest` redirect only points to non-prerelease releases,
so the auto-updater on production installs **does not** pick up RC builds.
RC testers download the prerelease installers manually from the releases
page.

## Mobile releases

Android and iOS are released **outside** this workflow:

- The auto-updater is compiled out of mobile builds (see the target-gated
  dependencies in `src-tauri/Cargo.toml`), and the in-app "Check for updates"
  button is hidden on mobile.
- Build the mobile artifacts locally with `npm run tauri android build`
  (and the iOS equivalent once iOS is set up), then upload the versioned
  build to the Google Play Console / App Store Connect.
- The stores handle delivering the update to users. Keep the version in sync
  by running `npm run release -- X.Y.Z` first, so all platforms share one
  version and changelog.

## Updater key rotation

Only rotate the updater key if you believe it is compromised. Rotating
**breaks auto-update for every existing install** — those users have to
re-install manually.

To rotate:

1. Generate a new keypair (same command as step 1 of one-time setup).
2. Update the `plugins.updater.pubkey` field in `src-tauri/tauri.conf.json`
   on `main`.
3. Replace both GitHub secrets (`TAURI_SIGNING_PRIVATE_KEY` and
   `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`).
4. In the release notes, instruct existing users to download and re-install
   manually.

## Reference: artifact map

| OS      | Installer            | Auto-update target?           |
| ------- | -------------------- | ----------------------------- |
| Windows | `*.exe` (NSIS)       | Yes — recommended for users.  |
| Windows | `*.msi`              | No — provided for IT/MDM use. |
| macOS   | `*.dmg` (universal)  | Yes.                          |
| Linux   | `*.AppImage`         | Yes.                          |
| Linux   | `*.deb`              | No — manual re-install only.  |
| Linux   | `*.rpm`              | No — manual re-install only.  |

`.sig` files alongside each installer let users verify integrity against the
updater public key out-of-band if they need to.
