# Dependencies

## Required Now

- Node.js 18 or newer.
- npm.

The offline prototype uses only Node built-ins.

## Optional Now

- Playwright for future browser validation:

```bash
npm install
npm run playwright:install
```

## Required For Live WordPress Automation Later

- PHP version supported by the target WordPress and Themify versions.
- Database server, typically MariaDB or MySQL.
- WordPress.
- WP-CLI.
- Themify Ultra theme zip.
- Themify Updater plugin.
- Valid Themify username, license key, and registered domain.
- Admin/editor credentials for validation.

## Recommended WordPress Plugins Later

Choose per project:

- Themify Contact addon for Builder-native forms.
- Yoast SEO or Rank Math for SEO metadata.
- SMTP plugin or host-level transactional email for reliable form delivery.
- Image optimization plugin if the host does not provide optimization.

## Secrets

Keep these out of Git:

- WordPress admin passwords.
- Database credentials.
- Themify license key.
- SEO/plugin license keys.
- SMTP credentials.
- API keys for image/content generation.

Use environment variables, a secrets manager, or local ignored files.
