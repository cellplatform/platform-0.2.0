import { PatchState, slug, type t } from './common';

/**
 * Dispatcher of "command" events for the given item.
 */
export function commands(item?: t.LabelItemState) {
  const dispatch = PatchState.Command.dispatcher(item);

  const api: t.LabelItemDispatch = {
    redraw() {
      dispatch({
        type: 'Item:Redraw',
        payload: { tx: slug() },
      });
    },

    changed(e) {
      dispatch({
        type: 'Item:Changed',
        payload: { ...e, tx: slug() },
      });
    },

    action(e) {
      dispatch({
        type: 'Item:Action',
        payload: { ...e, tx: slug() },
      });
    },

    click(e) {
      dispatch({
        type: 'Item:Click',
        payload: { ...e, tx: slug() },
      });
    },

    edit(action) {
      let cancelled = false;
      const payload: t.LabelItemEditCmdArgs = {
        action,
        tx: slug(),
        get cancelled() {
          return cancelled;
        },
        cancel() {
          cancelled = true;
        },
      };
      dispatch({ type: 'Item:Edit', payload });
    },

    edited(action) {
      const label = item?.current.label ?? '';
      dispatch({
        type: 'Item:Edited',
        payload: { action, label, tx: slug() },
      });
    },

    /**
     * Clipboard related actions.
     */
    clipboard(action) {
      dispatch({
        type: 'Item:Clipboard',
        payload: { action, tx: slug() },
      });
    },

    /**
     * Keyboard related actions.
     */
    key: {
      down(e: t.LabelItemKeyHandlerArgs) {
        dispatch({ type: 'Item:Keydown', payload: { ...e, tx: slug() } });
        if (e.is.cut) api.clipboard('Cut');
        if (e.is.copy) api.clipboard('Copy');
        if (e.is.paste) api.clipboard('Paste');
      },
      up(e: t.LabelItemKeyHandlerArgs) {
        dispatch({ type: 'Item:Keyup', payload: { ...e, tx: slug() } });
      },
    },
  } as const;
  return api;
}
