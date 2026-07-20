# Finance Knowledge Hub

A recruiter-focused personal knowledge hub for a Finance & Business Analytics graduate. Where a resume shows accomplishments and GitHub shows implementation, this site shows **thinking**: financial models with documented assumptions, research on energy and capital markets, and short market insights — every piece with a problem statement, methodology, results, and lessons learned.

Built with **plain HTML5, CSS3, and vanilla JavaScript (ES modules)**. No frameworks, no build step, no dependencies. Open it with a local server or deploy straight to GitHub Pages.

---

## Architecture

The project is split into three independent layers. Each can be changed without touching the other two.

| Layer | Location | Responsibility |
|---|---|---|
| **Design** | `css/` | Appearance only. All colors, type, spacing, and components as CSS. Every value derives from tokens in `variables.css` — no magic numbers. |
| **Engine** | `js/` | Rendering and logic only. Loads JSON, builds DOM, wires up navigation and filters. Contains **zero personal information and zero styling**. |
| **Content** | `data/` | Data only. Everything you read on the site — your name, models, research, labels, even button text — lives in JSON files. |

**To personalize the entire site you only edit `data/*.json` and drop in your own `assets/resume/resume.pdf`. You never need to touch HTML, CSS, or JS.**

## Folder structure

```
finance-knowledge-hub/
├── index.html               Homepage
├── README.md
│
├── css/
│   ├── variables.css        Design tokens (colors, type scale, spacing, radius, shadows)
│   ├── reset.css            Browser normalization
│   ├── base.css             Element defaults & typography
│   ├── layout.css           Header, hero, sections, grids, footer, breakpoints
│   └── components.css       Buttons, cards, tags, timeline, metrics, callouts…
│
├── js/
│   ├── config.js            Structural config (datasets, page map, limits)
│   ├── app.js               Entry point on every page; routes to controllers
│   ├── home.js              Homepage controller
│   ├── engine/
│   │   ├── jsonLoader.js    Cached fetch of /data/*.json
│   │   ├── chrome.js        Header, navigation, footer
│   │   ├── cards.js         Card component
│   │   ├── listPage.js      List pages (models/research/insights) + tag filter
│   │   └── utils.js         DOM helpers, dates, meta tags, shared blocks
│   └── detail/
│       ├── model.js         Model detail page
│       ├── research.js      Research detail page
│       └── insight.js       Insight detail page
│
├── data/
│   ├── profile.json         Who you are: name, bio, education, timeline, skills
│   ├── navigation.json      Menu items
│   ├── site.json            All site copy: hero, section headings, labels
│   ├── models.json          Financial models
│   ├── research.json        Research pieces
│   └── insights.json        Market insights
│
├── pages/                   All interior pages
├── images/                  favicon.svg (add screenshots/og images here)
└── assets/resume/resume.pdf Your resume
```

### How a page renders

Every HTML page is a skeleton with empty containers plus one script tag:

```html
<body data-page="models" data-root="../">
  ...
  <script type="module" src="../js/app.js"></script>
```

`app.js` reads `data-page`, renders the shared header/footer from JSON, then dynamically imports the matching controller, which fetches its dataset and builds the DOM. `data-root` tells the engine how to reach the site root from that page, so everything works from any host path (including GitHub Pages sub-paths).

---

## Updating the JSON

### `data/profile.json` — you
Name, initials, tagline, email, links, resume file name, bio paragraphs, education entries, timeline entries, skills groups, interests, career goals. This is the first file to edit.

### `data/models.json`, `data/research.json`, `data/insights.json` — your work
Each file is an **array of items**. The sample entries show the exact shape. Common fields:

```jsonc
{
  "id": "my-model",              // unique, used in the URL (?id=my-model)
  "title": "…",
  "summary": "1–2 sentences shown on the card",
  "date": "2026-05-18",          // YYYY-MM-DD, drives "latest" sorting
  "featured": true,              // featured badge + homepage priority
  "tags": ["Project Finance"],   // also power the list-page filter
  "github": "https://github.com/you/repo",
  "sections": {
    "overview": "paragraph",
    "problem": "paragraph",
    "approach": "paragraph",
    "methodology": ["step", "step"],          // numbered steps
    "results": { "summary": "…", "points": ["…"] },
    "lessons": ["…"]
  }
}
```

Type-specific extras:

- **Models**: `"tools": ["Excel"]` and `"metrics": [{ "label": "…", "value": "…" }]` (the stat boxes).
- **Research**: `"sources": [{ "title": "…", "publisher": "…", "url": "…" }]` (`url` optional).
- **Insights**: `"takeaway": "one sentence"` (highlighted callout at the end).

Optional on any item: `"image": "images/pic.png"` and `"imageAlt": "…"` for a card image.

To add an item: copy an existing object, change the `id`, fill in your content. Cards, detail pages, filters, homepage sections, and hero stat counts all update automatically.

### `data/site.json` — copy & labels
Hero text and buttons, homepage section headings, page intros, about-page section titles, every UI label (buttons, badges, "back" links, error messages), and footer text.

### `data/navigation.json` — the menu
Menu items with `id`, `label`, and `path` (relative to the site root). Order here is the order in the header and footer.

### Resume
Replace `assets/resume/resume.pdf` with your own file (keep the name, or update `resume.file` in `profile.json`).

---

## Running locally

Browsers block `fetch()` on `file://`, so serve the folder instead of double-clicking `index.html`:

- **VS Code**: install *Live Server*, right-click `index.html` → "Open with Live Server", or
- **Python**: `python -m http.server` in the project folder → open `http://localhost:8000`.

## Deploying to GitHub Pages

1. Create a repository (e.g. `finance-knowledge-hub`) and push this folder's contents to the root of the `main` branch.
2. On GitHub: **Settings → Pages → Build and deployment**, set Source to *Deploy from a branch*, pick `main` / `/ (root)`, and save.
3. The site goes live at `https://<username>.github.io/finance-knowledge-hub/` within a minute or two.
4. Update `url` in `data/site.json` and the `og:url` metas in the HTML files to your live URL.

No build step — pushing new JSON is a content update.

## Customizing the design

All appearance decisions live in `css/variables.css`:

- **Colors**: change `--color-navy-*` / `--color-green-*` scales, or just re-point the semantic aliases (`--color-primary`, `--color-accent`).
- **Type**: the scale runs `--text-xs` → `--text-5xl`; the font is Inter via Google Fonts (swap the `<link>` in the HTML heads and `--font-sans` to change it).
- **Spacing / radius / shadows**: `--space-*`, `--radius-*`, `--shadow-*`.

Component looks live in `components.css`, structural layout and breakpoints (640 / 768 / 1024 px) in `layout.css`.

## Accessibility & SEO

Semantic landmarks, one `h1` per page, skip link, keyboard-operable menu and filters (with `aria-expanded` / `aria-pressed`), visible focus styles, WCAG-conscious contrast, `prefers-reduced-motion` support. Every page has a unique title, meta description, and OpenGraph/Twitter tags; detail pages update them per item.

## License

Personal project — fork it, gut the JSON, and make it yours.
