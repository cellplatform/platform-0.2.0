import { type t } from './common';
export * from '../common';

export const DEFAULTS = {
  behaviors: {
    get all(): t.CanvasBehavior[] {
      return ['Foo', 'Bar'];
    },
    get default(): t.CanvasBehavior[] {
      return ['Foo'];
    },
  },
} as const;
