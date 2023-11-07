import { type t } from './common';
import { List } from './ui.List';

type Props = t.ConnectorProps & { list: t.LabelListState };

export const View: React.FC<Props> = (props) => {
  if (!props.peer || !props.list) return null;
  return <List {...props} />;
};
