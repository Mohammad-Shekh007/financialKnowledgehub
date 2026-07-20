/**
 * listPage.js — List page controller.
 *
 * Drives the three collection pages (models, research, insights):
 * fills the page header from site.json, builds an accessible tag filter,
 * renders the card grid, and keeps the result count in sync.
 */

import { COLLECTIONS } from "../config.js";
import { loadData } from "./jsonLoader.js";
import { createCardGrid } from "./cards.js";
import { qs, render, sortByDateDesc, fillTemplate, buildNotice } from "./utils.js";
import { el } from "./utils.js";

/**
 * Initialize a collection list page.
 *
 * @param {string} collectionKey - "models" | "research" | "insights".
 * @param {{root: string, site: Object}} ctx - App context from app.js.
 */
export async function initListPage(collectionKey, ctx) {
  const { root, site } = ctx;
  const collection = COLLECTIONS[collectionKey];
  const copy = site.pages[collectionKey];
  const labels = site.labels;

  fillPageHeader(copy);

  const items = sortByDateDesc(await loadData(collection.dataset));

  const grid = qs("#card-grid");
  const count = qs("#result-count");
  const filterBar = qs("#filter-bar");

  if (!grid) return;

  /** Render the grid for the current tag selection. */
  const show = (tag) => {
    const visible = tag ? items.filter((item) => (item.tags ?? []).includes(tag)) : items;

    if (visible.length === 0) {
      render(grid, buildNotice(labels.notFound.title, labels.notFound.body));
    } else {
      render(
        grid,
        createCardGrid(visible, (item) => ({
          href: `${root}${collection.detailPath}?id=${encodeURIComponent(item.id)}`,
          typeLabel: copy.eyebrow,
          featuredLabel: labels.featured,
        }))
      );
    }

    if (count) {
      count.textContent = fillTemplate(labels.resultCount, {
        shown: visible.length,
        total: items.length,
      });
    }
  };

  buildFilterBar(filterBar, items, labels.filterAll, show);
  show(null);
}

/* ----------------------------------------------------------------------
   Internals
   ---------------------------------------------------------------------- */

function fillPageHeader(copy) {
  const eyebrow = qs("#page-eyebrow");
  const title = qs("#page-title");
  const intro = qs("#page-intro");

  if (eyebrow) eyebrow.textContent = copy.eyebrow;
  if (title) title.textContent = copy.title;
  if (intro) intro.textContent = copy.intro;
}

/**
 * Build the tag filter as a group of toggle buttons.
 * Exactly one button is pressed at a time; "All" clears the filter.
 */
function buildFilterBar(container, items, allLabel, onSelect) {
  if (!container) return;

  const tags = [...new Set(items.flatMap((item) => item.tags ?? []))].sort((a, b) =>
    a.localeCompare(b)
  );

  // No point rendering a filter for zero or one tag.
  if (tags.length < 2) {
    container.hidden = true;
    return;
  }

  const makeButton = (label, tagValue) =>
    el("button", {
      class: "filter-button",
      type: "button",
      text: label,
      "aria-pressed": tagValue === null ? "true" : "false",
      dataset: tagValue === null ? {} : { tag: tagValue },
    });

  const buttons = [makeButton(allLabel, null), ...tags.map((tag) => makeButton(tag, tag))];
  render(container, ...buttons);

  container.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-button");
    if (!button) return;

    for (const other of buttons) {
      other.setAttribute("aria-pressed", String(other === button));
    }
    onSelect(button.dataset.tag ?? null);
  });
}
