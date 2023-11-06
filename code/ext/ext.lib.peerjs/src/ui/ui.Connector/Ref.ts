import { LabelItem, type t } from './common';

/**
 * API
 *    A handle for manipulating the <Connector> state.
 *    (Imperative State Handle)
 */
export function ConnectorRef(args: { peer: t.PeerModel; list: t.ConnectorListState }) {
  const { peer, list } = args;
  const dispatch = LabelItem.Model.List.commands(list);

  const api: t.ConnectorRef = {
    peer,

    /**
     * List methods.
     */
    select: dispatch.select,
    edit: dispatch.edit,
    redraw: dispatch.redraw,
    remove: dispatch.remove,
    focus: dispatch.focus,
    blur: dispatch.blur,
  };

  return api;
}
