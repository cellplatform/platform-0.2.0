import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { Dummy } from './ui.Dummy';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Dummy: typeof Dummy;
};
export const ConceptSlug = FC.decorate<t.ConceptSlugProps, Fields>(
  View,
  { DEFAULTS, Dummy },
  { displayName: 'ConceptSlug' },
);
