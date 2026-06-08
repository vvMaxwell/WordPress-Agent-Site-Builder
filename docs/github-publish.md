# GitHub Publish

This workspace is split into two repos:

- Public reusable framework: `/home/codex/Projects/Themify_Site_Builder`
- Private live-session fork: `/home/codex/Projects/Themify_Site_Builder_methlabprojects_private`

## Authenticate GitHub CLI

The current `gh` token must be valid before publishing:

```bash
gh auth login -h github.com
```

## Publish Public Framework

```bash
cd /home/codex/Projects/Themify_Site_Builder
gh repo create themify-ultra-site-builder --public --source=. --remote=origin --push
```

## Publish Private Live-Session Fork

```bash
cd /home/codex/Projects/Themify_Site_Builder_methlabprojects_private
gh repo create methlabprojects-themify-private --private --source=. --remote=origin --push
```

## Verify Visibility

```bash
gh repo view themify-ultra-site-builder --json name,visibility,url
gh repo view methlabprojects-themify-private --json name,visibility,url
```

## Safety

- Do not commit `.env`, cookies, browser profiles, database dumps, or exported uploads containing private data.
- The public repo should stay generic.
- Site-specific notes and specs belong only in the private fork.
