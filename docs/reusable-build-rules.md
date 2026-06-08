# Reusable Build Rules

These are the standing rules for future Codex-assisted Themify Ultra builds.

## Demo First

- Import a Themify Ultra demo/skin before building pages.
- Keep the demo's structure, spacing rhythm, modules, and visual language unless the user asks to change them.
- Replace demo text/images/services/team items with the user's site concept.
- Do not build a completely custom design when the point is testing or using Themify Ultra demos.

## Themify Only

- Use Themify Builder rows, columns, modules, Builder Pro templates, theme options, menu settings, and native page options.
- Do not add custom CSS snippets.
- Do not add custom HTML modules or theme-file HTML.
- Avoid raw database writes. Save Builder data through Themify APIs or authenticated Themify AJAX.

## Header

- If using Builder Pro header templates, create a blank Builder Pro theme and assign the header template to the entire site.
- Disable default Ultra header pieces that would duplicate the template:
  - site logo
  - tagline
  - header widgets
  - social widget
  - menu navigation
- If sticky behavior is requested, use Ultra/Builder Pro sticky support where available and validate the front end after scrolling.
- Menu hover should be controlled in the menu module settings. If the user says remove the hover effect, match hover color/background to the normal state.

## Footer

- If using Builder Pro footer templates, assign the footer template to the entire site.
- Use native Builder modules for footer menus, text, buttons, icons, and contact details.
- Disable default Ultra footer pieces only when they duplicate the Builder Pro footer.

## Page Layout

- For Builder-first pages, set Themify page options:
  - `page_layout = sidebar-none`
  - `post_sticky_sidebar = 0`
  - `hide_page_title = yes`
- Use full-width Builder rows when the demo uses them.
- Add row top and bottom spacing through Builder row padding, not CSS.
- After creating service/detail pages, verify no right sidebar appears on the front end.

## Navigation And Linking

- Build a real WordPress menu and place it in the header template or Ultra menu location.
- Link service cards to service detail pages.
- Link team cards or person panels to the Team page or matching team-member pages.
- Link header/footer menus to the actual page URLs.
- Validate links with browser automation.

## Colors

- Keep backgrounds clean and demo-appropriate unless the user requests a dark theme.
- Apply the main color to headings, body text, links, and module accents through Themify controls.
- Apply hover colors through Themify link/button/menu hover controls.
- Avoid changing every row background to the main color; use the demo's clean white/neutral sections if that is the requested look.

## Validation

Before finishing:

- Load homepage, services, about, team, contact, and all detail pages.
- Check the header and footer render once.
- Check sticky header behavior if enabled.
- Check menu hover state if recently changed.
- Check no unwanted sidebar is visible.
- Check linked cards go to their detail pages.
- Regenerate Themify CSS/cache when available.
