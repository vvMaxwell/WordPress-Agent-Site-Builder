# Phase 3 Automation Plan

## Phase 3A: Offline Foundation

Implemented in this repository:

1. Define a site spec schema.
2. Create an example site spec.
3. Generate a deterministic build plan.
4. Generate Themify-style Builder JSON artifacts.
5. Produce a handoff report.
6. Provide a future WordPress PHP executor.
7. Provide a future Playwright validation template.

Run:

```bash
npm run generate -- automation/examples/site-spec.example.json
```

## Phase 3B: Local WordPress Harness

Future work when a local install is desired:

1. Add a Docker Compose stack for WordPress, MariaDB, and WP-CLI.
2. Mount this repository into the WP-CLI container.
3. Install WordPress through WP-CLI.
4. Install Ultra from a local premium zip supplied outside the repository.
5. Install Themify Updater from a local zip or official download.
6. Enter license credentials through secrets or manual admin setup.
7. Run the proof page from [themify-builder-workflow.md](themify-builder-workflow.md).

Do not commit premium zips or credentials.

## Phase 3C: WordPress Executor

The executor should mature in this order:

1. Environment inspection.
2. Page creation.
3. Builder data save through Themify APIs.
4. Static homepage assignment.
5. Menu creation and location assignment.
6. Media upload and attachment mapping.
7. Layout Part creation.
8. Themify Contact module adapter.
9. SEO plugin adapter.
10. Cache/CSS regeneration.
11. Idempotent updates based on stable slugs.

## Phase 3D: Validation

Browser validation should run after each build:

1. Log in as an admin/editor.
2. Visit each generated page.
3. Open `#builder_active`.
4. Assert that the Builder toolbar or module panel appears.
5. Capture screenshots.
6. Optionally perform a small save test in disposable environments.

## Phase 3E: Autonomous Site Creation Flow

Future end-to-end flow:

1. User prompt arrives.
2. Prompt is converted to `site-spec.json`.
3. Human optionally reviews the spec.
4. Images are generated and stored locally.
5. Offline planner produces build artifacts.
6. WordPress executor applies the spec.
7. Browser validator checks frontend and Builder editability.
8. Handoff report lists URLs, credentials handling notes, editable Builder areas, and any manual follow-up.

## Guardrails

- No raw database writes in normal operation.
- No custom theme generation.
- No custom PHP page templates for standard marketing pages.
- No large custom CSS files.
- No generated content that bypasses Builder editability.
- No committed credentials, licenses, generated secrets, or premium zips.
