import { type t } from '../common';

export * from '../common';
export { PropList } from '../../../ui/PropList';
export { Switch } from '../../../ui/Button.Switch';
export { Theme } from '../../DevTools/Helpers.Theme';

/**
 * Constants
 */

const keyboard: t.TestPropListKeyboard = {
  run: 'Enter',
  runAll: 'ALT + Enter',
  selectAllToggle: 'ALT + KeyA',
};

export const DEFAULTS = {
  ellipsis: true,
  colorDelay: 1000 * 8,
  keyboard,
  fields: {
    get all(): t.TestRunnerField[] {
      return ['Module', 'Module.Version', 'Tests.Run', 'Tests.Selector', 'Tests.Selector.Reset'];
    },
    get default(): t.TestRunnerField[] {
      return ['Tests.Run', 'Tests.Selector', 'Tests.Selector.Reset'];
    },
  },
} as const;
