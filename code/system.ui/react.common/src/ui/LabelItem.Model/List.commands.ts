import { PatchState, slug, type t } from './common';

/**
 * Dispatcher of "command" events for the given item.
 */
export function commands(list?: t.LabelListState) {
  const dispatch = PatchState.Command.dispatcher(list);

  const api: t.LabelListDispatch = {
    select(item, focus = false) {
      dispatch({ type: 'List:Select', payload: { item, focus, tx: slug() } });
      return api;
    },
    redraw(item) {
      dispatch({ type: 'List:Redraw', payload: { item, tx: slug() } });
      return api;
    },
    remove(index) {
      dispatch({ type: 'List:Remove', payload: { index, tx: slug() } });
      return api;
    },
    focus(focus: boolean = true) {
      dispatch({ type: 'List:Focus', payload: { focus, tx: slug() } });
      return api;
    },
    blur() {
      api.focus(false);
      return api;
    },
  } as const;
  return api;
}
