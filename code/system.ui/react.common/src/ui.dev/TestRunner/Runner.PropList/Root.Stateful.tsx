import { t } from './common';
import { PropList } from './ui/PropList';
import { useController } from './hooks/useController.mjs';

import type { TestRunnerPropListProps } from './ui/PropList';

export type StatefulProps = Omit<TestRunnerPropListProps, 'data'> & {
  initial?: t.TestRunnerPropListData;
  onChanged?: (e: t.TestRunnerPropListChange) => void;
};

export const Stateful: React.FC<StatefulProps> = (props) => {
  const { initial, onChanged } = props;
  const ctrl = useController({ initial, onChanged });
  return <PropList {...props} data={ctrl.data} />;
};
