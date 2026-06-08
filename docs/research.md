# Phase 1 Research

Date: 2026-06-02

## WordPress Installation Workflows

Recommended automation path:

1. Provision hosting, PHP, database, HTTPS, and file permissions.
2. Install WP-CLI.
3. Run `wp core download`.
4. Run `wp config create` with database credentials.
5. Run `wp db create` when the database user has permission.
6. Run `wp core install` with URL, title, admin user, admin email, and a generated password.
7. Apply baseline settings with WP-CLI:
   - permalink structure
   - timezone
   - site title/tagline
   - search engine visibility
   - default comments
   - uploads path defaults

WP-CLI is the preferred install automation interface because it invokes WordPress bootstrap code and avoids brittle browser setup flows.

Source: https://developer.wordpress.org/cli/commands/core/

## Themify Ultra Installation And Licensing

Themify Ultra is installed like a standard premium WordPress theme:

- Download `theme.zip` from the Themify member area.
- Upload through WP Admin > Appearance > Themes > Add New > Upload Theme, or install from a local zip with WP-CLI when the zip is available.
- Activate Ultra or an Ultra child theme.

Licensing and updates are handled through the Themify Updater plugin:

- Install and activate `themify-updater.zip`.
- Register the site domain in the Themify member area.
- Enter Themify username and license key in WP Admin > Dashboard > Themify License.
- Use the Themify License panel to install or update eligible Themify themes/plugins.

Automation implication: do not hard-code or commit license keys. Treat license setup as a secrets-driven provisioning step or a manual admin checkpoint.

Sources:

- https://themify.me/docs/ultra-documentation
- https://themify.me/docs/themify-updater-documentation
- https://themify.me/docs/upgrading

## Themify Builder Capabilities

Themify Builder works with WordPress posts, pages, and custom post types that render `the_content()`. It supports backend editing and frontend live editing. Ultra includes Builder in the theme framework, so a separate Builder plugin is not required when using a Themify theme.

Native capabilities to prioritize:

- Rows, columns, subrows, and responsive grids.
- Module styling and responsive styling controls.
- Default modules such as text, image, gallery, button, callout, tabs, accordion, testimonials, video, map, menu, opt-in, and HTML/Text.
- Predesigned layouts and saved layouts.
- Layout Parts for reusable global sections.
- Builder import/export.
- Revisions.
- Builder static content for editor/search compatibility.
- Builder settings, cache/minification controls, and CSS regeneration tools.

Important limitations:

- Builder does not operate on archive pages directly.
- A Builder homepage must be a static WordPress page assigned in Settings > Reading.
- Templates must render `the_content()`.
- Module settings are module-specific and version-specific; the safest automation strategy is to collect known-good exported snippets and save through Themify APIs.

Source: https://themify.me/docs/builder

## Themify Builder Storage And APIs

Builder page data is stored as post meta, primarily `_themify_builder_settings_json`. The safest programmatic write path is a WordPress-bootstrapped PHP script that calls Themify's own data manager, rather than direct database writes.

Preferred save path for real sites:

```php
ThemifyBuilder_Data_Manager::save_data($builder_data, $post_id, 'frontend', null);
```

See [themify-builder-workflow.md](themify-builder-workflow.md) for storage shape, meta keys, and a proof-page script.

## Website Creation Automation Methods

Recommended order:

1. WP-CLI plus WordPress PHP APIs for installation, settings, content, menus, media, and plugin activation.
2. Themify PHP APIs for Builder layout persistence.
3. WordPress REST API for authenticated content/media operations where a PHP bridge is unnecessary.
4. Browser automation for validation and admin-only workflows without stable APIs.
5. Direct database writes only for diagnostics or recovery, not normal creation.

## Browser Automation Options

Playwright is the preferred browser automation option for this framework because it supports Chromium, Firefox, WebKit, trace capture, screenshots, and reliable selectors. Use it for:

- logging into wp-admin in disposable validation environments
- opening frontend Builder with `#builder_active`
- verifying Builder toolbar presence
- taking screenshots
- smoke testing generated pages on desktop and mobile

Selenium remains viable when an organization already has Selenium Grid infrastructure, but it is heavier for this use case.

Source: https://playwright.dev/docs/intro

## WordPress APIs And Administrative Interfaces

Use native APIs where possible:

- `wp_insert_post()` and `wp_update_post()` for pages and posts.
- `media_handle_sideload()` or REST media endpoints for uploads.
- `wp_create_nav_menu()` and `wp_update_nav_menu_item()` for menus.
- `set_theme_mod('nav_menu_locations', ...)` for menu locations.
- `update_option()` for site settings.
- REST API for posts, pages, users, media, taxonomies, and available navigation endpoints.

Sources:

- https://developer.wordpress.org/rest-api/reference/
- https://developer.wordpress.org/rest-api/reference/media/
- https://developer.wordpress.org/reference/functions/wp_update_nav_menu_item/

## Media Management Workflows

Preferred workflow:

1. Generate or collect source images outside WordPress.
2. Store prompt, license/source, alt text, intended use, and local path in the site spec.
3. Upload media through WordPress media APIs.
4. Capture attachment IDs.
5. Reference attachment IDs in Builder image/gallery/module settings.
6. Keep media filenames stable and descriptive.

Do not insert remote hotlinked media into Builder layouts unless the site owner explicitly wants that dependency.

## Form Creation Workflows

Preferred Themify-first approach:

- Use Themify Contact addon when available because forms remain Builder-editable and styled through Builder controls.
- Model forms in the site spec as fields, recipient strategy, success message, spam controls, and submission storage requirement.
- Generate a Contact module only after validating the active addon module schema from the target install.

Fallback approach:

- Use a WordPress form plugin only when Themify Contact is unavailable or the site needs advanced integrations.
- Embed plugin forms through shortcode in a Themify Text or HTML/Text module so page layout remains Builder-editable.

Source: https://themify.me/docs/contact-documentation

## Menu And Navigation Management

Use WordPress menus, not hard-coded navigation markup:

1. Create pages.
2. Create a named menu.
3. Add page menu items with `wp_update_nav_menu_item()`.
4. Assign the menu to Ultra's registered menu location after inspecting the active theme's `get_registered_nav_menus()` output.
5. Use Themify's Menu module only when a page section needs an embedded menu.

Source: https://developer.wordpress.org/reference/functions/wp_update_nav_menu_item/

## SEO Plugin Integration

SEO should be plugin-backed, not custom-rendered in the theme:

- Use Yoast SEO, Rank Math, or another selected SEO plugin as an integration target.
- Model SEO title, meta description, canonical preference, open graph image, and indexing rules in the site spec.
- Write plugin metadata through plugin-supported APIs, documented post meta, or an adapter that can be swapped per plugin.
- Validate rendered metadata with the plugin's output or REST response.

Yoast exposes SEO metadata through REST for retrieval. Creating or updating SEO fields should be handled by a plugin-specific adapter because write behavior is not standardized across SEO plugins.

Sources:

- https://developer.yoast.com/customization/apis/rest-api/
- https://wordpress.org/plugins/wordpress-seo/
