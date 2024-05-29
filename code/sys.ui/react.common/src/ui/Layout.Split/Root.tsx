import { DEFAULTS, FC, type t } from './common';
import { Wrangle } from './u';
import { View } from './ui';
import { PropEditor } from './ui.PropEditor';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  PropEditor: typeof PropEditor;
  percent: typeof Wrangle.percent;
};
export const SplitLayout = FC.decorate<t.SplitLayoutProps, Fields>(
  View,
  { DEFAULTS, PropEditor, percent: Wrangle.percent },
  { displayName: DEFAULTS.displayName },
);
