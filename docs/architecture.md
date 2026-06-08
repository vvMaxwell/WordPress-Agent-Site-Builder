# Phase 2 Framework Design

## Objective

Create a reusable system that turns a prompt-derived site specification into a WordPress + Themify Ultra website while preserving Builder editability.

## High-Level Architecture

```text
Prompt
  -> Site Spec JSON
  -> Planner
  -> Content/Media Generators
  -> Themify Layout Compiler
  -> WordPress Executor
  -> Browser Validator
  -> Handoff Report
```

## Core Components

### Site Spec

The site spec is the canonical input. It describes:

- business identity
- audience
- pages
- sections
- calls to action
- navigation
- forms
- media
- SEO metadata
- style tokens
- reusable templates/layout parts

Schema: [automation/schemas/site-spec.schema.json](../automation/schemas/site-spec.schema.json)

### Planner

The planner converts the site spec into deterministic build tasks:

- create/update pages
- create media requests
- create forms
- create menus
- compile Builder layouts
- assign homepage
- apply theme settings
- apply SEO metadata
- validate frontend and Builder editability

Prototype: [automation/scripts/generate-plan.mjs](../automation/scripts/generate-plan.mjs)

### Content Generator

Future responsibility:

- expand brief prompts into page copy
- enforce tone and audience
- produce headings, body copy, buttons, alt text, and SEO metadata
- avoid locking content into non-editable custom templates

The output should remain plain structured content that can be placed into Themify Text, Fancy Heading, Button, Image, Gallery, Accordion, Tab, Testimonial, and Contact modules.

### Media Generator

Future responsibility:

- generate or source images
- record prompt/source/license metadata
- optimize image dimensions
- upload to WordPress media library
- return attachment IDs and URLs

Builder layouts should reference attachment IDs after upload whenever the module supports them.

### Themify Layout Compiler

The compiler maps page sections to Themify-native Builder structures:

- section -> row
- columns -> Themify grid classes
- text blocks -> Text or Fancy Heading modules
- CTAs -> Button module
- service cards -> Feature, Box, or Text/Button groups
- galleries -> Gallery module
- FAQs -> Accordion module
- testimonials -> Testimonials module
- forms -> Contact addon module or shortcode fallback
- reusable global sections -> Layout Parts

The compiler should prefer known-good snippets exported from Themify Builder. Raw JSON generation is acceptable only when the module schema is verified against the active Themify version.

### WordPress Executor

The executor runs inside WordPress via WP-CLI:

```bash
wp eval-file automation/php/apply-site-spec.php -- /path/to/site-spec.json
```

Responsibilities:

- verify WordPress is installed
- verify Ultra or an Ultra child theme is active
- verify Builder APIs are loaded
- create pages/posts
- save Builder data through `ThemifyBuilder_Data_Manager::save_data()`
- upload media
- create menus and assign locations
- configure homepage
- create layout parts
- call SEO adapters
- clear caches or trigger Builder CSS regeneration when available

Prototype: [automation/php/apply-site-spec.php](../automation/php/apply-site-spec.php)

### Browser Validator

Playwright should validate the output after WordPress execution:

- admin login works
- generated pages return 200
- frontend Builder opens for an admin/editor
- Builder toolbar exists
- key generated modules are visible
- desktop and mobile screenshots are captured

Prototype: [automation/playwright/validate-builder.spec.ts](../automation/playwright/validate-builder.spec.ts)

## Data Contracts

### Input

`site-spec.json` is human-readable and versioned. It should be created from prompts, revised by humans if needed, then used as the source of truth.

### Intermediate Output

`build/site-plan/` contains:

- `build-plan.json`
- one Builder JSON file per page
- `handoff.md`

### Live Output

A connected WordPress execution should produce:

- page IDs and URLs
- media attachment IDs
- menu IDs and locations
- form IDs or Builder module references
- SEO adapter write results
- validation screenshots/traces
- final handoff report

## Themify-First Mapping Rules

- Use Ultra theme settings before writing CSS.
- Use Builder row/module styling before writing CSS.
- Use Builder Layout Parts for repeated sections.
- Use WordPress menus and Themify menu locations for navigation.
- Use Builder Contact addon for forms when available.
- Use Text/HTML modules for shortcodes only when a native Themify module is unavailable.
- Keep PHP limited to automation bridges and plugin adapters.

## Extension Points

- `seo-adapters/yoast`
- `seo-adapters/rank-math`
- `form-adapters/themify-contact`
- `form-adapters/contact-form-7`
- `media-providers/openai`
- `media-providers/local`
- `layout-snippets/themify-ultra/<version>`

These should be adapters, not assumptions embedded in the planner.
