import { slug, type t } from './common';

/**
 * Issue a command against the item.
 */
export function command(item?: t.LabelItemState) {
  const dispatch = (cmd: t.LabelItemCommand) => item?.change((d) => (d.command = cmd));
  const api = {
    clipboard(action: t.LabelItemClipboard['action']) {
      dispatch({ type: 'Item:Clipboard', payload: { action } });
    },
    keydown(e: t.LabelItemKeyHandlerArgs) {
      dispatch({ type: 'Item:Keydown', payload: e });

      const isMeta = (code: string) => e.is.meta && e.code === code;
      if (isMeta('KeyX')) api.clipboard('Cut');
      if (isMeta('KeyC')) api.clipboard('Copy');
      if (isMeta('KeyV')) api.clipboard('Paste');
    },
    keyup(e: t.LabelItemKeyHandlerArgs) {
      dispatch({ type: 'Item:Keyup', payload: e });
    },
    redraw() {
      dispatch({ type: 'Item:Redraw', payload: { id: slug() } });
    },
  } as const;
  return api;
}
