import { DEFAULTS, FC, LANGUAGES, Wrangle, type t } from './common';
import { View } from './ui';
import { Util } from './u';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  languages: typeof LANGUAGES;
  Wrangle: typeof Wrangle;
};
export const MonacoEditor = FC.decorate<t.MonacoEditorProps, Fields>(
  View,
  {
    DEFAULTS,
    languages: LANGUAGES,
    Wrangle,
  },
  { displayName: DEFAULTS.displayName },
);
