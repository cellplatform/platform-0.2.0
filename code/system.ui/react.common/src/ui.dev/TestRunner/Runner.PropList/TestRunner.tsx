import { t } from './common';

import { TestRunner } from './ui';
import { TestLabel } from './ui.Label';

/**
 * <PropList> compact test-runner.
 */
export const PropListTestRunner = {
  /**
   * Generates a <PropList> item for running unit tests.
   */
  item(args: { get: t.GetTestPayload; label?: string; infoUrl?: string }): t.PropListItem {
    return {
      label: <TestLabel title={args.label} infoUrl={args.infoUrl} />,
      value: <TestRunner get={args.get} />,
    };
  },
};
