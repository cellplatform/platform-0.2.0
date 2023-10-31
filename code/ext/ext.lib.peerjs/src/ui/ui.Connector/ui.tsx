import { type t } from './common';
import { List } from './ui.List';
import { useKeyboard } from './use.Keyboard';
import { useListState } from './use.ListState';

export const View: React.FC<t.ConnectorProps> = (props) => {
  const { peer, debug = {}, behavior = {} } = props;
  const { list } = useListState(peer, props.onReady);
  useKeyboard({ list, behavior });

  if (!peer || !list) return null;
  return <List list={list} debug={debug} style={props.style} />;
};
