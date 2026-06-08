# GitHub Publish

This is the public repo for helping AI coding agents build WordPress sites. It works for regular WordPress sites, but Themify Ultra is the preferred setup.

Repository: `/home/codex/Projects/Themify_Site_Builder`

## Authenticate GitHub CLI

The current `gh` token must be valid before publishing:

```bash
gh auth login -h github.com
```

## Publish Public Framework

```bash
cd /home/codex/Projects/Themify_Site_Builder
gh repo create WordPress-Agent-Site-Builder --public --source=. --remote=origin --push
```

## Suggested GitHub Description

Helps AI coding agents build editable WordPress sites. Works best with Themify Ultra.

## Verify Visibility

```bash
gh repo view WordPress-Agent-Site-Builder --json name,visibility,url
```

## Safety

- Do not commit `.env`, cookies, browser profiles, database dumps, or exported uploads containing private data.
- The public repo should stay generic.
- Client-specific notes and site plans should stay out of this public repo.
