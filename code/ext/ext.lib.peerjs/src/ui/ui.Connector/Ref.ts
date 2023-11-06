import { LabelItem, type t } from './common';

/**
 * API
 *    A handle for manipulating the <Connector> state.
 *    (Imperative State Handle)
 */
export function ConnectorRef(args: { peer: t.PeerModel; list: t.ConnectorListState }) {
  const { peer, list } = args;
  const get = LabelItem.Model.List.get(list);
  const dispatch = LabelItem.Model.List.commands(list);

  const api: t.ConnectorRef = {
    peer,

    select(target, focus) {
      dispatch.select(get.index(target), focus);
    },
  };

  return api;
}
