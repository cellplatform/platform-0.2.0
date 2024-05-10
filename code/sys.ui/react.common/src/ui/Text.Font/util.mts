import { type t } from './common';

export const Util = {
  formatSource(input: t.FontDefinition['source']) {
    if (typeof input !== 'string') return input;

    const text = (input || '')
      .trim()
      .replace(/^url\(/, '')
      .replace(/\)$/, '');

    return `url(${text})`;
  },

  toKeyString(def: t.FontDefinition) {
    const { descriptors = {} } = def;
    const props = Object.entries(descriptors).map(([key, value]) => `${key}.${value}`);
    return `${def.family}:${def.source}:${props}`;
  },
};
