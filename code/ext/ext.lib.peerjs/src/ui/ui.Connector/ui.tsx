import { type t } from './common';
import { List } from './ui.List';
import { useKeyboard } from './use.Keyboard';
import { useSelection } from './use.Selection';

type Props = t.ConnectorProps & { list: t.LabelListState };

export const View: React.FC<Props> = (props) => {
  const { list, peer, debug = {}, behavior = {}, onSelectionChange } = props;

  useSelection({ peer, list, onSelectionChange });
  useKeyboard({ list, behavior });

  if (!peer || !list) return null;
  return <List list={list} debug={debug} style={props.style} />;
};
