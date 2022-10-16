import { defaultSchema } from 'rehype-sanitize';
import type { Schema } from 'hast-util-sanitize';

/**
 * Helpers for working with the markdown sanatizer
 */
export const Sanatize = {
  /**
   *  REF: https://github.com/rehypejs/rehype-sanitize
   */
  schema(): Schema {
    return {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        code: [
          ...((defaultSchema.attributes || {}).code || []),
          ['className', 'language-ts', 'language-yaml'],
        ],
      },
    };
  },
};
