/**
 * utils.js — Shared helpers.
 *
 * DOM construction, date formatting, sorting, query params, page metadata,
 * and the shared building blocks used by detail pages. No content and no
 * styling lives here — content comes from JSON, appearance from CSS classes.
 */

import { DATE_FORMAT, READING_WPM } from "../config.js";

/* ----------------------------------------------------------------------
   DOM helpers
   ---------------------------------------------------------------------- */

/**
 * Shorthand querySelector.
 * @param {string} selector
 * @param {ParentNode} [scope]
 * @returns {Element|null}
 */
export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

/**
 * Create a DOM element.
 *
 * @param {string} tag - Tag name.
 * @param {Object} [attrs] - Attributes. Special keys:
 *   `class` → className, `text` → textContent, `dataset` → data-* values.
 * @param {(Node|string|null|undefined)[]|Node|string} [children]
 * @returns {HTMLElement}
 */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined) continue;
    if (key === "class") {
      node.className = value;
    } else if (key === "text") {
      node.textContent = value;
    } else if (key === "dataset") {
      Object.assign(node.dataset, value);
    } else {
      node.setAttribute(key, value);
    }
  }

  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child === null || child === undefined) continue;
    node.append(child instanceof Node ? child : document.createTextNode(child));
  }

  return node;
}

/**
 * Replace an element's children with the given nodes.
 * @param {Element} container
 * @param {...(Node|string)} nodes
 */
export function render(container, ...nodes) {
  container.replaceChildren(...nodes);
}

/* ----------------------------------------------------------------------
   Data helpers
   ---------------------------------------------------------------------- */

/**
 * Format an ISO date string (YYYY-MM-DD) for display, e.g. "May 18, 2026".
 * @param {string} isoDate
 * @returns {string}
 */
export function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString(DATE_FORMAT.locale, DATE_FORMAT.options);
}

/**
 * Return a copy of the items sorted newest-first by their `date` field.
 * @param {{date: string}[]} items
 * @returns {{date: string}[]}
 */
export function sortByDateDesc(items) {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/**
 * Read a query-string parameter from the current URL.
 * @param {string} name
 * @returns {string|null}
 */
export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/**
 * Fill a simple "{placeholder}" template from a values object.
 * @param {string} template - e.g. "Showing {shown} of {total}"
 * @param {Object<string, string|number>} values
 * @returns {string}
 */
export function fillTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match
  );
}

/**
 * Estimate reading time in minutes for an item's sections.
 * @param {Object} sections - The `sections` object of a content item.
 * @returns {number} Whole minutes, minimum 1.
 */
export function readingTime(sections) {
  const text = JSON.stringify(sections ?? {});
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / READING_WPM));
}

/* ----------------------------------------------------------------------
   Page metadata
   ---------------------------------------------------------------------- */

/**
 * Update the document title and description meta tags (including OpenGraph
 * and Twitter mirrors) — used by detail pages once their item is known.
 * @param {string} title
 * @param {string} [description]
 */
export function setPageMeta(title, description) {
  document.title = title;

  const targets = [
    ['meta[name="description"]', description],
    ['meta[property="og:title"]', title],
    ['meta[property="og:description"]', description],
    ['meta[name="twitter:title"]', title],
    ['meta[name="twitter:description"]', description],
  ];

  for (const [selector, value] of targets) {
    if (!value) continue;
    const tag = document.head.querySelector(selector);
    if (tag) tag.setAttribute("content", value);
  }
}

/* ----------------------------------------------------------------------
   Shared page building blocks
   ---------------------------------------------------------------------- */

/**
 * Build a tag list (<ul class="tag-list">).
 * @param {string[]} tags
 * @returns {HTMLUListElement}
 */
export function tagList(tags = []) {
  return el(
    "ul",
    { class: "tag-list" },
    tags.map((tag) => el("li", { class: "tag", text: tag }))
  );
}

/**
 * Build one titled section of a detail page.
 * @param {string} title - Section heading.
 * @param {(Node|string)[]|Node|string} content
 * @returns {HTMLElement}
 */
export function detailSection(title, content) {
  const body = Array.isArray(content) ? content : [content];
  return el("section", { class: "detail-section" }, [
    el("h2", { text: title }),
    el("div", { class: "prose" }, body),
  ]);
}

/**
 * Build the standard hero block for a detail page.
 *
 * @param {Object} item - Content item (title, summary, date, tags…).
 * @param {Object} options
 * @param {string} options.typeLabel - Eyebrow text (e.g. "Financial model").
 * @param {string} options.backHref - URL of the list page.
 * @param {string} options.backLabel - Text of the back link.
 * @param {(Node|string)[]} [options.extraMeta] - Extra meta entries.
 * @param {Node[]} [options.actions] - Buttons (GitHub, etc.).
 * @returns {DocumentFragment}
 */
export function buildDetailHero(item, { typeLabel, backHref, backLabel, extraMeta = [], actions = [] }) {
  const fragment = document.createDocumentFragment();

  fragment.append(
    el("a", { class: "back-link", href: backHref, text: backLabel }),
    el("p", { class: "eyebrow", text: typeLabel }),
    el("h1", { text: item.title }),
    el("div", { class: "detail-meta" }, [
      el("time", { datetime: item.date, text: formatDate(item.date) }),
      ...extraMeta,
    ]),
    el("p", { class: "detail-summary", text: item.summary }),
    tagList(item.tags)
  );

  if (actions.length > 0) {
    fragment.append(el("div", { class: "detail-actions" }, actions));
  }

  return fragment;
}

/**
 * Build a notice block (not found, load error, empty state).
 * @param {string} title
 * @param {string} body
 * @param {{href: string, label: string}} [action]
 * @returns {HTMLElement}
 */
export function buildNotice(title, body, action) {
  const children = [el("h2", { text: title }), el("p", { text: body })];
  if (action) {
    children.push(el("a", { class: "btn btn-primary", href: action.href, text: action.label }));
  }
  return el("div", { class: "notice" }, children);
}
