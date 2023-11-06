import type { Schema } from 'hast-util-sanitize';
import { defaultSchema } from 'rehype-sanitize';

/**
 * Helpers for working with the markdown sanatizer
 */
export const Sanatize = {
  /**
   *  REF: https://github.com/rehypejs/rehype-sanitize
   */
  schema(): Schema {
    const ATTR = { ...defaultSchema.attributes };
    const attr = (key: string, value: string[]) => [...(ATTR[key] || []), ...value];
    return {
      ...defaultSchema,
      attributes: {
        ...ATTR,
        code: attr('code', ['className', 'language-ts', 'language-yaml']),
        img: attr('image', ['className', 'src', 'srcset', 'width', 'height']),
        a: attr('a', ['target', 'rel']),
      },
    };
  },
};
