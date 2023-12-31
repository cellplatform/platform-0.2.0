import { Hash } from './libs';

type ShortenInput = number | [number, number];

/**
 * Helpers for working with document URIs.
 */
export const DocUri = {
  /**
   * Extract the ID component of a document URI.
   * eg: "automerge:<abc>" → "<abc>"
   */
  id(input: any, options: { shorten?: ShortenInput } = {}): string {
    if (typeof input !== 'string') return '';

    const done = (id: string) => {
      if (options.shorten) id = Hash.shorten(id, options.shorten);
      return id;
    };

    const text = input.trim();
    if (!text.includes(':')) return done(text);
    return done(text.split(':')[1] ?? '');
  },

  /**
   * Ensure the value is prefixed with "automerge:"
   */
  automerge(input: any, options: { shorten?: ShortenInput } = {}): string {
    const id = DocUri.id(input, options);
    return id ? `automerge:${id}` : '';
  },
} as const;
