# Your Website — A Guide for Wasim

Hi Wasim. This website is your professional knowledge hub — the place recruiters go to see *how you think*, not just what your resume says. This guide explains everything you need to know to keep it updated. **You do not need to know how to code.**

---

## The one rule

**You only ever edit files inside the `data` folder, plus one PDF file.**

Everything else — the `css`, `js`, and `pages` folders, and `index.html` — is the machinery that makes the site work. Never open or edit those. As long as you stay inside `data`, you cannot break the website.

Think of it like this: the website is a picture frame that's already built. The `data` folder is the photos you put in it.

---

## How to open and edit the files

1. Install **Visual Studio Code** (free) if you don't have it: https://code.visualstudio.com
2. Inside VS Code, install the **Live Server** extension (Extensions icon in the left bar → search "Live Server" → Install). One-time setup.
3. Open the whole `finance-knowledge-hub` folder in VS Code (File → Open Folder).
4. To **see the site**: right-click `index.html` → **"Open with Live Server"**. It opens in your browser and refreshes automatically when you save a file.
   - ⚠️ Don't double-click `index.html` from your desktop — the site will show a warning page instead. It must run through Live Server (or GitHub Pages once it's online).
5. To **edit content**: open any file in the `data` folder, change the text between the quotation marks, and save (Ctrl+S).

### The three golden rules of editing

The files use a format called JSON. It's just text with some punctuation rules:

1. **Only change text between "quotation marks".** Never delete the quotes themselves, the colons, the commas, or the curly braces `{ }` and square brackets `[ ]`.
2. **If your text contains a quotation mark**, type it as `\"` (backslash first). Example: `"He said \"yes\" to the offer."`
3. **When in doubt, copy an existing block** and change its text, rather than typing structure from scratch.

If the site ever looks broken after an edit, you probably deleted a comma or quote — press Ctrl+Z in VS Code to undo back to a working state.

---

## The files, in order of priority

### 1. `data/profile.json` — WHO YOU ARE ⭐ review first

Your name, contact info, bio, work experience, education, certifications, timeline, skills, and career goals. It was pre-filled from your resume, but it speaks in your voice — so read every line and make it sound like *you*.

**Things in this file that MUST be fixed (they are guesses):**
- `"github"` — put your real GitHub profile URL
- `"linkedin"` — put your real LinkedIn profile URL

### 2. `data/models.json` — YOUR PROJECTS ⭐ your main writing job

Your five projects are already listed by name (Portfolio Optimization, Stress Testing, 3-Statement Model, Forecasting, LBO). Everything *inside* each project is placeholder text that tells you what to write — for example: *"What question were you trying to answer?"*

For each project, replace:
- `"summary"` — 1–2 sentences shown on the project card
- `"date"` — when you finished it (format: `"2025-11-15"`)
- `"github"` — link to that project's repository
- `"metrics"` — 2–4 real numbers from the project (they display as stat boxes)
- everything inside `"sections"` — this is the heart of the site. Overview → Problem → Approach → Methodology (steps) → Results → Lessons learned.

**Writing tip:** be honest in "lessons". "My first version double-counted cash and I rebuilt it" reads far better to a recruiter than polished claims. That honesty is the whole point of this site.

### 3. `data/research.json` — YOUR RESEARCH

Your RAG / SEC-filings research is already set up with placeholder text — fill it in the same way as a project. Mention the NY UPSTAT presentation. Add real sources you used.

### 4. `assets/resume/resume.pdf` — YOUR RESUME

When you update your resume, export it as PDF, name it exactly `resume.pdf`, and replace this file. That's it — the website's Resume page updates automatically.

### 5. `data/insights.json` — SHORT MARKET NOTES (keeps the site alive)

Short observations — things you notice while building models or reading filings. Two dummy entries are in there showing the format.

**This is the most important file long-term.** A site whose newest entry is 8 months old tells recruiters you stopped learning. One short insight a month is enough to look active. Aim for that.

### 6. `data/site.json` — THE WEBSITE'S WORDING (rarely)

Every headline, button label, and page introduction. It's already written — only touch it if you want to rephrase something (e.g., the big headline on the homepage lives in `"hero" → "heading"`).

### 7. `data/navigation.json` — THE MENU (almost never)

Only if you ever want to rename a menu item like "Insights".

---

## How to ADD a new project, research piece, or insight

1. Open the matching file (`models.json`, `research.json`, or `insights.json`).
2. Select an existing entry — everything from one `{` to its matching `},` — and copy it.
3. Paste it right below, after the comma.
4. Change the `"id"` to something new and unique, lowercase with hyphens (e.g. `"dcf-tesla-2026"`). This becomes part of the page's web address.
5. Replace all the text with your content and save.

The homepage, the list pages, the tag filters, and the "models built" counter all update by themselves. No other file needs touching.

**Fields you should know:**
- `"featured": true` — puts a star badge on it and pushes it to the top of the homepage. Keep only your best 2–3 featured.
- `"date"` — controls ordering; newest appears first. Format is `"YYYY-MM-DD"`.
- `"tags"` — the topic pills on the cards; they also power the filter buttons on list pages.

---

## Putting the site online (one-time, ~10 minutes)

1. Create a free account at https://github.com — your username becomes part of the site address, so pick something professional (e.g. `wasimshekh`).
2. Create a new **public** repository named `finance-knowledge-hub`.
3. Upload everything inside this folder to it (GitHub's web page lets you drag-and-drop files).
4. In the repository: **Settings → Pages → Build and deployment** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
5. After a minute or two your site is live at:
   `https://YOUR-USERNAME.github.io/finance-knowledge-hub/`
6. Put that link at the top of your resume and in your LinkedIn profile.

**Updating the live site later:** edit the file in the `data` folder, then upload/replace it in GitHub (or ask Dev to help set up something easier). Changes appear on the live site within a couple of minutes.

---

## Quick checklist before you share the link with anyone

- [ ] `profile.json`: real GitHub and LinkedIn links
- [ ] Every project in `models.json`: placeholder text replaced with your own words
- [ ] `research.json`: RAG piece written up
- [ ] Your current resume PDF in `assets/resume/`
- [ ] At least one insight written by you (not the samples)
- [ ] Read the whole site once in the browser — every word on it is yours now

Good luck. The site is the frame — the thinking you put in it is what gets you the interview.
