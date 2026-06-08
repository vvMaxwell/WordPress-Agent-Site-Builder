# AI Agent WordPress Site Builder Playbook

Reusable source material for AI agents that help build WordPress sites. The default target is a clean, editable WordPress site; the preferred workflow uses Themify Ultra, Themify Builder, Builder Pro templates, and imported Ultra demos.

The goal is not to replace WordPress or Themify with custom code. The goal is to make AI agents start future builds with the right assumptions: use WordPress-native content and settings by default, import a Themify Ultra demo/skin when Ultra is available, adapt demo pages and modules, use Builder Pro templates for the header and footer, keep pages editable, and avoid custom CSS or custom HTML snippets unless there is a clear reason.

## Core Rules

- Build WordPress sites in a way site owners can keep editing in wp-admin.
- Prefer Themify Ultra when available. Use an imported Ultra demo/skin as the design base instead of starting from a blank visual layout unless the user explicitly asks for a blank build.
- Reword, reorder, and restyle the demo content inside Themify Builder/Ultra controls.
- Do not add custom CSS, custom HTML blocks, or theme-file edits for normal site styling.
- Use Builder Pro templates for site-wide header and footer when the user wants editable header/footer control.
- Disable the default Ultra header pieces when a Builder Pro header template is active.
- Set Builder-first pages to no sidebar and hidden page title unless the design specifically needs the default page chrome.
- Keep spacing, colors, links, hovers, menus, cards, and media controlled through Themify rows/modules/theme settings.
- Validate the frontend after every structural change.

## Repository Map

- [docs/intake-prompts.md](docs/intake-prompts.md): questions Codex should ask before building.
- [docs/reusable-build-rules.md](docs/reusable-build-rules.md): practical rules learned from the live Themify build.
- [docs/live-site-lessons.md](docs/live-site-lessons.md): fixes and patterns to reuse on future sites.
- [docs/research.md](docs/research.md): Phase 1 research findings and source links.
- [docs/architecture.md](docs/architecture.md): reusable system design.
- [docs/automation-plan.md](docs/automation-plan.md): phased automation workflow.
- [docs/dependencies.md](docs/dependencies.md): required and optional tools.
- [docs/setup.md](docs/setup.md): local setup and future WordPress setup.
- [docs/live-wordpress-workflow.md](docs/live-wordpress-workflow.md): how to connect this framework to a real install later.
- [docs/themify-builder-workflow.md](docs/themify-builder-workflow.md): Themify Builder storage and save API notes.
- [automation/examples/ultra-demo-site-spec.example.json](automation/examples/ultra-demo-site-spec.example.json): demo-first site spec example.
- [automation/examples/site-spec.example.json](automation/examples/site-spec.example.json): prompt-derived site specification example.
- [automation/schemas/site-spec.schema.json](automation/schemas/site-spec.schema.json): framework input schema.
- [automation/scripts/generate-plan.mjs](automation/scripts/generate-plan.mjs): offline prototype that creates page plans and Themify-style Builder JSON artifacts.
- [automation/php/apply-site-spec.php](automation/php/apply-site-spec.php): future `wp eval-file` executor for real WordPress installs.
- [automation/playwright/validate-builder.spec.ts](automation/playwright/validate-builder.spec.ts): future browser validation template.

## Quick Start

Start by collecting a site spec from the user using [docs/intake-prompts.md](docs/intake-prompts.md). Then choose the closest Themify Ultra demo and adapt that demo, instead of inventing a layout from scratch.

Generate offline artifacts from the example site spec:

```bash
npm run generate -- automation/examples/site-spec.example.json
```

The generated output is written to `build/site-plan/`. It does not require WordPress.

## Recommended AI Agent Starting Prompt

When beginning a new site build, the AI agent should ask:

```text
Before I build, I need the site brief:
1. What is the site/business name and goal?
2. What pages do you want in the navigation?
3. Are we using standard WordPress defaults, or Themify Ultra? If Ultra, what demo/skin should I use, or should I pick the closest one?
4. What main color, accent color, and hover color should be used?
5. What tone should the copy have?
6. Do you want editable Builder Pro header and footer templates?
7. Do you want service/team/detail pages linked from the main pages?
```

If the user says "pick" and Themify Ultra is available, choose an Ultra demo that matches the site's industry, import it, then adapt it.

## Current Status

Implemented now:

- WordPress-first build rules with Themify Ultra as the preferred implementation path.
- Demo-first Themify Ultra build rules.
- Intake prompt checklist.
- Live-site lessons from a completed Themify Ultra demo-based build.
- Offline site-spec to Builder-layout artifact generator.
- Future PHP bridge for WordPress + Themify execution.
- Playwright validation template.

Deferred until a real WordPress installation exists:

- Installing WordPress and licensing Themify Ultra on a new domain.
- Importing the selected Ultra demo on the target site.
- Creating real pages, menus, media, forms, and SEO metadata.
- Verifying exact Builder module schemas from the active Themify version.
