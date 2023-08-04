import { Wrangle } from './Wrangle.mjs';
import { DEFAULTS, FC, type t } from './common';
import { View } from './view';
import { PropEditor } from './view.PropEditor';

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
  { displayName: 'SplitLayout' },
);
