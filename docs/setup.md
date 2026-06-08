# Setup

## Offline Prototype Setup

Install dependencies:

```bash
npm install
```

Generate artifacts from the example:

```bash
npm run generate -- automation/examples/site-spec.example.json
```

Generated files appear in:

```text
build/site-plan/
```

## Creating A New Site Spec

Copy the example spec:

```bash
cp automation/examples/site-spec.example.json build/my-site-spec.json
```

Edit the copied JSON, then run:

```bash
npm run generate -- build/my-site-spec.json
```

## Future WordPress Setup

When a real WordPress install is available:

1. Install WordPress with WP-CLI.
2. Install and activate Ultra or an Ultra child theme.
3. Install Themify Updater.
4. Configure Themify license in WP Admin.
5. Verify Builder is active.
6. Run a proof Builder page.
7. Run the site executor.
8. Run Playwright validation.

Example future command:

```bash
wp eval-file automation/php/apply-site-spec.php -- automation/examples/site-spec.example.json
```

The PHP executor must be run from the WordPress root or with WP-CLI configured for the target path.
