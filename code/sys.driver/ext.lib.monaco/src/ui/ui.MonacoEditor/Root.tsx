import { DEFAULTS, FC, LANGUAGES, Wrangle, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  languages: typeof LANGUAGES;
  className: typeof Wrangle.editorClassName;
};
export const MonacoEditor = FC.decorate<t.MonacoEditorProps, Fields>(
  View,
  {
    DEFAULTS,
    languages: LANGUAGES,
    className: Wrangle.editorClassName,
  },
  { displayName: DEFAULTS.displayName },
);
