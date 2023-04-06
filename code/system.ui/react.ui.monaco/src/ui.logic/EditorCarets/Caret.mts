import { R, t, rx, Wrangle, DEFAULTS } from '../common';

/**
 * Represents a single caret in the editor.
 */
export function Caret(editor: t.MonacoCodeEditor, id: string): t.EditorCaret {
  const { dispose, dispose$ } = rx.disposable();
  dispose$.subscribe(() => {
    document.head.removeChild(style);
    removeCursor();
  });

  let _color = 'red';
  let _opacity = 0.6;
  let _cursor: string[] | undefined;
  let _selections: t.EditorRange[] = [];

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
    _selections = [];
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

    get selections() {
      return _selections ?? [];
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

      if (args.selections) {
        const model = getTextModel();
        const selections = Wrangle.selections(args.selections);

        type D = t.monaco.editor.IModelDeltaDecoration;
        const decorations = selections.reduce((acc, next) => {
          acc.push({
            range: Wrangle.toRangeEnd(next),
            options: { className },
          });
          return acc;
        }, [] as D[]);

        _cursor = model.deltaDecorations(_cursor ?? [], decorations);
        _selections = selections;
      }

      if (args.selections === null) {
        removeCursor();
      }

      if (styleChanged) updateStyle();
      return api;
    },

    /**
     * Compare the given args with the current state.
     */
    eq(args) {
      if (args.selections === null) {
        if (!_selections) return false;
      }

      if (args.selections) {
        const selections = Wrangle.selections(args.selections);
        if (!R.equals(selections, _selections)) return false;
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
