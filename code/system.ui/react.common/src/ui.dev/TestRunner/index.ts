import { TestResults } from './Results';
import { TestRunnerCompact } from './Runner.Compact';
import { TestRunnerPropList } from './Runner.PropList';
import { Test } from './common';

export const TestRunner = {
  Results: TestResults,
  Compact: TestRunnerCompact,
  PropList: TestRunnerPropList,
  bundle: Test.bundle,
};

export { TestResults, TestRunnerCompact, TestRunnerPropList };
export default TestRunner;
