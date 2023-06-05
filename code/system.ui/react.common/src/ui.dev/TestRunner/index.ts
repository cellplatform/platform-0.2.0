import { TestResults } from './Results';
import { TestPropList } from './Runner.PropList';

import { Test } from './common';

export const TestRunner = {
  Results: TestResults,
  PropList: TestPropList,
  bundle: Test.bundle,
};

export { TestResults, TestPropList };
export default TestRunner;
