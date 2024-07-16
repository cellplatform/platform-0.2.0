import { stringifyAutomergeUrl, parseAutomergeUrl } from '@automerge/automerge-repo';
import { v4 } from 'uuid';
import { Hash } from './libs';
import { Is } from './u.Is';

import type * as t from './t';

type Shorten = number | [number, number];
type ShortenInput = Shorten | boolean;

/**
 * Helpers for working with document URIs.
 */
export const DocUri = {
  /**
   * Extract the ID component of a document URI.
   * eg: "automerge:<abc>" → "<abc>"
   */
  id(input: any, options: { shorten?: ShortenInput } = {}): string {
    if (Is.doc(input)) input = input.uri;
    if (typeof input !== 'string') return '';

    const done = (id: string) => {
      const shorten = wrangle.shorten(options.shorten);
      if (shorten) id = Hash.shorten(id, shorten);
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

  /**
   * Convenience method to extract a shortened ID from the URI.
   */
  shorten(input: any, shorten?: ShortenInput) {
    return DocUri.id(input, { shorten: shorten ?? true });
  },

  /**
   * Generate a new URI with a randomly generated document-id.
   */
  generate: {
    uri() {
      const documentId = DocUri.generate.docid.binary();
      return stringifyAutomergeUrl({ documentId });
    },
    docid: {
      binary() {
        return v4(null, new Uint8Array(16)) as t.BinaryDocumentId;
      },
      string() {
        const { documentId } = parseAutomergeUrl(DocUri.generate.uri());
        return documentId;
      },
    },
  },

  /**
   * Convert input to URI string.
   */
  toString(input?: t.Doc | string): string {
    if (!input) return '';
    if (typeof input === 'string') return input;
    if (Is.doc(input)) return input.uri;
    return '';
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  shorten(shorten?: ShortenInput): Shorten | undefined {
    if (!shorten) return;
    if (shorten === true) return [4, 4];
    return shorten;
  },
} as const;
