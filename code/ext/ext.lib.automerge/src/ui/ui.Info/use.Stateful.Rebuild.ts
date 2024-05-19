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
    draft.document = Array.isArray(draft.document)
      ? draft.document.map((item, i) => document(item, i))
      : document(draft.document, 0);
  }

  function document(draft: t.InfoDataDoc, index: number) {
    if (draft.icon) {
      // Toggle open/close when document icon clicked.
      const bubble = draft.icon.onClick;
      draft.icon.onClick = (e) => {
        state.change((d) => {
          const item = Data.document.item(d.document, index);
          if (item) {
            const object = item.object || (item.object = {});
            object.visible = !Boolean(object.visible ?? true);
          }
        });
        bubble?.(e);
        fire('Toggle:ObjectVisible');
      };
    }
    return draft;
  }

  return {
    visible,
    documents,
  } as const;
}
