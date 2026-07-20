/**
 * chrome.js — Site chrome (header, navigation, footer).
 *
 * Renders the shared page furniture on every page from JSON data:
 * navigation.json (menu), profile.json (identity), site.json (copy).
 * Also wires up the accessible mobile menu toggle.
 */

import { loadAll } from "./jsonLoader.js";
import { DATASETS } from "../config.js";
import { el, qs, render } from "./utils.js";

/**
 * Render header and footer into their placeholder elements.
 *
 * @param {string} root - Relative prefix to the site root ("./" or "../").
 * @param {string} activeNav - Navigation item id to highlight.
 * @returns {Promise<{site: Object, profile: Object, navigation: Object[]}>}
 *   The loaded chrome datasets, so page controllers can reuse them.
 */
export async function initChrome(root, activeNav) {
  const [navigation, profile, site] = await loadAll(
    DATASETS.NAVIGATION,
    DATASETS.PROFILE,
    DATASETS.SITE
  );

  renderHeader(root, activeNav, navigation, profile);
  renderFooter(root, navigation, profile, site);

  return { site, profile, navigation };
}

/**
 * Resolve a navigation item id to a href usable from the current page.
 * @param {Object[]} navigation
 * @param {string} pageId
 * @param {string} root
 * @returns {string}
 */
export function pageHref(navigation, pageId, root) {
  const item = navigation.find((entry) => entry.id === pageId);
  return item ? root + item.path : root;
}

/* ----------------------------------------------------------------------
   Header
   ---------------------------------------------------------------------- */

function renderHeader(root, activeNav, navigation, profile) {
  const header = qs("#site-header");
  if (!header) return;

  const brand = el("a", { class: "brand", href: pageHref(navigation, "home", root) }, [
    el("span", { class: "brand-mark", "aria-hidden": "true", text: profile.initials }),
    el("span", { class: "brand-text" }, [
      el("span", { class: "brand-name", text: profile.name }),
      el("span", { class: "brand-tagline", text: profile.tagline }),
    ]),
  ]);

  const toggle = el(
    "button",
    {
      class: "nav-toggle",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": "primary-nav",
    },
    [
      el("span", { class: "nav-toggle-bar" }),
      el("span", { class: "nav-toggle-bar" }),
      el("span", { class: "nav-toggle-bar" }),
      el("span", { class: "sr-only", text: "Menu" }),
    ]
  );

  const links = navigation.map((item) => {
    const isActive = item.id === activeNav;
    return el("li", {}, [
      el("a", {
        class: `nav-link${isActive ? " is-active" : ""}`,
        href: root + item.path,
        text: item.label,
        "aria-current": isActive ? "page" : null,
      }),
    ]);
  });

  const nav = el(
    "nav",
    { class: "primary-nav", id: "primary-nav", "aria-label": "Primary" },
    [el("ul", { class: "nav-list" }, links)]
  );

  render(header, el("div", { class: "container nav-bar" }, [brand, toggle, nav]));

  // Mobile menu behaviour
  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu with Escape and return focus to the toggle.
  header.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("nav-open")) {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}

/* ----------------------------------------------------------------------
   Footer
   ---------------------------------------------------------------------- */

function renderFooter(root, navigation, profile, site) {
  const footer = qs("#site-footer");
  if (!footer) return;

  const brandColumn = el("div", { class: "footer-brand" }, [
    el("span", { class: "brand-mark", "aria-hidden": "true", text: profile.initials }),
    el("p", { class: "footer-blurb", text: site.footer.blurb }),
  ]);

  const exploreColumn = el("div", {}, [
    el("h2", { class: "footer-heading", text: site.footer.exploreHeading }),
    el(
      "ul",
      { class: "footer-links" },
      navigation.map((item) =>
        el("li", {}, [el("a", { href: root + item.path, text: item.label })])
      )
    ),
  ]);

  const contactLinks = [
    el("li", {}, [el("a", { href: `mailto:${profile.email}`, text: profile.email })]),
    el("li", {}, [
      el("a", {
        href: profile.links.github,
        text: site.footer.githubLabel,
        rel: "noopener",
        target: "_blank",
      }),
    ]),
    el("li", {}, [
      el("a", {
        href: profile.links.linkedin,
        text: site.footer.linkedinLabel,
        rel: "noopener",
        target: "_blank",
      }),
    ]),
    el("li", { text: profile.location }),
  ];

  const contactColumn = el("div", {}, [
    el("h2", { class: "footer-heading", text: site.footer.contactHeading }),
    el("ul", { class: "footer-links" }, contactLinks),
  ]);

  const bottomBar = el("div", { class: "footer-bottom" }, [
    el("p", {
      text: `© ${new Date().getFullYear()} ${profile.name}. All rights reserved.`,
    }),
    el("p", { text: site.footer.note }),
  ]);

  render(
    footer,
    el("div", { class: "container" }, [
      el("div", { class: "footer-grid" }, [brandColumn, exploreColumn, contactColumn]),
      bottomBar,
    ])
  );
}
