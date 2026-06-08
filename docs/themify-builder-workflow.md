# Themify Builder Automation Workflow

Date: 2026-06-02

## Environment Status

This repository is a reusable automation/playbook workspace, not a checked-in WordPress root. Live sites are accessed through WordPress admin, WP-CLI, REST, Themify APIs, or browser automation using credentials supplied outside Git.

Do not commit live credentials, cookies, database dumps, uploads, or `.env` files.

## Official Themify Model

Themify Builder is the required editing surface. Official documentation states that Builder works with WordPress posts, pages, and custom post types, supports backend and frontend editing, and is included in Themify themes, so Ultra does not require the separate Builder plugin when the theme framework provides it.

The native authoring flow is:

1. Create a WordPress Page or Post.
2. Publish it.
3. Edit layout through the backend Builder panel or frontend "Turn On Builder" mode.
4. Save through Builder.

For a Builder homepage, Themify requires a static WordPress page; Builder does not operate on the default posts archive homepage.

Ultra-specific page setup is normally controlled through the Themify custom panel. For Builder-driven pages, use:

- `page_layout = sidebar-none`
- `post_sticky_sidebar = 0`
- `hide_page_title = yes`

Those same meta keys are set by Themify's native "Add Builder Page" flow when a Themify theme is active.

Use row width and content width controls inside Builder rows/modules for visual width. Do not rely on a visible right sidebar for Builder-first pages unless the user requests it.

## Storage

Themify Builder content is stored per post/page in `wp_postmeta`.

Primary meta keys:

- `_themify_builder_settings_json`: current Builder layout JSON.
- `_themify_builder_settings`: legacy serialized PHP format. Themify migrates this to JSON when read.
- `tbp_custom_css`: page-level Builder custom CSS, if present. Avoid relying on this except for small unavoidable page-specific adjustments.
- `themify_used_global_styles`: global style IDs used by the page.

Global/settings storage:

- Standalone Builder plugin settings use the `wp_options` key `themify_builder_setting`.
- Ultra/theme settings are managed through the Themify framework/customizer/theme options. Validate the active install before writing these directly.
- Style variables are managed through Themify's style variable framework and are imported by native Builder import/page creation code when present.

Builder layouts and reusable parts are WordPress custom post types:

- `tbuilder_layout`: saved Builder layouts.
- `tbuilder_layout_part`: reusable layout parts.

Layout parts can be inserted through the native Layout Part module or shortcode.

## Layout JSON Shape

Builder data is a JSON array of rows. The core nested shape is:

```json
[
  {
    "element_id": "row123",
    "styling": {},
    "cols": [
      {
        "element_id": "col123",
        "grid_class": "col-full",
        "styling": {},
        "modules": [
          {
            "element_id": "mod123",
            "mod_name": "text",
            "mod_settings": {
              "content_text": "<p>Editable text</p>"
            }
          }
        ]
      }
    ]
  }
]
```

Important rules:

- Rows use `styling`.
- Columns use `styling`, `grid_class`, optional responsive/grid fields, and `modules`.
- Modules use `mod_name` and `mod_settings`.
- Subrows are represented as module-like nested data with their own `cols`.
- Every row, column, and module should have a unique `element_id`.
- Let Themify generate/fix `element_id` values where possible by calling its save APIs.

## Native Save APIs

The safest programmatic path is to bootstrap WordPress with Themify loaded and call Themify's own PHP APIs:

```php
$post_id = wp_insert_post([
    'post_type' => 'page',
    'post_status' => 'publish',
    'post_title' => 'Example Page',
]);

ThemifyBuilder_Data_Manager::save_data($builder_data, $post_id, 'frontend', null);

if (function_exists('themify_is_themify_theme') && themify_is_themify_theme()) {
    update_post_meta($post_id, 'page_layout', 'full_width');
    update_post_meta($post_id, 'hide_page_title', 'yes');
}
```

Why this is preferred:

- It writes `_themify_builder_settings_json` in the current format.
- It migrates/removes legacy `_themify_builder_settings` when needed.
- It sanitizes Builder data using WordPress capabilities.
- It updates static text content in `post_content` for search/editor compatibility.
- It creates Builder revisions.
- It records used global styles.
- It clears Themify and related caches.
- It fires Themify/WordPress save hooks.

Do not write raw SQL to `wp_postmeta` except as a last-resort recovery operation. Raw SQL bypasses the hooks and cache/static-content work that keep Builder pages editable and renderable.

## Automation Options

Recommended order:

1. WordPress PHP with Themify APIs.
   Use `wp eval-file`, a temporary admin-only plugin, or a controlled maintenance script that runs inside WordPress. This is the safest repeatable method.

2. Themify's native AJAX endpoints.
   Useful when browser/admin context is already authenticated. Relevant actions include `tb_save_data` and `tb_builder_page_publish`. They enforce nonces and capabilities and call the same internal save methods.

3. Browser automation.
   Use Playwright only for validation and for operations that have no stable PHP API, such as confirming the frontend Builder opens and the page is visually editable. It is slower and more brittle than calling native APIs.

