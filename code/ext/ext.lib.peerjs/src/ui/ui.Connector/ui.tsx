import { useEffect, useState } from 'react';
import { Model, rx, type t } from './common';
import { List } from './ui.List';

export const View: React.FC<t.ConnectorProps> = (props) => {
  const { peer, debug } = props;
  const [list, setList] = useState<t.LabelListState>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const { dispose$, dispose } = rx.disposable();
    if (peer) {
      const model = Model.List.init(peer, { dispose$ });
      setList(model.list);
    }
    return dispose;
  }, [peer?.id]);

  /**
   * Render
   */
  if (!peer || !list) return null;
  return <List list={list} debug={debug} style={props.style} />;
};
