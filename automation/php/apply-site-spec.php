<?php
/**
 * Future WordPress executor for Themify site specs.
 *
 * Usage from a WordPress root:
 * wp eval-file automation/php/apply-site-spec.php -- /absolute/path/to/site-spec.json
 */

if (!defined('ABSPATH')) {
    fwrite(STDERR, "This script must run inside WordPress through WP-CLI.\n");
    exit(1);
}

if (!defined('WP_CLI')) {
    fwrite(STDERR, "Run this script with WP-CLI: wp eval-file automation/php/apply-site-spec.php -- site-spec.json\n");
    exit(1);
}

$spec_path = $args[0] ?? null;

if (!$spec_path || !file_exists($spec_path)) {
    WP_CLI::error('Provide a readable site spec path.');
}

$spec = json_decode(file_get_contents($spec_path), true);

if (!is_array($spec)) {
    WP_CLI::error('Site spec must be valid JSON.');
}

Themify_Site_Automation_Executor::run($spec);

final class Themify_Site_Automation_Executor
{
    public static function run(array $spec): void
    {
        self::assert_environment();

        $page_ids = [];

        foreach ($spec['pages'] ?? [] as $page) {
            $page_id = self::upsert_page($page);
            $page_ids[$page['slug']] = $page_id;
            self::save_builder_layout($page_id, $page);
            self::apply_page_meta($page_id, $page);
            self::apply_seo_placeholder($page_id, $page);
            WP_CLI::log(sprintf('Prepared page %s (%d)', $page['slug'], $page_id));
        }

        self::configure_homepage($spec, $page_ids);
        self::configure_navigation($spec, $page_ids);

        WP_CLI::success('Site spec applied. Run browser validation before handoff.');
    }

    private static function assert_environment(): void
    {
        if (!class_exists('ThemifyBuilder_Data_Manager')) {
            WP_CLI::error('ThemifyBuilder_Data_Manager is unavailable. Activate Themify Ultra/Builder first.');
        }

        $template = wp_get_theme()->get_template();
        $stylesheet = wp_get_theme()->get_stylesheet();

        if ($template !== 'themify-ultra' && $stylesheet !== 'themify-ultra') {
            WP_CLI::warning(sprintf(
                'Active theme is template=%s stylesheet=%s. Expected Ultra or an Ultra child theme.',
                $template,
                $stylesheet
            ));
        }
    }

    private static function upsert_page(array $page): int
    {
        $existing = get_page_by_path($page['slug'], OBJECT, 'page');
        $postarr = [
            'post_type' => 'page',
            'post_status' => 'publish',
            'post_title' => $page['title'],
            'post_name' => $page['slug'],
            'post_content' => self::static_content($page),
        ];

        if ($existing) {
            $postarr['ID'] = $existing->ID;
            $result = wp_update_post($postarr, true);
        } else {
            $result = wp_insert_post($postarr, true);
        }

        if (is_wp_error($result)) {
            WP_CLI::error($result->get_error_message());
        }

        return (int) $result;
    }

    private static function save_builder_layout(int $page_id, array $page): void
    {
        $builder_data = self::compile_minimal_builder_data($page);
        $result = ThemifyBuilder_Data_Manager::save_data($builder_data, $page_id, 'frontend', null);

        if (empty($result['mid'])) {
            WP_CLI::error(sprintf('Themify Builder save failed for page ID %d.', $page_id));
        }
    }

    private static function apply_page_meta(int $page_id, array $page): void
    {
        if (($page['templateIntent'] ?? 'builder_full_width') !== 'standard') {
            update_post_meta($page_id, 'page_layout', 'full_width');
            update_post_meta($page_id, 'hide_page_title', 'yes');
        }
    }

    private static function apply_seo_placeholder(int $page_id, array $page): void
    {
        if (empty($page['seo'])) {
            return;
        }

        update_post_meta($page_id, '_automation_seo_title', $page['seo']['title'] ?? '');
        update_post_meta($page_id, '_automation_seo_description', $page['seo']['description'] ?? '');
    }

    private static function configure_homepage(array $spec, array $page_ids): void
    {
        $front_slug = $spec['navigation']['primary'][0] ?? array_key_first($page_ids);

        if ($front_slug && isset($page_ids[$front_slug])) {
            update_option('show_on_front', 'page');
            update_option('page_on_front', $page_ids[$front_slug]);
        }
    }

