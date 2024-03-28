import { BundlePaths, Path, t } from './common';

export type UrlPathString = string;

/**
 * Tools for fetching things.
 */
export const Fetch = {
  /**
   * Fetch the JSON at the given URL path.
   */
  async json<T>(sourcePath: UrlPathString) {
    const res = await fetch(sourcePath);

    const ok = res.status.toString().startsWith('2');
    if (!ok) {
      console.warn(`[Fetch.json:${res.status}] failed to load: ${sourcePath}`);
      return undefined;
    }

    const text = await res.text();
    return JSON.parse(text) as T;
  },

  /**
   * Fetch text from the given path.
   */
  async text(sourcePath: UrlPathString) {
    const res = await fetch(sourcePath);
    const { status } = res;
    const ok = res.status.toString().startsWith('2');
    const text = ok ? await res.text() : '';
    const error = ok ? undefined : `${status} Failed to fetch: ${sourcePath}`;
    return { ok, status, text, error };
  },

  /**
   * Log
   */
  async logHistory() {
    const path = Path.toAbsolutePath(Path.join(BundlePaths.data.base, BundlePaths.data.logfile));
    const log = await Fetch.json<t.LogPublicHistory>(path);
    return log;
  },
};
