export type UrlPathString = string;

/**
 * Tools for fetching things.
 */
export const Fetch = {
  /**
   * Dynamic imports (code-splitting).
   */
  component: {
    async Markdown() {
      const { Markdown } = await import('./Markdown/Markdown');
      return Markdown;
    },
  },
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
    const text = await (await fetch(path)).text();
    return JSON.parse(text) as T;
  },

  /**
   * Fetch the "text/markdown" from the given URL path.
   */
  async markdown(path: UrlPathString) {
    const Text = await Fetch.module.Text();
    const processor = Text.Processor.markdown();
    const res = await fetch(path);
    const text = await res.text();
    return processor.toHtml(text);
  },
};
