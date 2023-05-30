import { t } from '../common';

export * from '../common';
export { DevIcons } from '../../Icons.mjs';
export { PropList } from '../../../ui/PropList';
export { Switch } from '../../../ui/Button.Switch';

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

export const DEFAULTS = {
  fields,
  ellipsis: true,
} as const;
