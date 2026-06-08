# WordPress Agent Site Builder

This repo helps AI coding agents build WordPress sites without starting from scratch every time.

It can be used for regular WordPress sites, but the preferred setup is WordPress with Themify Ultra. The main idea is simple: start with a good Themify Ultra demo, change it to fit the client, and keep the site easy to edit in WordPress.

## Basic Rules

- Build WordPress sites in a way site owners can keep editing in wp-admin.
- Use Themify Ultra when it is available.
- Start from an imported Ultra demo/skin instead of a blank page, unless the user asks for a blank build.
- Change the demo text, layout, colors, and images inside Themify Builder.
- Avoid custom CSS, custom HTML blocks, or theme-file edits for normal styling.
- Use Builder Pro templates for the site header and footer when the user wants to edit them later.
- Disable the default Ultra header pieces when a Builder Pro header template is active.
- Set Builder-first pages to no sidebar and hidden page title unless the design specifically needs the default page chrome.
- Keep spacing, colors, links, hover styles, menus, cards, and images controlled through Themify settings.
- Check the live page after every major change.

## Repository Map

- [docs/intake-prompts.md](docs/intake-prompts.md): questions to ask before building a site.
- [docs/reusable-build-rules.md](docs/reusable-build-rules.md): practical Themify build rules.
- [docs/live-site-lessons.md](docs/live-site-lessons.md): fixes and patterns to reuse on future sites.
- [docs/research.md](docs/research.md): research notes and source links.
- [docs/architecture.md](docs/architecture.md): how the pieces fit together.
- [docs/automation-plan.md](docs/automation-plan.md): planned automation steps.
- [docs/dependencies.md](docs/dependencies.md): required and optional tools.
- [docs/setup.md](docs/setup.md): local setup and WordPress setup notes.
- [docs/live-wordpress-workflow.md](docs/live-wordpress-workflow.md): how to use this with a real WordPress site.
- [docs/themify-builder-workflow.md](docs/themify-builder-workflow.md): Themify Builder storage and save API notes.
- [automation/examples/ultra-demo-site-spec.example.json](automation/examples/ultra-demo-site-spec.example.json): demo-first site spec example.
- [automation/examples/site-spec.example.json](automation/examples/site-spec.example.json): example site plan.
- [automation/schemas/site-spec.schema.json](automation/schemas/site-spec.schema.json): rules for the site plan JSON.
- [automation/scripts/generate-plan.mjs](automation/scripts/generate-plan.mjs): creates offline page plans and Themify-style Builder JSON.
- [automation/php/apply-site-spec.php](automation/php/apply-site-spec.php): planned WordPress runner for real sites.
- [automation/playwright/validate-builder.spec.ts](automation/playwright/validate-builder.spec.ts): browser check template.

## Quick Start

Start by asking the site questions in [docs/intake-prompts.md](docs/intake-prompts.md). Then choose the closest Themify Ultra demo and adapt it.

Generate a sample site plan:

```bash
npm run generate -- automation/examples/site-spec.example.json
```

The files are written to `build/site-plan/`. This does not require WordPress.

## Starting Prompt

When starting a new site build, ask:

```text
Before I build, I need the site brief:
1. What is the site/business name and goal?
2. What pages do you want in the navigation?
3. Are we using regular WordPress, or Themify Ultra? If Themify Ultra, what demo/skin should I use, or should I pick one?
4. What main color, accent color, and hover color should be used?
5. What tone should the copy have?
6. Do you want editable Builder Pro header and footer templates?
7. Do you want service/team/detail pages linked from the main pages?
```

If the user says "pick" and Themify Ultra is available, choose a demo that fits the business, import it, then adapt it.

## Current Status

Implemented now:

- WordPress build rules with Themify Ultra as the preferred setup.
- Demo-first Themify Ultra build rules.
- Intake prompt checklist.
- Live-site lessons from a completed Themify Ultra demo-based build.
- Offline site plan generator.
- Planned PHP runner for WordPress + Themify.
- Browser check template.

Deferred until a real WordPress installation exists:

- Installing WordPress and licensing Themify Ultra on a new domain.
- Importing the selected Ultra demo on the target site.
- Creating real pages, menus, media, forms, and SEO metadata.
- Verifying exact Builder module schemas from the active Themify version.
