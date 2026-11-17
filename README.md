# METEOPATH V5 — Atlas Edition

A responsive, interactive information portal for exploring the eight specialization packages in the **2024 Meteorology Curriculum of Institut Teknologi Bandung**. This is an independent student project, not an ITB official website.

## How to run in VS Code

1. Extract the ZIP completely.
2. Open the entire `meteopath-v5-atlas` folder using VS Code > File > Open Folder.
3. Install or enable the **Live Server** extension.
4. Open `index.html` and click **Go Live**.
5. The website runs locally without a backend, database, npm, or build tool. To publish, upload all project files including `assets/` to GitHub Pages.

## Files

- `index.html`: page structure and SEO content.
- `style.css`: design system, mobile layout, scroll reveal styling, hover transitions, reduced-motion support, and improved typography.
- `script.js`: filters, search, detail tabs, reading progress, alumni/organization directories, keyboard-accessible buttons, LinkedIn links.
- `data.js`: user-supplied specialist profiles, 33 alumni entries, 50 company/organization entries (unchanged core source data).
- `curriculum.js`: **all 75 listed course entries across the eight ITB packages**, including course code, name, credits, and compulsory-choice status.
- `assets/*.webp`: eight local illustrative images of meteorological work (AI-generated; **not photographs of real named companies/alumni**).
- `preview-desktop.png`, `preview-mobile.png`, `preview-specializations.png`, `preview-course-panel.png`: visual previews, not required by the site.

## Academic sources and content accuracy

The full list of specialization-package courses was extracted from the ITB Meteorology study program's official **Skema Pembelajaran dalam Program** page, checked 17 November 2026:

https://meteo.itb.ac.id/?lang=id&page_id=2621

The general curriculum overview is here:

https://meteo.itb.ac.id/?lang=id&page_id=2613

Specialization package: **12 SKS** in Curriculum 2024. The 5–16 courses listed under any package are **the menu of available courses**, *not* a requirement to take every one. The first two listed in each package carry the official **pilihan wajib** label. Consult an academic adviser for personalized course planning.

The following information is **guidance, not official course criteria**: industry prospects, role illustrations, competencies, portfolio projects, skill roadmaps, and fit descriptions. It is based on the research provided by the student.

## Alumni data disclaimer

The 33 records come from the attached alumni dataset. Alumni are grouped by the relevance of their professional experience to each current specialization; **they are not verified as having completed a package in the 2024 curriculum**. Some records may represent graduates of different education levels, and not all qualifications have been independently verified. LinkedIn links come only from the supplied data.

## Company/organization disclaimer

50 entries come from the attached company-target dataset. They represent **relevant organizations or documented examples of job requirements**, not a promise of current vacancies or blanket acceptance of BSc Meteorology majors. Some entries reflect the organization's activities rather than a confirmed vacancy. Each entry includes the type of evidence, education/major verification status, and direct website/evidence links from the provided CSV. Users should re-check real openings and requirements before applying.

## Privacy and image rights

The eight editorial illustrations were generated using AI to avoid implying that photographs of specific named alumni/employees/facilities have been obtained. No real alumni photographs or company logos are included. Do not describe illustrations as records of real people or institutions.

## Interaction and accessibility

- IntersectionObserver-driven scroll reveal (disabled for `prefers-reduced-motion`).
- Sticky progress bar, image hover/zoom, content-panel fade transitions, subtle scroll motion.
- Category/search filters, accessible buttons and tab states, readable light and dark areas, a mobile navigation menu.
- Alumni links open LinkedIn in a new tab. Company links open referenced official/evidence sites in a new tab.
- External Google Fonts: **Plus Jakarta Sans** for headings, **DM Sans** for paragraphs. The website falls back to system sans-serif if offline.

## Future work

Validate alumni data with consent, revise outdated company entries, add links to course module handbooks, and implement a comparison feature for any two specialization packages.
