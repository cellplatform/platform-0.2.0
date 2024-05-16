import { Value, type t } from './common';
import { Data } from './u';

type State = t.Immutable<t.InfoData>;

/**
 * Override various functions on the {data} object.
 */
export function rebuild(state: State, fireChanged: (action: t.InfoStatefulChangeAction) => void) {
  /**
   * Override: {data.document}
   */
  const overloadDocument = (draft: t.InfoDataDoc, index: number): t.InfoDataDoc => {
    if (draft.icon) {
      /**
       * Toggle open/close icon clicks for the document.
       */
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
        fireChanged('Toggle:ObjectVisible');
      };
    }

    return draft;
  };

  /**
   * Override: {data.visible}
   */
  const overloadVisible = (draft: t.InfoData) => {
    const bubble = draft.visible?.onToggle;
    const visible = draft.visible || (draft.visible = { value: true });
    if (visible.value === undefined) visible.value = true;
    visible.onToggle = (e) => {
      state.change((d) => {
        const visible = d.visible || (d.visible = { value: true });
        Value.toggle(visible, 'value');
      });
      fireChanged('Toggle:Visible');
      bubble?.(e);
    };
  };

  /**
   * Update
   */
  state.change((draft) => {
    overloadVisible(draft);
    if (draft.document) {
      draft.document = Array.isArray(draft.document)
        ? draft.document.map((item, i) => overloadDocument(item, i))
        : overloadDocument(draft.document, 0);
    }
  });
}
