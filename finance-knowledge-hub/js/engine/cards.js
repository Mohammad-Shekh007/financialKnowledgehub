/**
 * cards.js — Card component.
 *
 * Builds the reusable content card used on the homepage, list pages, and
 * the "related items" strip on detail pages. Supports title, summary,
 * tags, date, optional image, and a featured badge. The whole card is
 * clickable via a stretched link on the title.
 */

import { el, formatDate, tagList } from "./utils.js";

/**
 * Create a card element for a content item.
 *
 * @param {Object} item - Content item from models/research/insights JSON.
 * @param {Object} options
 * @param {string} options.href - Link target for the card.
 * @param {string} options.typeLabel - Small type label (e.g. "Model").
 * @param {string} options.featuredLabel - Badge text for featured items.
 * @param {boolean} [options.showBadge=true] - Whether to show the badge.
 * @returns {HTMLElement} <article class="card">
 */
export function createCard(item, { href, typeLabel, featuredLabel, showBadge = true }) {
  const isFeatured = Boolean(item.featured);

  const card = el("article", {
    class: `card${isFeatured ? " card-featured" : ""}`,
  });

  if (item.image) {
    card.append(
      el("img", {
        class: "card-image",
        src: item.image,
        alt: item.imageAlt ?? "",
        loading: "lazy",
      })
    );
  }

  if (isFeatured && showBadge && featuredLabel) {
    card.append(
      el("span", { class: "badge-featured card-badge", text: featuredLabel })
    );
  }

  card.append(
    el("div", { class: "card-body" }, [
      el("p", { class: "card-meta" }, [
        el("span", { class: "card-type", text: typeLabel }),
        el("time", { class: "card-date", datetime: item.date, text: formatDate(item.date) }),
      ]),
      el("h3", { class: "card-title" }, [el("a", { href, text: item.title })]),
      el("p", { class: "card-summary", text: item.summary }),
      tagList(item.tags),
    ])
  );

  return card;
}

/**
 * Create a grid of cards for a list of items.
 *
 * @param {Object[]} items
 * @param {(item: Object) => Object} optionsFor - Maps an item to createCard options.
 * @returns {DocumentFragment}
 */
export function createCardGrid(items, optionsFor) {
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    fragment.append(createCard(item, optionsFor(item)));
  }
  return fragment;
}
