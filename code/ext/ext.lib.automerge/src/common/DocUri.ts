import { stringifyAutomergeUrl, parseAutomergeUrl } from '@automerge/automerge-repo';
import { v4 } from 'uuid';
import { Hash } from './libs';

import type * as t from './t';

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
} as const;
