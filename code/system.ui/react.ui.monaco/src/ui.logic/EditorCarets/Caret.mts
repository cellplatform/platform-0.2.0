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
  let _opacity = 0.6;
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
      opacity: ${_opacity};
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
    dispose,
    dispose$,

    get position() {
      return _position ?? { line: -1, column: -1 };
    },

    get color() {
      return _color;
    },

    get opacity() {
      return _opacity;
    },

    /**
     * Change the caret state.
     */
    change(args) {
      let styleChanged = false;
      if (typeof args.color === 'string') {
        _color = args.color;
        styleChanged = true;
      }

      if (typeof args.opacity === 'number') {
        _opacity = R.clamp(0, 1, args.opacity);
        styleChanged = true;
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

      if (styleChanged) updateStyle();
      return api;
    },

    /**
     * Compare the given args with the current state.
     */
    eq(args) {
      if (args.position === null) {
        if (!_position) return false;
      }

      if (args.position) {
        const coord = Wrangle.asIRange(args.position);
        if (coord.endLineNumber !== _position?.line) return false;
        if (coord.endColumn !== _position?.column) return false;
      }

      if (typeof args.color === 'string') {
        if (args.color !== _color) return false;
      }

      if (typeof args.opacity === 'number') {
        if (args.opacity !== _opacity) return false;
      }

      return true;
    },
  };

  updateStyle();
  return api;
}
