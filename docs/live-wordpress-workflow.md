# Live WordPress Workflow

Use this checklist when connecting the framework to a real WordPress installation. The expected workflow is demo-first: import a Themify Ultra demo/skin, then adapt it with Themify Builder and Builder Pro.

## 1. Inspect Environment

```bash
wp core version
wp theme status
wp plugin list
wp option get stylesheet
wp option get template
```

Confirm:

- WordPress is installed.
- Ultra or an Ultra child theme is active.
- Builder is available through Ultra or the standalone Builder plugin.
- The current user can create pages, upload media, manage menus, and edit theme options.
- Builder Pro is available if header/footer templates are required.

## 2. Verify Themify

In WP Admin:

1. Confirm Themify Updater is installed and active.
2. Confirm the domain is registered in the Themify member area.
3. Confirm username/license key are accepted in Dashboard > Themify License.
4. Confirm Ultra can update.
5. Confirm Themify Builder is enabled in Themify settings.
6. Import the closest Themify Ultra demo/skin before rebuilding pages, unless the user explicitly asks not to.
7. Confirm the body/demo skin class on the front end after import.

## 3. Collect The Site Spec

Use [intake-prompts.md](intake-prompts.md). Convert the answers into:

- selected Ultra demo/skin
- page list and menu order
- service/team/detail pages
- main color, accent color, and hover color
- copy tone
- header/footer template preference
- constraints such as no custom CSS and no custom HTML

## 4. Run Builder Proof

Use the proof-page script in [themify-builder-workflow.md](themify-builder-workflow.md). This must pass before autonomous site creation.

Pass criteria:

- Page is created.
- `_themify_builder_settings_json` exists.
- Frontend renders.
- `#builder_active` opens Builder for an authenticated admin/editor.
- A small edit can be saved through Builder.

## 5. Apply Site Spec

```bash
wp eval-file automation/php/apply-site-spec.php -- /absolute/path/to/site-spec.json
```

Expected executor behavior:

- Validate environment.
- Confirm or import the selected Ultra demo.
- Create or update pages by slug.
- Save Builder data through Themify APIs.
- Set no-sidebar/no-title Ultra page meta for Builder-first pages.
- Disable sticky sidebars on Builder-first pages.
- Upload and map media.
- Create menus and assign locations.
- Create Builder Pro header/footer templates when requested.
- Disable duplicate default Ultra header/footer pieces when templates replace them.
- Configure homepage.
- Apply SEO adapter metadata.
- Emit a machine-readable result.

## 6. Validate With Browser Automation

Set environment variables:

```bash
export WP_BASE_URL="https://example.com"
export WP_ADMIN_USER="admin-user"
export WP_ADMIN_PASSWORD="secret"
```

Run:

```bash
npm test
```

Validation should capture screenshots and fail if Builder cannot be opened.

Required front-end checks:

- Header renders once.
- Footer renders once.
- Sticky header works if requested.
- Menu hovers match the requested palette or no-hover setting.
- Service/team cards link to the right pages.
- No right sidebar appears on Builder-first pages.
- Themify CSS/cache has been regenerated.

## 7. Handoff

The handoff report should include:

- pages and URLs
- menus and locations
- form delivery notes
- SEO plugin status
- media inventory
- validation screenshots
- known manual checks
- confirmation that content remains editable in Themify Builder
