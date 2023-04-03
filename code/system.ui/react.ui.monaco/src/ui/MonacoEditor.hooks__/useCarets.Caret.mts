import { t } from './common';

/**
 * Manager of a single caret decorator.
 */
export function Caret(monaco: t.Monaco, editor: t.MonacoCodeEditor, props: t.MonacoEditorCaret) {
  const id = props.id;
  const className = 'foo';

  /**
   * CSS (Style)
   */
  const style = document.createElement('style');
  style.innerHTML = `
    .${className} {
      border-left: 2px solid ${props.color};
    }
  `;
  document.head.appendChild(style);

  /**
   * Decoration
   */
  const { startLineNumber, startColumn, endLineNumber, endColumn } = props.selection;
  const range = new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn);
  const decoration = {
    range,
    options: { className },
  };

  const text = editor.getModel();
  const cursor = text?.deltaDecorations([], [decoration]);

  return {
    id,
    cursor,
    decoration,
  };
}

/**
 * [Helpers]
 */
