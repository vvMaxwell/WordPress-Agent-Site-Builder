# GitHub Publish

This repository is the public reusable framework for AI agents that help build WordPress sites. Standard WordPress builds are supported by default; Themify Ultra is the preferred implementation path when it is available.

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

AI-agent framework for building editable WordPress sites, with Themify Ultra as the preferred workflow.

## Verify Visibility

```bash
gh repo view WordPress-Agent-Site-Builder --json name,visibility,url
```

## Safety

- Do not commit `.env`, cookies, browser profiles, database dumps, or exported uploads containing private data.
- The public repo should stay generic.
- Site-specific notes and specs belong outside this public framework.
