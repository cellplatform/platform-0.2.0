import { TestResults } from './Results';
import { TestRunnerPropList } from './Runner.PropList';
import { Test } from './common';

export const TestRunner = {
  Results: TestResults,
  PropList: TestRunnerPropList,
  bundle: Test.bundle,
};

export { TestResults, TestRunnerPropList };
export default TestRunner;
