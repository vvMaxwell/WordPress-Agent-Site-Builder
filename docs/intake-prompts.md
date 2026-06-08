# Intake Prompts

Use this before touching a new WordPress/Themify site. The answers become the site spec and guide the demo choice.

## Required Questions

Ask these first:

1. What is the site or business name?
2. What is the goal of the site?
3. What pages should be in the main menu?
4. What extra detail pages should be created, such as services, team members, case studies, FAQs, or contact pages?
5. What main color should be used?
6. What accent and hover colors should be used?
7. What tone should the copy have?
8. Should Codex pick the closest Themify Ultra demo/skin, or is there a specific demo to import?
9. Should the header and footer be editable Builder Pro templates?
10. Are there any hard constraints, such as no custom CSS, no custom HTML, required plugins, required images, or required legal copy?

## Compact Prompt

Use this when the user wants speed:

```text
Before I build, I need the site brief:
- Site name and goal
- Pages/menu items
- Any services/team/detail pages to link
- Main color, accent color, and hover color
- Copy tone
- Themify Ultra demo preference, or permission for me to pick
- Header/footer preference: default Ultra or Builder Pro templates
- Any constraints like no custom CSS/HTML
```

## How To Read The Answers

- Map the site name and goal into `site.name`, `site.tagline`, and page hero copy.
- Map pages/menu items into WordPress pages and menu locations.
- Map detail pages into linked cards/buttons from the parent page.
- Map colors into Themify Builder row/module/theme controls, not custom CSS.
- Map copy tone into demo-content rewrites.
- Map demo preference into the imported Ultra demo/skin. If no demo is specified, choose the closest industry demo.
- If Builder Pro templates are requested, create header and footer templates and disable default Ultra header/footer pieces that would duplicate them.
- Treat "no custom CSS/HTML" as a hard rule. Use Themify settings only.

## Defaults When The User Says "Pick"

- Demo: closest Themify Ultra demo by industry and layout density.
- Header/footer: Builder Pro templates if site-wide editability matters; otherwise default Ultra header/footer.
- Page layout: no sidebar, hidden page title, Builder-first content.
- Spacing: row top/bottom padding through Builder row styling.
- Links: parent cards link to detail pages; team cards link to Team; service cards link to service detail pages.
- Hover colors: darker or lighter version of accent, set through Themify controls.
