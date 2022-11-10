import { useEffect, useRef } from 'react';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { State, t } from '../common';

export function useEditorChangeHandler(instance: t.StateInstance) {
  const change$Ref = useRef(new Subject<string>());
  const state = State.useEvents(instance);
  const current = state.current;

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const dispose$ = new Subject<void>();
    const $ = change$Ref.current;

    $.pipe(takeUntil(dispose$), debounceTime(300)).subscribe(async (code) => {
      await updateStateWithValue(instance, code);
    });

    return () => dispose$.next();
  }, []);

  /**
   * Handlers.
   */
  const changeHandler = async (e: { text: string }) => {
    change$Ref.current.next(e.text);
  };

  /**
   * API
   */
  return {
    state: current,
    changeHandler,
  };
}

/**
 * Helpers
 */

const updateStateWithValue = async (instance: t.StateInstance, code: string) => {
  /**
   * TODO 🐷
   * - Move behind a common "UiState.markdown" static object (eg. UiState.UpdateFromEditor(...))
   */

  const commit = 'Changed by user via code-editor.';

  return State.events(instance, async (events) => {
    await events.change.fire(commit, (draft) => {
      const markdown = draft.markdown ?? (draft.markdown = {});
      const hasSelection = Boolean(draft.selection.index?.path);

      if (hasSelection) {
        markdown.document = code;
      } else {
        markdown.outline = code;
      }
    });
  });
};
