import { slug, type t } from './common';

/**
 * Dispatcher of "command" events for the given item.
 */
export function commands(list?: t.LabelListState) {
  const dispatch = (cmd: t.LabelListCmd) => list?.change((d) => (d.cmd = cmd));
  const api: t.LabelListDispatch = {
    focus() {
      dispatch({ type: 'List:Focus', payload: { tx: slug() } });
    },
  } as const;
  return api;
}
