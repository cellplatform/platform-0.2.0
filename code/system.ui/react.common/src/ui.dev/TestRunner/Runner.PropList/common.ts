import { t } from '../common';

export * from '../common';
export { DevIcons } from '../../Icons.mjs';
export { PropList } from '../../../ui/PropList';

/**
 * Constants
 */

export const FIELDS: t.TestRunnerField[] = ['Module', 'Module.Version', 'Tests.Run'];

const fields = ['Module', 'Module.Version', 'Tests.Run'] as t.TestRunnerField[];

export const DEFAULTS = {
  fields,
} as const;
