import { R, t, rx, Wrangle, DEFAULTS } from '../common';

/**
 * Represents a single caret in the editor.
 */
export function Caret(monaco: t.Monaco, editor: t.MonacoCodeEditor, id: string): t.EditorCaret {
  const { dispose, dispose$ } = rx.disposable();
  dispose$.subscribe(() => {
    document.head.removeChild(style);
    removeCursor();
  });

  let _color = 'red';
  let _cursor: string[] | undefined;
  let _position: t.EditorCaretPosition | undefined;

  const editorSelector = Wrangle.editorClassName(editor).split(' ').join('.');
  const className = `caret-${id.replace(/\./g, '-')}`;
  const selector = `.${editorSelector} .${className}`;
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.setAttribute('data-meta', DEFAULTS.className);
  document.head.appendChild(style);

  const updateStyle = () => {
    style.innerHTML = `
    ${selector} {
      border-left: 2px solid ${_color};
    }
  `;
  };

  const removeCursor = () => {
    if (_cursor) getTextModel().deltaDecorations(_cursor, []);
    _position = undefined;
  };
  const getTextModel = () => {
    const model = editor.getModel();
    if (!model) throw new Error(`The editor did not return a text-model.`);
    return model;
  };

  const api: t.EditorCaret = {
    id,
    color: _color,
    dispose,
    dispose$,

    get position() {
      return _position ?? { line: -1, column: -1 };
    },

    change(args) {
      if (args.color) {
        _color = args.color;
        updateStyle();
      }

      if (args.position) {
        const model = getTextModel();
        const coord = Wrangle.asIRange(args.position);
        const range = Wrangle.asRange(monaco, [coord.endLineNumber, coord.endColumn]);
        const cursorDecoration = { range, options: { className } };

        _position = { line: range.endLineNumber, column: range.endColumn };
        _cursor = model.deltaDecorations(_cursor ?? [], [cursorDecoration]);
      }

      if (args.position === null) {
        removeCursor();
      }

      return api;
    },

    eq(input) {
      if (input === null || input === undefined) return _position === undefined;
      const coord = Wrangle.asIRange(input);
      return coord.endLineNumber === _position?.line && coord.endColumn === _position?.column;
    },
  };

  updateStyle();
  return api;
}
