import { type t } from '../common';
import { useController } from '../hooks/useController.mjs';
import { TestRunner, type TestRunnerProps } from './TestRunner';

export type TestRunnerControlledProps = Omit<TestRunnerProps, 'data'> & {
  initial?: t.TestPropListData;
  onChanged?: (e: t.TestPropListChange) => void;
};

export const TestRunnerControlled: React.FC<TestRunnerControlledProps> = (props) => {
  const { initial, onChanged } = props;
  const controller = useController({ initial, onChanged });
  return <TestRunner {...props} data={controller.data} />;
};
