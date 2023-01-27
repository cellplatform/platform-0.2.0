import { useEffect, useRef } from 'react';
import { debounceTime } from 'rxjs/operators';

import { State, t, rx } from '../common';

export function useEditorChangeHandler(instance: t.Instance) {
  const changeRef$ = useRef(new rx.Subject<string>());
  const state = State.useState(instance);

  /**
   * Lifecycle.
   */
  useEffect(() => {
    const events = State.Bus.Events({ instance });
    const $ = changeRef$.current.pipe(rx.takeUntil(events.dispose$));

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
    changeHandler,
    get state() {
      return state.current;
    },
  };
}
