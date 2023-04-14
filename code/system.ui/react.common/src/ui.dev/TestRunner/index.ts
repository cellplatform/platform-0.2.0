import { Results } from './Results';
import { CompactTestRunner } from './Runner.Compact';
import { PropListTestRunner } from './Runner.PropList';

export const TestRunner = {
  Results,
  Compact: CompactTestRunner,
  PropList: PropListTestRunner,
};

export { Results, CompactTestRunner, PropListTestRunner };
