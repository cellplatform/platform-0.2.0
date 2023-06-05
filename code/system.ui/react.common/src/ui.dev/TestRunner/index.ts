import { TestPropList } from './Test.PropList';
import { TestResults } from './Test.Results';
import { Test } from './common';

export const TestRunner = {
  Results: TestResults,
  PropList: TestPropList,
  bundle: Test.bundle,
};

export { TestResults, TestPropList };
export default TestRunner;