4. WordPress REST API.
   Good for creating pages, menus, media, and regular WordPress data. Not sufficient by itself unless paired with a registered custom endpoint or code path that calls `ThemifyBuilder_Data_Manager::save_data()`.

5. Direct database updates.
   Avoid. They are easy to make appear correct while leaving stale caches, missing static content, missing revisions, and broken Builder state.

## Repeatable Future Workflow

When a real WordPress installation is present:

1. Inspect installation:
   - `wp core version`
   - `wp theme status`
   - `wp plugin list`
   - `wp option get stylesheet`
   - `wp option get template`

2. Verify Themify:
   - Active theme should be `themify-ultra` or an Ultra child theme.
   - Confirm Builder is available through Ultra framework or active `themify-builder` plugin.
   - Check Themify update/license UI in admin if licensing metadata is not exposed via options.

3. Inspect storage:
   - Query `wp_postmeta` for `_themify_builder_settings_json`, `_themify_builder_settings`, `tbp_custom_css`, `themify_used_global_styles`, `page_layout`, and `hide_page_title`.
   - Query `wp_posts` for post types `tbuilder_layout` and `tbuilder_layout_part`.
   - Inspect `wp_options` for `themify_builder_setting` and Themify theme options.

4. Create proof page:
   - Insert a page with `wp_insert_post()`.
   - Save a small Builder JSON layout with `ThemifyBuilder_Data_Manager::save_data()`.
   - Set Ultra full-width/no-title meta.
   - Open the page with `#builder_active` while logged in.
   - Confirm the Builder toolbar loads and modules can be edited/saved.

5. Build sites:
   - Import a selected Themify Ultra demo/skin first.
   - Create pages with WordPress APIs.
   - Create menus with WordPress APIs and assign Ultra's Main Navigation/Footer Navigation locations.
   - Upload media through WordPress media APIs.
   - Generate Builder JSON using native rows, columns, and modules.
   - Save through `ThemifyBuilder_Data_Manager::save_data()`.
   - Create Builder Pro header/footer templates when requested.
   - Disable duplicate default Ultra header/footer pieces when a Builder Pro template replaces them.
   - Use Themify style variables/global styles for reusable visual systems.
   - Do not use custom CSS or custom HTML for normal styling.

## Proof Page Validation Script

Use this only inside a real WordPress root where Themify is active:

```php
<?php

$builder_data = [
    [
        'styling' => [
            'row_width' => 'fullwidth',
            'background_color' => '#f5f5f5',
        ],
        'cols' => [
            [
                'grid_class' => 'col-full',
                'styling' => [],
                'modules' => [
                    [
                        'mod_name' => 'text',
                        'mod_settings' => [
                            'mod_title_text' => 'Themify Native Proof',
                            'content_text' => '<p>This page was created programmatically and saved through Themify Builder APIs.</p>',
                        ],
                    ],
                    [
                        'mod_name' => 'buttons',
                        'mod_settings' => [
                            'buttons' => [
                                [
                                    'label' => 'Sample Button',
                                    'link' => '#',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];

$post_id = wp_insert_post([
    'post_type' => 'page',
    'post_status' => 'publish',
    'post_title' => 'Themify Builder Proof',
]);

if (is_wp_error($post_id)) {
    WP_CLI::error($post_id->get_error_message());
}

$result = ThemifyBuilder_Data_Manager::save_data($builder_data, $post_id, 'frontend', null);

if (empty($result['mid'])) {
    WP_CLI::error('Themify Builder save failed.');
}

if (function_exists('themify_is_themify_theme') && themify_is_themify_theme()) {
    update_post_meta($post_id, 'page_layout', 'full_width');
    update_post_meta($post_id, 'hide_page_title', 'yes');
}

WP_CLI::success(get_permalink($post_id) . '#builder_active');
```

Run:

```bash
wp eval-file themify-proof-page.php
```

Then validate:

- The page renders on the frontend.
- `_themify_builder_settings_json` exists for the page.
- The page opens with `#builder_active` for an authenticated editor/admin.
- The text and button modules are editable in Themify Builder.
- Saving from the Builder UI preserves the layout.

## Limitations

- This workspace lacks the WordPress install and database, so installation, licensing, and real editability remain unvalidated here.
- Themify module setting schemas are module-specific and primarily defined in Builder's PHP/JS module files. For robust generation, build a library of known-good row/module JSON snippets exported from Builder or saved layouts.
- Licensing is generally an admin/update-system concern. Do not infer license validity from theme/plugin files alone.
- Avoid custom themes, custom templates, alternate builders, and large CSS files. Use Ultra settings, WordPress menus/media, Themify layouts, Builder rows/modules, Builder styling controls, global styles, and style variables.

## Sources

- Themify Builder documentation: https://themify.me/docs/builder
- Extending Builder layouts and blocks: https://themify.me/docs/extending-builder-layouts-blocks
- Ultra documentation: https://themify.me/docs/ultra-documentation
- Coding Builder modules: https://themify.me/docs/coding-builder-modules
- Themify Builder plugin source downloaded from WordPress.org on 2026-06-02.
