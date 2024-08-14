import { DEFAULTS, FC, Wrangle, type t } from './common';
import { View } from './ui';

const languages = DEFAULTS.languages;

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  languages: typeof languages;
  Wrangle: typeof Wrangle;
};
export const MonacoEditor = FC.decorate<t.MonacoEditorProps, Fields>(
  View,
  { DEFAULTS, languages, Wrangle },
  { displayName: DEFAULTS.displayName },
);
