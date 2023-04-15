import { Results } from './Results';
import { CompactTestRunner } from './Runner.Compact';
import { PropListTestRunner } from './Runner.PropList';
import { Test } from './common';

export const TestRunner = {
  Results,
  Compact: CompactTestRunner,
  PropList: PropListTestRunner,
  bundle: Test.bundle,
};

export { Results, CompactTestRunner, PropListTestRunner };
