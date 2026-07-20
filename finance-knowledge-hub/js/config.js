/**
 * config.js — Engine configuration.
 *
 * Structural configuration only: which datasets exist, how pages map to
 * files, and display limits. All human-readable content (names, headings,
 * labels, copy) lives in /data/*.json — never here.
 */

/** Dataset names as they appear in /data/<name>.json */
export const DATASETS = {
  PROFILE: "profile",
  NAVIGATION: "navigation",
  SITE: "site",
  MODELS: "models",
  RESEARCH: "research",
  INSIGHTS: "insights",
};

/**
 * The three content collections and how they map to pages.
 * - dataset:    file name in /data/
 * - nav:        navigation item id highlighted when viewing this collection
 * - listPath:   list page, relative to the site root
 * - detailPath: detail page, relative to the site root
 */
export const COLLECTIONS = {
  models: {
    key: "models",
    dataset: DATASETS.MODELS,
    nav: "models",
    listPath: "pages/models.html",
    detailPath: "pages/model-detail.html",
  },
  research: {
    key: "research",
    dataset: DATASETS.RESEARCH,
    nav: "research",
    listPath: "pages/research.html",
    detailPath: "pages/research-detail.html",
  },
  insights: {
    key: "insights",
    dataset: DATASETS.INSIGHTS,
    nav: "insights",
    listPath: "pages/insights.html",
    detailPath: "pages/insight-detail.html",
  },
};

/** How many cards each homepage section shows. */
export const HOME_LIMITS = {
  models: 3,
  research: 3,
  insights: 3,
};

/** How many related items a detail page shows. */
export const RELATED_LIMIT = 3;

/** Date formatting used across the site. */
export const DATE_FORMAT = {
  locale: "en-US",
  options: { year: "numeric", month: "short", day: "numeric" },
};

/** Words-per-minute used for insight reading-time estimates. */
export const READING_WPM = 220;
