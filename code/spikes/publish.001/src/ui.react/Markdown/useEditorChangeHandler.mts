import { useEffect, useRef } from 'react';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { State, t } from '../common';

export function useEditorChangeHandler(instance: t.StateInstance) {
  const changeRef$ = useRef(new Subject<string>());
  const state = State.useState(instance);

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const events = State.Bus.Events({ instance });
    const $ = changeRef$.current.pipe(takeUntil(events.dispose$));

    $.pipe(debounceTime(300)).subscribe(async (code) => {
      State.Change.updateMarkdownFromEditor(events, code);
    });

    return () => events.dispose();
  }, [instance.id]);

  /**
   * Handlers.
   */
  const changeHandler = async (e: { text: string }) => {
    changeRef$.current.next(e.text);
  };

  /**
   * API
   */
  return {
    state: state.current,
    changeHandler,
  };
}
