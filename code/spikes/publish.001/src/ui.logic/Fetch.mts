import { Path, BundlePaths, t } from './common.mjs';
export type UrlPathString = string;

/**
 * Tools for fetching things.
 */
export const Fetch = {
  /**
   * Dynamic imports (Code Splitting) <== 🌳
   */
  module: {
    async Text() {
      const { Text } = await import('sys.text');
      return Text;
    },
  },

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
   * Fetch the "text/markdown" from the given URL path.
   */
  async markdown(sourcePath: UrlPathString) {
    const { text, processor, error } = await Fetch.textAndProcessor(sourcePath);
    const res = await processor.toMarkdown(text);
    return { ...res, error };
  },

  /**
   * Fetch the "text/markdown" from the given URL path.
   */
  async markdownAsHtml(sourcePath: UrlPathString) {
    const { text, processor, error } = await Fetch.textAndProcessor(sourcePath);
    const res = await processor.toHtml(text);
    return { ...res, error };
  },

  /**
   * Log
   */
  async logHistory() {
    const path = Path.toAbsolutePath(BundlePaths.data.log);
    const log = await Fetch.json<t.PublicLogSummary>(path);
    return log;
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
   * Fetch the Text module, processor and data.
   */
  async textAndProcessor(sourcePath: UrlPathString) {
    const Text = await Fetch.module.Text();
    const processor = Text.Processor.markdown();
    const res = await Fetch.text(sourcePath);
    return { ...res, processor };
  },
};
