import { Is, R, t, rx, Wrangle, DEFAULTS } from '../common';

/**
 * Represents a single caret in the editor.
 */
export function Caret(editor: t.MonacoCodeEditor, id: string): t.EditorCaret {
  const { dispose, dispose$ } = rx.disposable();
  dispose$.subscribe(() => {
    _isDisposed = true;
    document.head.removeChild(style);
    Decorations.clear();
    fireChanged();
    $.complete();
  });

  let _isDisposed = false;
  let _color = 'red';
  let _opacity = 0.6;
  let _refs: string[] = [];
  let _selections: t.EditorRange[] = [];

  const $ = new rx.Subject<t.EditorCaretChanged>();
  const fireChanged = () =>
    $.next({
      id,
      current: [...api.selections],
      disposed: _isDisposed,
    });

  const editorSelector = Wrangle.editorClassName(editor).split(' ').join('.');
  const caretClass = `caret-${id.replace(/\./g, '-')}`;
  const selectionClass = `selection-${id.replace(/\./g, '-')}`;
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.setAttribute('data-meta', DEFAULTS.className);
  document.head.appendChild(style);

  const updateStyle = () => {
    style.innerHTML = `
    ${`.${editorSelector} .${caretClass}`} {
      opacity: ${_opacity};
      border-right: 2px solid ${_color};
    }
    ${`.${editorSelector} .${selectionClass}`} {
      opacity: ${0.05};
      background-color: ${_color};
    }
  `;
  };

  const Decorations = {
    add(decorations: t.monaco.editor.IModelDeltaDecoration[]) {
      _refs = TextModel.get().deltaDecorations(_refs, decorations);
    },
    clear() {
      if (_refs.length > 0) _refs = TextModel.get().deltaDecorations(_refs, []);
      _selections = [];
    },
  };

  const TextModel = {
    get() {
      const model = editor.getModel();
      if (!model) throw new Error(`The editor did not return a text-model`);
      return model;
    },
  };

  const api: t.EditorCaret = {
    id,
    $: $.pipe(rx.takeUntil(dispose$)),

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
      let changed = false;

      if (typeof args.color === 'string') {
        _color = args.color;
        updateStyle();
        changed = true;
      }

      if (typeof args.opacity === 'number') {
        _opacity = R.clamp(0, 1, args.opacity);
        updateStyle();
        changed = true;
      }

      if (args.selections) {
        const selections = Wrangle.asRanges(args.selections);

        type D = t.monaco.editor.IModelDeltaDecoration;
        const decorations = selections.reduce((acc, next) => {
          acc.push({
            range: Wrangle.toRangeEnd(next),
            options: { className: caretClass },
          });

          if (!Is.singleCharRange(next)) {
            acc.push({
              range: next,
              options: { className: selectionClass },
            });
          }

          return acc;
        }, [] as D[]);

        Decorations.add(decorations);
        _selections = selections;
        changed = true;
      }

      if (args.selections === null) {
        Decorations.clear();
        changed = true;
      }

      if (changed) fireChanged();
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
        const selections = Wrangle.asRanges(args.selections);
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

    /**
     * Lifecycle.
     */
    dispose,
    dispose$,
    get disposed() {
      return _isDisposed;
    },
  };

  updateStyle();
  return api;
}
