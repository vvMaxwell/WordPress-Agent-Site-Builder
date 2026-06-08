# Live Site Lessons

This file captures fixes learned during a real Themify Ultra build so future builds start with the right defaults.

## What Worked

- Importing an Ultra demo first gave better structure than starting from scratch.
- The Clinic-style demo was a good base for a clean, white, lab-like site because it already had healthcare spacing, staff cards, service sections, and neutral rows.
- Rewriting demo content inside existing modules kept the site editable and visually coherent.
- Builder Pro templates gave better control over header and footer than trying to fight the default Ultra header.

## Fixes To Reuse

- When a Builder Pro header template is active, disable the default Ultra header pieces; otherwise the default header and template header can conflict.
- Builder Pro display conditions must use the correct include condition for the entire site. A bad condition can make the template silently not render.
- If menu hover colors still show the demo color, edit the menu module hover settings inside the header template.
- If the user wants no menu hover effect, set hover colors/backgrounds to match the normal menu state.
- Sticky header behavior should be validated on the front end after scrolling, because the selector may be the Builder Pro header rather than the original Ultra header.
- Service pages created after demo import can inherit a right sidebar. Set page layout to no sidebar and disable sticky sidebar.
- About-page team/person cards should link to the Team page when the user asks for linked panels.
- Use row padding controls for top/bottom spacing instead of CSS.

## Default Build Path For Future Sites

1. Ask the intake prompts.
2. Log in to WordPress.
3. Confirm Ultra and Builder/Builder Pro are available.
4. Import the closest Ultra demo/skin.
5. Create or update a blank Builder Pro theme when header/footer templates are needed.
6. Create header template from the imported demo style.
7. Disable duplicate default Ultra header pieces.
8. Create footer template from the imported demo style.
9. Adapt demo pages and create requested new pages.
10. Set Builder-first pages to no sidebar and hidden title.
11. Add menus and link cards/buttons to real pages.
12. Apply colors through Themify controls.
13. Regenerate Themify CSS/cache.
14. Validate desktop/mobile front end.

## Do Not Repeat

- Do not hand-build a custom-looking site when the user asked to use a Themify Ultra demo.
- Do not use custom CSS or HTML to solve ordinary styling issues.
- Do not leave default demo hover colors if the user asked for a custom palette.
- Do not leave right sidebars on Builder-first service/detail pages.
- Do not leave cards unlinked when detail pages exist.
