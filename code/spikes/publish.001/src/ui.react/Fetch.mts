export type UrlPathString = string;

import { Fetch as Base } from '../ui.logic/Fetch.mjs';

/**
 * Tools for fetching things.
 */
export const Fetch = {
  ...Base,

  /**
   * Dynamic imports (code-splitting).
   */
  component: {
    async Markdown() {
      const { Markdown } = await import('./Markdown/Markdown');
      return Markdown;
    },
  },
};
