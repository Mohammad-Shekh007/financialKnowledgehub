/**
 * detail/research.js — Research detail page controller.
 *
 * Renders one research piece: hero, narrative sections, methodology
 * steps, findings, sources, GitHub link, and related research.
 */

import { COLLECTIONS, RELATED_LIMIT } from "../config.js";
import { loadData } from "../engine/jsonLoader.js";
import { createCardGrid } from "../engine/cards.js";
import {
  el,
  qs,
  render,
  getQueryParam,
  sortByDateDesc,
  setPageMeta,
  buildDetailHero,
  buildNotice,
  detailSection,
} from "../engine/utils.js";

/**
 * Initialize the research detail page.
 * @param {{root: string, site: Object}} ctx
 */
export async function initResearchDetail(ctx) {
  const { root, site } = ctx;
  const collection = COLLECTIONS.research;
  const labels = site.labels;
  const listHref = root + collection.listPath;

  const items = await loadData(collection.dataset);
  const item = items.find((entry) => entry.id === getQueryParam("id"));

  const heroContainer = qs("#detail-hero-content");
  const bodyContainer = qs("#detail-content");

  if (!item) {
    const heroSection = qs("#detail-hero");
    if (heroSection) heroSection.hidden = true;
    render(
      bodyContainer,
      buildNotice(labels.notFound.title, labels.notFound.body, {
        href: listHref,
        label: labels.backTo.research,
      })
    );
    return;
  }

  setPageMeta(item.title + site.titleSuffix, item.summary);

  // Hero
  render(
    heroContainer,
    buildDetailHero(item, {
      typeLabel: site.pages.research.eyebrow,
      backHref: listHref,
      backLabel: labels.backTo.research,
      actions: item.github
        ? [
            el("a", {
              class: "btn btn-primary",
              href: item.github,
              rel: "noopener",
              target: "_blank",
              text: labels.github,
            }),
          ]
        : [],
    })
  );

  // Body sections
  const s = item.sections;
  const sectionTitles = labels.sections;
  const blocks = [
    detailSection(sectionTitles.overview, el("p", { text: s.overview })),
    detailSection(sectionTitles.problem, el("p", { text: s.problem })),
    detailSection(sectionTitles.approach, el("p", { text: s.approach })),
    detailSection(
      sectionTitles.methodology,
      el("ol", { class: "step-list" }, s.methodology.map((step) => el("li", { text: step })))
    ),
    detailSection(sectionTitles.results, [
      el("p", { text: s.results.summary }),
      el("ul", {}, s.results.points.map((point) => el("li", { text: point }))),
    ]),
    detailSection(
      sectionTitles.lessons,
      el("ul", {}, s.lessons.map((lesson) => el("li", { text: lesson })))
    ),
  ];

  if (item.sources?.length) {
    blocks.push(detailSection(sectionTitles.sources, buildSourceList(item.sources)));
  }

  render(bodyContainer, ...blocks);

  renderRelated(ctx, collection, items, item);
}

/* ----------------------------------------------------------------------
   Internals
   ---------------------------------------------------------------------- */

function buildSourceList(sources) {
  return el(
    "ul",
    { class: "source-list" },
    sources.map((source) => {
      const title = source.url
        ? el("a", { href: source.url, rel: "noopener", target: "_blank", text: source.title })
        : el("span", { text: source.title });
      return el("li", {}, [
        title,
        el("span", { class: "source-publisher", text: ` — ${source.publisher}` }),
      ]);
    })
  );
}

function renderRelated(ctx, collection, items, current) {
  const { root, site } = ctx;
  const section = qs("#related-section");
  const grid = qs("#related-grid");
  const heading = qs("#related-heading");
  if (!section || !grid) return;

  const related = sortByDateDesc(items.filter((entry) => entry.id !== current.id)).slice(
    0,
    RELATED_LIMIT
  );

  if (related.length === 0) return;

  section.hidden = false;
  heading.textContent = site.labels.related.research;
  render(
    grid,
    createCardGrid(related, (entry) => ({
      href: `${root}${collection.detailPath}?id=${encodeURIComponent(entry.id)}`,
      typeLabel: site.pages.research.eyebrow,
      featuredLabel: site.labels.featured,
    }))
  );
}
