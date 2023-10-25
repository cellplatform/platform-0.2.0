import { PatchState, slug, type t } from './common';

/**
 * Dispatcher of "command" events for the given item.
 */
export function commands(list?: t.LabelListState) {
  const dispatch = PatchState.Command.dispatcher(list);

  const api: t.LabelListDispatch = {
    select(item, focus = false) {
      dispatch({ type: 'List:Select', payload: { item, focus, tx: slug() } });
    },
    redraw(item) {
      dispatch({ type: 'List:Redraw', payload: { item, tx: slug() } });
    },
    remove(item) {
      dispatch({ type: 'List:Remove', payload: { item, tx: slug() } });
    },
    focus(focus: boolean = true) {
      dispatch({ type: 'List:Focus', payload: { focus, tx: slug() } });
    },
    blur() {
      api.focus(false);
    },
  } as const;
  return api;
}
