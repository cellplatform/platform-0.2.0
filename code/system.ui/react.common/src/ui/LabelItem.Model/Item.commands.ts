import { PatchState, slug, type t } from './common';

/**
 * Dispatcher of "command" events for the given item.
 */
export function commands(item?: t.LabelItemState) {
  const dispatch = PatchState.Command.dispatcher(item);

  const api: t.LabelItemDispatch = {
    redraw() {
      dispatch({ type: 'Item:Redraw', payload: { tx: slug() } });
      return api;
    },

    changed(e: t.LabelItemStateChangedHandlerArgs) {
      dispatch({ type: 'Item:Changed', payload: { ...e, tx: slug() } });
      return api;
    },

    action(e: t.LabelItemActionHandlerArgs) {
      dispatch({ type: 'Item:Action', payload: { ...e, tx: slug() } });
      return api;
    },

    click(e: t.LabelItemClickHandlerArgs) {
      dispatch({ type: 'Item:Click', payload: { ...e, tx: slug() } });
      return api;
    },

    /**
     * Clipboard related actions.
     */
    clipboard(action: t.LabelItemClipboard['action']) {
      dispatch({ type: 'Item:Clipboard', payload: { action, tx: slug() } });
      return api;
    },

    /**
     * Keyboard related actions.
     */
    key: {
      down(e: t.LabelItemKeyHandlerArgs) {
        dispatch({ type: 'Item:Keydown', payload: { ...e, tx: slug() } });
        const meta = (code: string) => e.is.meta && e.code === code;
        if (meta('KeyX')) api.clipboard('Cut');
        if (meta('KeyC')) api.clipboard('Copy');
        if (meta('KeyV')) api.clipboard('Paste');
        return api;
      },
      up(e: t.LabelItemKeyHandlerArgs) {
        dispatch({ type: 'Item:Keyup', payload: { ...e, tx: slug() } });
        return api;
      },
    },
  } as const;
  return api;
}
