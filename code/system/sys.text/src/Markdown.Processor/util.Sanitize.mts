import { defaultSchema as base } from 'rehype-sanitize';
import type { Schema } from 'hast-util-sanitize';

/**
 * Helpers for working with the markdown sanatizer
 */
export const Sanatize = {
  /**
   *  REF: https://github.com/rehypejs/rehype-sanitize
   */
  schema(): Schema {
    const ATTR = base.attributes || {};
    const attr = (key: string, value: string[]) => [...(ATTR[key] || []), ...value];

    return {
      ...base,
      attributes: {
        ...ATTR,
        code: attr('code', ['className', 'language-ts', 'language-yaml']),
        img: attr('image', ['className', 'src', 'srcset']),
      },
    };
  },
};
