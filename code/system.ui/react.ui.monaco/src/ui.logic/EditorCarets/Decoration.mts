import { Is, R, rx, t, Wrangle } from '../common';
import { DecorationStyle } from './Decoration.style.mjs';

/**
 * Manages caret/selection(s) decoration within an editor.
 */
export function CaretDecoration(editor: t.MonacoCodeEditor, id: string): t.EditorCaret {
  const { dispose, dispose$ } = rx.disposable();
  dispose$.subscribe(() => {
    _isDisposed = true;
    Decorations.clear();
    style.dispose();
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

  const style = DecorationStyle(editor, id);

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
        style.update(api);
        changed = true;
      }

      if (typeof args.opacity === 'number') {
        _opacity = R.clamp(0, 1, args.opacity);
        style.update(api);
        changed = true;
      }

      if (args.selections) {
        const selections = Wrangle.asRanges(args.selections);

        type D = t.monaco.editor.IModelDeltaDecoration;
        const decorations = selections.reduce((acc, next) => {
          acc.push({
            range: Wrangle.toRangeEnd(next),
            options: { className: style.caretClass },
          });

          if (!Is.singleCharRange(next)) {
            acc.push({
              range: next,
              options: { className: style.selectionClass },
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

  style.update(api);
  return api;
}
