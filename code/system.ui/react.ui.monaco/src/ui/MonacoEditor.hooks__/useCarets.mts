import { useEffect, useState, useRef } from 'react';
import { Caret } from './useCarets.Caret.mjs';
import { t } from './common';

type T = ReturnType<typeof Caret>;

export function useCarets(
  monaco?: t.Monaco,
  editor?: t.MonacoCodeEditor,
  carets?: t.MonacoEditorCaret[],
) {
  const caretsRef = useRef<T[]>([]);
  const editorId = editor?.getId();

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    if (monaco && editor && Array.isArray(carets)) {
      const list = caretsRef.current;

      //
      console.log('carets', carets);

      Caret(monaco, editor, carets[0]);
    }

    return () => {};
  }, [monaco, editorId, carets]);
}
