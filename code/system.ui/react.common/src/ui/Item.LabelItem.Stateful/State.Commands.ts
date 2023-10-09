import { slug, type t } from './common';

/**
 * Issue a command against the item.
 */
export function commands(item?: t.LabelItemState) {
  const dispatch = (cmd: t.LabelItemCommand) => item?.change((d) => (d.command = cmd));
  const api = {
    clipboard(action: t.LabelItemClipboard['action']) {
      dispatch({ type: 'Item:Clipboard', payload: { action } });
    },
    key: {
      down(e: t.LabelItemKeyHandlerArgs) {
        dispatch({ type: 'Item:Keydown', payload: e });
        const meta = (code: string) => e.is.meta && e.code === code;
        if (meta('KeyX')) api.clipboard('Cut');
        if (meta('KeyC')) api.clipboard('Copy');
        if (meta('KeyV')) api.clipboard('Paste');
      },
      up: (e: t.LabelItemKeyHandlerArgs) => dispatch({ type: 'Item:Keyup', payload: e }),
    },
    redraw() {
      dispatch({ type: 'Item:Redraw', payload: { tx: slug() } });
    },
  } as const;
  return api;
}
