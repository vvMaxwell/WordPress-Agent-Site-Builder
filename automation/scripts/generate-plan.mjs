#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Usage: npm run generate -- <site-spec.json>');
  process.exit(1);
}

const root = process.cwd();
const outputDir = path.join(root, 'build', 'site-plan');
const spec = JSON.parse(await readFile(path.resolve(root, inputPath), 'utf8'));

validateSpec(spec);

await mkdir(path.join(outputDir, 'builder'), { recursive: true });

const buildPlan = createBuildPlan(spec);
const builderOutputs = new Map();

for (const page of spec.pages) {
  const builderData = compilePageToThemifyBuilder(page, spec);
  builderOutputs.set(page.slug, builderData);
  await writeFile(
    path.join(outputDir, 'builder', `${page.slug}.builder.json`),
    `${JSON.stringify(builderData, null, 2)}\n`
  );
}

await writeFile(path.join(outputDir, 'build-plan.json'), `${JSON.stringify(buildPlan, null, 2)}\n`);
await writeFile(path.join(outputDir, 'handoff.md'), createHandoff(spec, buildPlan), 'utf8');

console.log(`Generated ${spec.pages.length} page plan(s) in ${path.relative(root, outputDir)}`);

function validateSpec(candidate) {
  const errors = [];
  if (!candidate || typeof candidate !== 'object') errors.push('spec must be an object');
  if (!candidate?.site?.name) errors.push('site.name is required');
  if (!Array.isArray(candidate?.pages) || candidate.pages.length === 0) errors.push('pages must be a non-empty array');

  const slugs = new Set();
  for (const page of candidate.pages ?? []) {
    if (!page.slug) errors.push('each page requires slug');
    if (!page.title) errors.push(`page "${page.slug ?? '<missing>'}" requires title`);
    if (!Array.isArray(page.sections)) errors.push(`page "${page.slug ?? '<missing>'}" requires sections`);
    if (slugs.has(page.slug)) errors.push(`duplicate page slug "${page.slug}"`);
    slugs.add(page.slug);
  }

  if (errors.length) {
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
}

function createBuildPlan(siteSpec) {
  return {
    generatedAt: new Date().toISOString(),
    site: siteSpec.site,
    assumptions: [
      'No WordPress installation is connected in this repository.',
      'Builder JSON is prototype output and must be saved through Themify APIs on a live site.',
      'Module schemas must be verified against the active Themify version before production execution.'
    ],
    tasks: [
      {
        id: 'inspect-wordpress',
        type: 'environment',
        summary: 'Verify WordPress, active theme, Themify Builder, permissions, and plugin availability.'
      },
      ...siteSpec.pages.map((page) => ({
        id: `page:${page.slug}`,
        type: 'page',
        slug: page.slug,
        title: page.title,
        templateIntent: page.templateIntent ?? 'builder_full_width',
        builderArtifact: `builder/${page.slug}.builder.json`,
        seo: page.seo ?? null
      })),
      {
        id: 'navigation:primary',
        type: 'navigation',
        location: 'primary',
        items: siteSpec.navigation?.primary ?? siteSpec.pages.map((page) => page.slug)
      },
      {
        id: 'navigation:footer',
        type: 'navigation',
        location: 'footer',
        items: siteSpec.navigation?.footer ?? []
      },
      {
        id: 'homepage',
        type: 'setting',
        option: 'show_on_front',
        pageSlug: siteSpec.navigation?.primary?.[0] ?? siteSpec.pages[0].slug
      },
      {
        id: 'validate-builder',
        type: 'validation',
        summary: 'Open generated pages as an authenticated editor and confirm Themify Builder can edit them.'
      }
    ]
  };
}

function compilePageToThemifyBuilder(page, siteSpec) {
  return page.sections.map((section, index) => compileSection(section, siteSpec, page, index));
}

function compileSection(section, siteSpec, page, index) {
  const base = {
    element_id: elementId('row', page.slug, index),
    styling: rowStyling(section, siteSpec),
    cols: [
      {
        element_id: elementId('col', page.slug, index),
        grid_class: 'col-full',
        styling: {},
        modules: modulesForSection(section, page, index)
      }
    ]
  };

  if (section.type === 'services' || section.type === 'testimonials') {
    base.cols = columnsForCards(section, page, index);
  }

  return base;
}

function rowStyling(section, siteSpec) {
  const neutral = siteSpec.style?.neutralColor ?? '#f7f7f7';
  const accent = siteSpec.style?.accentColor ?? '#1d6f68';

  if (section.type === 'hero') {
    return {
      row_width: 'fullwidth',
      background_color: neutral,
      padding_top: '8%',
      padding_bottom: '8%'
    };
  }

  if (section.type === 'cta') {
    return {
      row_width: 'fullwidth',
      background_color: accent,
      font_color: '#ffffff',
      padding_top: '5%',
      padding_bottom: '5%'
    };
  }

  return {
    row_width: 'fullwidth',
    padding_top: '5%',
    padding_bottom: '5%'
  };
}

function modulesForSection(section, page, index) {
  switch (section.type) {
    case 'hero':
      return compact([
        fancyHeading(section.heading),
        textModule(section.body),
        section.primaryAction ? buttonModule(section.primaryAction) : null,
        section.media ? imagePlaceholderModule(section.media) : null
      ]);
    case 'cta':
      return compact([
        fancyHeading(section.heading),
        textModule(section.body),
        section.primaryAction ? buttonModule(section.primaryAction) : null
      ]);
    case 'faq':
      return compact([
        fancyHeading(section.heading),
        accordionModule(section.items ?? [])
      ]);
    case 'form':
      return compact([
        fancyHeading(section.heading),
        formPlaceholderModule(section.form)
      ]);
    case 'text':
    default:
      return compact([
        section.media ? imagePlaceholderModule(section.media) : null,
        section.heading ? fancyHeading(section.heading) : null,
        section.body ? textModule(section.body) : null
      ]);
  }
}

function columnsForCards(section, page, rowIndex) {
  const items = section.items ?? [];
  const gridClass = items.length >= 3 ? 'col3-1' : 'col2-1';

  return items.map((item, itemIndex) => ({
    element_id: elementId('col', page.slug, rowIndex, itemIndex),
    grid_class: gridClass,
    styling: {},
    modules: compact([
      item.media ? imagePlaceholderModule(item.media) : null,
      fancyHeading(item.title),
      textModule(item.body)
    ])
  }));
}

function fancyHeading(text) {
  return {
    element_id: elementId('mod', 'fancy', text),
    mod_name: 'fancy-heading',
    mod_settings: {
      heading: escapeHtml(text ?? ''),
      sub_heading: '',
      heading_tag: 'h2'
    }
  };
}

function textModule(text) {
  return {
    element_id: elementId('mod', 'text', text),
    mod_name: 'text',
    mod_settings: {
      content_text: `<p>${escapeHtml(text ?? '')}</p>`
    }
  };
}

function buttonModule(action) {
  return {
    element_id: elementId('mod', 'button', action.label),
    mod_name: 'buttons',
    mod_settings: {
      buttons: [
        {
          label: action.label,
          link: action.href,
          type: 'large'
        }
      ]
    }
  };
}

function imagePlaceholderModule(media) {
  return {
    element_id: elementId('mod', 'image', media.alt ?? media.intent),
    mod_name: 'image',
    mod_settings: {
      image_url: '',
      image_id: media.attachmentId ?? '',
      alt: media.alt ?? '',
      caption: '',
      _automation_media_intent: media.intent ?? ''
    }
  };
}

function accordionModule(items) {
  return {
    element_id: elementId('mod', 'accordion', items.length),
    mod_name: 'accordion',
    mod_settings: {
      content_accordion: items.map((item) => ({
        title: item.title ?? '',
        text: `<p>${escapeHtml(item.body ?? '')}</p>`
      }))
    }
  };
}

function formPlaceholderModule(form) {
  return {
    element_id: elementId('mod', 'form', form?.name ?? 'form'),
    mod_name: 'text',
    mod_settings: {
      content_text: `<p><strong>${escapeHtml(form?.name ?? 'Form')}</strong></p><p>Form placeholder. Prefer Themify Contact addon when connected to WordPress; otherwise embed a plugin shortcode here.</p>`,
      _automation_form: form ?? null
    }
  };
}

function createHandoff(siteSpec, buildPlan) {
  const pageRows = siteSpec.pages
    .map((page) => `- ${page.title}: \`${page.slug}\`, Builder artifact \`builder/${page.slug}.builder.json\``)
    .join('\n');

  return `# Site Build Handoff

Site: ${siteSpec.site.name}

Generated: ${buildPlan.generatedAt}

## Pages

${pageRows}

## Next Live Steps

1. Connect to a WordPress install with Ultra active.
2. Verify Themify Builder APIs are available.
3. Upload or generate media and replace placeholder image module values.
4. Save Builder data through Themify APIs, not direct database writes.
5. Create WordPress menus and assign Ultra menu locations.
6. Apply SEO metadata through the selected SEO plugin adapter.
7. Validate frontend rendering and Builder editability with Playwright.
`;
}

function compact(values) {
  return values.filter(Boolean);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function elementId(...parts) {
  const raw = parts.join('-').toLowerCase();
  let hash = 0;
  for (let index = 0; index < raw.length; index += 1) {
    hash = (hash * 31 + raw.charCodeAt(index)) >>> 0;
  }
  return `tb_${hash.toString(16)}`;
}