    private static function configure_navigation(array $spec, array $page_ids): void
    {
        foreach (($spec['navigation'] ?? []) as $location_hint => $slugs) {
            $menu_name = ucwords(str_replace(['-', '_'], ' ', $location_hint)) . ' Menu';
            $menu = wp_get_nav_menu_object($menu_name);
            $menu_id = $menu ? (int) $menu->term_id : wp_create_nav_menu($menu_name);

            if (is_wp_error($menu_id)) {
                WP_CLI::warning($menu_id->get_error_message());
                continue;
            }

            foreach ($slugs as $slug) {
                if (!isset($page_ids[$slug])) {
                    continue;
                }

                wp_update_nav_menu_item($menu_id, 0, [
                    'menu-item-title' => get_the_title($page_ids[$slug]),
                    'menu-item-object-id' => $page_ids[$slug],
                    'menu-item-object' => 'page',
                    'menu-item-status' => 'publish',
                    'menu-item-type' => 'post_type',
                ]);
            }

            self::assign_menu_location($location_hint, $menu_id);
        }
    }

    private static function assign_menu_location(string $location_hint, int $menu_id): void
    {
        $registered = get_registered_nav_menus();
        $locations = get_theme_mod('nav_menu_locations', []);
        $target = null;

        foreach (array_keys($registered) as $location) {
            if (stripos($location, $location_hint) !== false) {
                $target = $location;
                break;
            }
        }

        if ($target) {
            $locations[$target] = $menu_id;
            set_theme_mod('nav_menu_locations', $locations);
        } else {
            WP_CLI::warning(sprintf('No registered menu location matched "%s". Assign the menu manually.', $location_hint));
        }
    }

    private static function compile_minimal_builder_data(array $page): array
    {
        $rows = [];

        foreach (($page['sections'] ?? []) as $index => $section) {
            $rows[] = [
                'element_id' => 'row_' . sanitize_key($page['slug'] . '_' . $index),
                'styling' => [
                    'row_width' => 'fullwidth',
                    'padding_top' => '5%',
                    'padding_bottom' => '5%',
                ],
                'cols' => [
                    [
                        'element_id' => 'col_' . sanitize_key($page['slug'] . '_' . $index),
                        'grid_class' => 'col-full',
                        'styling' => [],
                        'modules' => self::section_modules($section),
                    ],
                ],
            ];
        }

        return $rows;
    }

    private static function section_modules(array $section): array
    {
        $modules = [];

        if (!empty($section['heading'])) {
            $modules[] = [
                'mod_name' => 'fancy-heading',
                'mod_settings' => [
                    'heading' => sanitize_text_field($section['heading']),
                    'heading_tag' => 'h2',
                ],
            ];
        }

        if (!empty($section['body'])) {
            $modules[] = [
                'mod_name' => 'text',
                'mod_settings' => [
                    'content_text' => wp_kses_post(wpautop($section['body'])),
                ],
            ];
        }

        if (!empty($section['primaryAction'])) {
            $modules[] = [
                'mod_name' => 'buttons',
                'mod_settings' => [
                    'buttons' => [
                        [
                            'label' => sanitize_text_field($section['primaryAction']['label'] ?? 'Learn More'),
                            'link' => esc_url_raw($section['primaryAction']['href'] ?? '#'),
                        ],
                    ],
                ],
            ];
        }

        if (($section['type'] ?? '') === 'form') {
            $modules[] = [
                'mod_name' => 'text',
                'mod_settings' => [
                    'content_text' => '<p><strong>Form placeholder:</strong> configure Themify Contact addon schema before production form creation.</p>',
                ],
            ];
        }

        return $modules;
    }

    private static function static_content(array $page): string
    {
        $content = [];

        foreach (($page['sections'] ?? []) as $section) {
            if (!empty($section['heading'])) {
                $content[] = '<h2>' . esc_html($section['heading']) . '</h2>';
            }
            if (!empty($section['body'])) {
                $content[] = wp_kses_post(wpautop($section['body']));
            }
        }

        return implode("\n\n", $content);
    }
}
