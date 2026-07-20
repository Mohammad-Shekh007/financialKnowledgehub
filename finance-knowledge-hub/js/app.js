/**
 * app.js — Application entry point (loaded by every page).
 *
 * Reads the page identity from <body data-page> and <body data-root>,
 * renders the shared chrome (header/footer), then hands control to the
 * matching page controller. The about and resume pages are simple enough
 * that their rendering lives here.
 */

import { initChrome } from "./engine/chrome.js";
import { el, qs, render, buildNotice, tagList } from "./engine/utils.js";

const root = document.body.dataset.root || "./";
const page = document.body.dataset.page || "";
const nav = document.body.dataset.nav || page;

start();

async function start() {
  try {
    const chrome = await initChrome(root, nav);
    const ctx = { root, ...chrome };
    await routePage(ctx);
  } catch (error) {
    console.error(error);
    showLoadError();
  }
}

/** Dispatch to the controller responsible for the current page. */
async function routePage(ctx) {
  switch (page) {
    case "home": {
      const { initHome } = await import("./home.js");
      await initHome(ctx);
      break;
    }
    case "models":
    case "research":
    case "insights": {
      const { initListPage } = await import("./engine/listPage.js");
      await initListPage(page, ctx);
      break;
    }
    case "model-detail": {
      const { initModelDetail } = await import("./detail/model.js");
      await initModelDetail(ctx);
      break;
    }
    case "research-detail": {
      const { initResearchDetail } = await import("./detail/research.js");
      await initResearchDetail(ctx);
      break;
    }
    case "insight-detail": {
      const { initInsightDetail } = await import("./detail/insight.js");
      await initInsightDetail(ctx);
      break;
    }
    case "about":
      renderAbout(ctx);
      break;
    case "resume":
      renderResume(ctx);
      break;
    default:
      // Pages with no dynamic body content still get header/footer above.
      break;
  }
}

/* ----------------------------------------------------------------------
   About page
   ---------------------------------------------------------------------- */

function renderAbout(ctx) {
  const { site, profile } = ctx;
  const copy = site.pages.about;

  fillPageHeader(copy);

  // Section headings
  const headings = copy.sections;
  setText("#bio-heading", headings.bio);
  setText("#experience-heading", headings.experience);
  setText("#education-heading", headings.education);
  setText("#certifications-heading", headings.certifications);
  setText("#timeline-heading", headings.timeline);
  setText("#skills-heading", headings.skills);
  setText("#interests-heading", headings.interests);
  setText("#goals-heading", headings.goals);

  // Bio
  render(qs("#bio-content"), ...profile.bio.map((text) => el("p", { text })));

  // Experience
  render(
    qs("#experience-list"),
    ...profile.experience.map((entry) =>
      el("article", { class: "info-card" }, [
        el("h3", { text: entry.company }),
        el("p", { class: "info-card-subtitle", text: entry.role }),
        el("p", {
          class: "info-card-period",
          text: `${entry.period} · ${entry.location}`,
        }),
        el("ul", {}, entry.highlights.map((item) => el("li", { text: item }))),
      ])
    )
  );

  // Education
  render(
    qs("#education-list"),
    ...profile.education.map((entry) =>
      el("article", { class: "info-card" }, [
        el("h3", { text: entry.school }),
        el("p", { class: "info-card-subtitle", text: entry.degree }),
        el("p", { class: "info-card-period", text: entry.period }),
        el("ul", {}, entry.details.map((detail) => el("li", { text: detail }))),
      ])
    )
  );

  // Certifications
  render(
    qs("#certifications-list"),
    ...profile.certifications.map((entry) =>
      el("article", { class: "info-card" }, [
        el("h3", { text: entry.title }),
        el("p", { class: "info-card-subtitle", text: entry.org }),
        el("p", { class: "info-card-note", text: entry.note }),
      ])
    )
  );

  // Timeline
  render(
    qs("#timeline"),
    ...profile.timeline.map((entry) =>
      el("li", { class: "timeline-item" }, [
        el("p", { class: "timeline-period", text: entry.period }),
        el("h3", { text: entry.title }),
        el("p", { text: entry.description }),
      ])
    )
  );

  // Skills
  render(
    qs("#skills-grid"),
    ...Object.entries(profile.skills).map(([group, skills]) =>
      el("article", { class: "info-card" }, [
        el("h3", { text: group }),
        el("ul", {}, skills.map((skill) => el("li", { text: skill }))),
      ])
    )
  );

  // Interests
  render(qs("#interests-tags"), tagList(profile.interests));

  // Goals
  render(
    qs("#goals-content"),
    el("ul", {}, profile.goals.map((goal) => el("li", { text: goal })))
  );
}

/* ----------------------------------------------------------------------
   Resume page
   ---------------------------------------------------------------------- */

function renderResume(ctx) {
  const { site, profile } = ctx;
  const copy = site.pages.resume;

  fillPageHeader(copy);

  const fileUrl = root + profile.resume.file;

  render(
    qs("#resume-actions"),
    el("a", {
      class: "btn btn-primary btn-lg",
      href: fileUrl,
      download: profile.resume.downloadName,
      text: copy.downloadLabel,
    })
  );

  const fallback = el("p", { class: "pdf-fallback" }, [
    copy.fallback,
    " ",
    el("a", { href: fileUrl, download: profile.resume.downloadName, text: copy.downloadLabel }),
  ]);

  const embed = el(
    "object",
    {
      class: "pdf-frame",
      data: fileUrl,
      type: "application/pdf",
      "aria-label": copy.title,
    },
    [fallback]
  );

  render(qs("#resume-embed"), embed);
}

/* ----------------------------------------------------------------------
   Shared helpers
   ---------------------------------------------------------------------- */

function fillPageHeader(copy) {
  setText("#page-eyebrow", copy.eyebrow);
  setText("#page-title", copy.title);
  setText("#page-intro", copy.intro);
}

function setText(selector, text) {
  const node = qs(selector);
  if (node && text !== undefined) node.textContent = text;
}

/**
 * Last-resort error state. Shown when chrome data itself fails to load
 * (e.g. the site is opened via file:// where fetch() is blocked), so the
 * message cannot come from site.json and is deliberately self-contained.
 */
function showLoadError() {
  const main = qs("main");
  if (!main) return;
  render(
    main,
    el("div", { class: "container section" }, [
      buildNotice(
        "This page couldn't load its content",
        "If you opened the file directly from disk, serve the folder with a local web server instead (for example, VS Code's Live Server extension) — browsers block data loading on the file:// protocol."
      ),
    ])
  );
}
