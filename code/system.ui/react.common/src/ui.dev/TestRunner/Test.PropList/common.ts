import { type t } from '../common';

export * from '../common';
export { PropList } from '../../../ui/PropList';
export { Switch } from '../../../ui/Button.Switch';
export { Theme } from '../../DevTools/Helpers.Theme';

/**
 * Constants
 */

export const FIELDS: t.TestRunnerField[] = [
  'Module',
  'Module.Version',
  'Tests.Run',
  'Tests.Selector',
  'Tests.Selector.Reset',
];

const fields = ['Tests.Run', 'Tests.Selector', 'Tests.Selector.Reset'] as t.TestRunnerField[];

const keyboard: t.TestPropListKeyboard = {
  run: 'Enter',
  runAll: 'ALT + Enter',
  selectAllToggle: 'ALT + KeyA',
};

export const DEFAULTS = {
  fields,
  ellipsis: true,
  colorDelay: 1000 * 8,
  keyboard,
} as const;
