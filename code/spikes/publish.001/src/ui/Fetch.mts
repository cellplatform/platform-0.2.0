export type UrlPathString = string;

import { Fetch as FetchLogic } from './logic.mjs';

/**
 * Tools for fetching things.
 */
export const Fetch = {
  ...FetchLogic,

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
