/**
 * detail/model.js — Model detail page controller.
 *
 * Renders one financial model: hero, narrative sections, methodology
 * steps, key output metrics, tools, GitHub link, and related models.
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
  tagList,
} from "../engine/utils.js";

/**
 * Initialize the model detail page.
 * @param {{root: string, site: Object}} ctx
 */
export async function initModelDetail(ctx) {
  const { root, site } = ctx;
  const collection = COLLECTIONS.models;
  const labels = site.labels;
  const listHref = root + collection.listPath;

  const items = await loadData(collection.dataset);
  const item = items.find((entry) => entry.id === getQueryParam("id"));

  const heroContainer = qs("#detail-hero-content");
  const bodyContainer = qs("#detail-content");

  if (!item) {
    renderNotFound(heroContainer, bodyContainer, labels, listHref);
    return;
  }

  setPageMeta(item.title + site.titleSuffix, item.summary);

  // Hero
  render(
    heroContainer,
    buildDetailHero(item, {
      typeLabel: site.pages.models.eyebrow,
      backHref: listHref,
      backLabel: labels.backTo.models,
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
  ];

  if (item.metrics?.length) {
    blocks.push(
      detailSection(
        sectionTitles.metrics,
        el(
          "div",
          { class: "metric-grid" },
          item.metrics.map((metric) =>
            el("div", { class: "metric" }, [
              el("span", { class: "metric-value", text: metric.value }),
              el("span", { class: "metric-label", text: metric.label }),
            ])
          )
        )
      )
    );
  }

  blocks.push(
    detailSection(
      sectionTitles.lessons,
      el("ul", {}, s.lessons.map((lesson) => el("li", { text: lesson })))
    )
  );

  if (item.tools?.length) {
    blocks.push(detailSection(sectionTitles.tools, tagList(item.tools)));
  }

  render(bodyContainer, ...blocks);

  renderRelated(ctx, collection, items, item);
}

/* ----------------------------------------------------------------------
   Shared-shape helpers (local to models)
   ---------------------------------------------------------------------- */

function renderNotFound(heroContainer, bodyContainer, labels, listHref) {
  const heroSection = qs("#detail-hero");
  if (heroSection) heroSection.hidden = true;
  render(
    bodyContainer,
    buildNotice(labels.notFound.title, labels.notFound.body, {
      href: listHref,
      label: labels.backTo.models,
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
  heading.textContent = site.labels.related.models;
  render(
    grid,
    createCardGrid(related, (entry) => ({
      href: `${root}${collection.detailPath}?id=${encodeURIComponent(entry.id)}`,
      typeLabel: site.pages.models.eyebrow,
      featuredLabel: site.labels.featured,
    }))
  );
}
