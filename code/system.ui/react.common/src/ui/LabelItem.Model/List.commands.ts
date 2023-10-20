import { slug, type t } from './common';
import { Dispatcher } from './Dispatcher';

/**
 * Dispatcher of "command" events for the given item.
 */
export function commands(list?: t.LabelListState) {
  const { dispatch } = Dispatcher(list);

  const api: t.LabelListDispatch = {
    focus(focus: boolean = true) {
      dispatch({ type: 'List:Focus', payload: { focus, tx: slug() } });
    },
    blur() {
      api.focus(false);
    },
    select(item, focus = false) {
      dispatch({ type: 'List:Select', payload: { item, focus, tx: slug() } });
    },
    redraw(item) {
      dispatch({ type: 'List:Redraw', payload: { item, tx: slug() } });
    },
  } as const;
  return api;
}