import { Wrangle } from './Wrangle.mjs';
import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { PropEditor } from './ui.PropEditor';

/**
 * TODO 🐷
 * Move to [sys.common] → Layout
 */

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
