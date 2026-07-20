/**
 * home.js — Homepage controller.
 *
 * Fills the hero, stats, featured/latest content sections, about preview,
 * and CTA banner from JSON data. All copy comes from site.json and
 * profile.json; all content items come from their collection files.
 */

import { COLLECTIONS, HOME_LIMITS, DATASETS } from "./config.js";
import { loadData } from "./engine/jsonLoader.js";
import { pageHref } from "./engine/chrome.js";
import { createCardGrid } from "./engine/cards.js";
import { el, qs, render, sortByDateDesc } from "./engine/utils.js";

/**
 * Initialize the homepage.
 * @param {{root: string, site: Object, profile: Object, navigation: Object[]}} ctx
 */
export async function initHome(ctx) {
  const { root, site, profile, navigation } = ctx;

  const [models, research, insights] = await Promise.all([
    loadData(DATASETS.MODELS),
    loadData(DATASETS.RESEARCH),
    loadData(DATASETS.INSIGHTS),
  ]);

  const collections = { models, research, insights };

  renderHero(ctx, collections);

  renderCardSection({
    ctx,
    sectionId: "featured-models",
    copy: site.home.featuredModels,
    collection: COLLECTIONS.models,
    items: pickFeatured(models, HOME_LIMITS.models),
  });

  renderCardSection({
    ctx,
    sectionId: "latest-research",
    copy: site.home.latestResearch,
    collection: COLLECTIONS.research,
    items: sortByDateDesc(research).slice(0, HOME_LIMITS.research),
  });

  renderCardSection({
    ctx,
    sectionId: "latest-insights",
    copy: site.home.latestInsights,
    collection: COLLECTIONS.insights,
    items: sortByDateDesc(insights).slice(0, HOME_LIMITS.insights),
  });

  renderAboutPreview(root, site, profile, navigation);
  renderCta(root, site, profile, navigation);
}

/* ----------------------------------------------------------------------
   Hero
   ---------------------------------------------------------------------- */

function renderHero(ctx, collections) {
  const { root, site, navigation } = ctx;
  const hero = site.hero;

  qs("#hero-eyebrow").textContent = hero.eyebrow;
  qs("#hero-heading").textContent = hero.heading;
  qs("#hero-sub").textContent = hero.subheading;

  const actions = hero.actions.map((action) =>
    el("a", {
      class: `btn btn-lg ${action.style === "primary" ? "btn-primary" : "btn-secondary"}`,
      href: pageHref(navigation, action.page, root),
      text: action.label,
    })
  );
  render(qs("#hero-actions"), ...actions);

  const stats = hero.stats.map((stat) => {
    const value = stat.collection ? String(collections[stat.collection].length) : stat.value;
    return el("div", { class: "stat" }, [
      el("dt", { class: "stat-label", text: stat.label }),
      el("dd", { class: "stat-value", text: value }),
    ]);
  });
  render(qs("#hero-stats"), ...stats);
}

/* ----------------------------------------------------------------------
   Content sections
   ---------------------------------------------------------------------- */

/** Featured items first (newest first), padded with the latest non-featured. */
function pickFeatured(items, limit) {
  const sorted = sortByDateDesc(items);
  const featured = sorted.filter((item) => item.featured);
  const rest = sorted.filter((item) => !item.featured);
  return [...featured, ...rest].slice(0, limit);
}

function renderCardSection({ ctx, sectionId, copy, collection, items }) {
  const { root, site } = ctx;

  qs(`#${sectionId}-eyebrow`).textContent = copy.eyebrow;
  qs(`#${sectionId}-heading`).textContent = copy.heading;

  const link = qs(`#${sectionId}-link`);
  link.textContent = copy.linkLabel;
  link.setAttribute("href", root + collection.listPath);

  render(
    qs(`#${sectionId}-grid`),
    createCardGrid(items, (item) => ({
      href: `${root}${collection.detailPath}?id=${encodeURIComponent(item.id)}`,
      typeLabel: site.pages[collection.key].eyebrow,
      featuredLabel: site.labels.featured,
    }))
  );
}

/* ----------------------------------------------------------------------
   About preview & CTA
   ---------------------------------------------------------------------- */

function renderAboutPreview(root, site, profile, navigation) {
  const copy = site.home.aboutPreview;

  qs("#about-preview-eyebrow").textContent = copy.eyebrow;
  qs("#about-preview-heading").textContent = copy.heading;
  qs("#about-preview-text").textContent = profile.summary;

  const link = qs("#about-preview-link");
  link.textContent = copy.linkLabel;
  link.setAttribute("href", pageHref(navigation, "about", root));
}

function renderCta(root, site, profile, navigation) {
  const cta = site.home.cta;

  qs("#cta-heading").textContent = cta.heading;
  qs("#cta-body").textContent = cta.body;

  render(
    qs("#cta-actions"),
    el("a", {
      class: "btn btn-primary btn-lg",
      href: pageHref(navigation, cta.primary.page, root),
      text: cta.primary.label,
    }),
    el("a", {
      class: "btn btn-secondary btn-lg",
      href: `mailto:${profile.email}`,
      text: cta.secondaryLabel,
    })
  );
}
