import { type t } from './common';
import { List } from './ui.List';

type Props = t.ConnectorProps & { list: t.LabelListState };

export const View: React.FC<Props> = (props) => {
  const { peer, list } = props;
  if (!peer || !list) return null;
  return <List {...props} peer={peer} />;
};
