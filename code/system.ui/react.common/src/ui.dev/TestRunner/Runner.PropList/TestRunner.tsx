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
  item(fn: t.GetTestPayload): t.PropListItem {
    return {
      label: <TestLabel />,
      value: <TestRunner get={fn} />,
    };
  },
};
