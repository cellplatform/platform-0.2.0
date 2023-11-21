import { Hash } from './libs';

/**
 * Helpers for working with document URIs.
 */
export const DocUri = {
  /**
   * Extract the ID component of a document URI.
   * eg: "automerge:<abc>" → "<abc>"
   */
  id(input: any, options: { shorten?: number | [number, number] } = {}): string {
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
  automerge(input: any): string {
    const id = DocUri.id(input);
    return id ? `automerge:${id}` : '';
  },
} as const;
