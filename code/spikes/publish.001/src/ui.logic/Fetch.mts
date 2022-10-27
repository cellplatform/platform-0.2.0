import { Path, BundlePaths, t } from './common.mjs';
export type UrlPathString = string;

/**
 * Tools for fetching things.
 */
export const Fetch = {
  /**
   * Dynamic imports (code-splitting).
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
  async json<T>(path: UrlPathString) {
    const res = await fetch(path);

    const ok = res.status.toString().startsWith('2');
    if (!ok) {
      console.warn(`[Fetch.json:${res.status}] failed to load: ${path}`);
      return undefined;
    }

    const text = await res.text();
    return JSON.parse(text) as T;
  },

  /**
   * Fetch the "text/markdown" from the given URL path.
   */
  async markdown(path: UrlPathString) {
    const { text, processor } = await fetchTextAndProcessor(path);
    return processor.toMarkdown(text);
  },

  /**
   * Fetch the "text/markdown" from the given URL path.
   */
  async markdownAsHtml(path: UrlPathString) {
    const { text, processor } = await fetchTextAndProcessor(path);
    return processor.toHtml(text);
  },

  /**
   * Log
   */
  async log() {
    const path = Path.toAbsolutePath(BundlePaths.data.log);
    const log = await Fetch.json<t.PublicLogSummary>(path);
    return log;
  },
};

/**
 * Helpers
 */

async function fetchTextAndProcessor(path: string) {
  const Text = await Fetch.module.Text();
  const processor = Text.Processor.markdown();
  const res = await fetch(path);
  const text = await res.text();
  return { text, processor };
}
