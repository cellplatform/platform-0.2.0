import { slug, type t } from './common';

/**
 * Dispatcher of "command" events for the given item.
 */
export function commands(list?: t.LabelListState) {
  const dispatch = (cmd: t.LabelListCmd) => list?.change((d) => (d.cmd = cmd));
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
  } as const;
  return api;
}
