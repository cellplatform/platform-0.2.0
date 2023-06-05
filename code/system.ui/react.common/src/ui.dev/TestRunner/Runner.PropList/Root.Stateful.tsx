import { type t } from './common';
import { useController } from './hooks/useController.mjs';
import { PropList } from './ui/PropList';

import type { TestPropListProps } from './ui/PropList';

export type TestPropListStatefulProps = Omit<TestPropListProps, 'data'> & {
  initial?: t.TestRunnerPropListData;
  onChanged?: (e: t.TestRunnerPropListChange) => void;
};

export const TestPropListStateful: React.FC<TestPropListStatefulProps> = (props) => {
  const { initial, onChanged } = props;
  const controller = useController({ initial, onChanged });
  return <PropList {...props} data={controller.data} />;
};
