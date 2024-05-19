import { Value, type t } from './common';
import { Data } from './u';

export type FireChanged = (action: t.InfoStatefulChangeAction) => void;
type State = t.Immutable<t.InfoData>;

/**
 * Override various functions on the {data} object.
 */
export function rebuild(state: State, fire: FireChanged) {
  const overload = overloader(state, fire);
  state.change((draft) => {
    overload.visible(draft);
    overload.documents(draft);
  });
}

/**
 * Helpers
 */
function overloader(state: State, fire: FireChanged) {
  /**
   * Override: root {data.visible}
   */
  function visible(draft: t.InfoData) {
    const bubble = draft.visible?.onToggle;
    const visible = draft.visible || (draft.visible = { value: true });
    if (visible.value === undefined) visible.value = true;
    visible.onToggle = (e) => {
      state.change((d) => {
        const visible = d.visible || (d.visible = { value: true });
        Value.toggle(visible, 'value');
      });
      fire('Toggle:Visible');
      bubble?.(e);
    };
  }

  /**
   * Override: {data.document}
   */
  function documents(draft: t.InfoData) {
    if (!draft.document) return;
    const docs = Data.document.list(draft.document);
    docs.map((_, i) => document(docs, i));
  }

  function document(docs: t.InfoDataDoc[], index: number) {
    const doc = docs[index];
    if (doc.icon) {
      /**
       * Toggle open/close when document icon clicked.
       */
      const bubble = doc.icon.onClick;
      const toggle = (index: number, isVisible?: boolean) => {
        let res = false;
        state.change((d) => {
          const item = Data.document.item(d.document, index);
          if (item) {
            const object = item.object || (item.object = {});
            object.visible = isVisible ?? !Boolean(object.visible ?? true);
            res = object.visible;
          }
        });
        return res;
      };

      doc.icon.onClick = (e) => {
        const isVisible = toggle(index);
        if (e.modifiers.meta) {
          docs.forEach((_, i) => {
            if (i !== index) toggle(i, isVisible);
          });
        }
        bubble?.(e);
        fire('Toggle:ObjectVisible');
      };
    }
    return doc;
  }

  return {
    visible,
    documents,
  } as const;
}
