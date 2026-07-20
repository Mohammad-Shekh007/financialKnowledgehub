/**
 * jsonLoader.js — Data access layer.
 *
 * Loads JSON datasets from /data/ with in-memory caching so each file is
 * fetched at most once per page view. Paths are resolved relative to this
 * module's own URL, so loading works identically from the site root
 * (index.html) and from /pages/*.html, on any host path (GitHub Pages
 * sub-paths included).
 */

const DATA_BASE = new URL("../../data/", import.meta.url);

/** @type {Map<string, Promise<unknown>>} */
const cache = new Map();

/**
 * Load a dataset from /data/<name>.json.
 *
 * @param {string} name - Dataset name without extension (e.g. "models").
 * @returns {Promise<unknown>} Parsed JSON.
 * @throws {Error} If the request fails or the response is not valid JSON.
 */
export function loadData(name) {
  if (!cache.has(name)) {
    const url = new URL(`${name}.json`, DATA_BASE);
    const request = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${url.pathname}: HTTP ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        // Remove the failed promise so a reload can retry.
        cache.delete(name);
        throw error;
      });
    cache.set(name, request);
  }
  return cache.get(name);
}

/**
 * Load several datasets in parallel.
 *
 * @param {...string} names - Dataset names.
 * @returns {Promise<unknown[]>} Results in the same order as the names.
 */
export function loadAll(...names) {
  return Promise.all(names.map(loadData));
}
