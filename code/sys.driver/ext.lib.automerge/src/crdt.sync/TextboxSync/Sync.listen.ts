import { TextboxSync } from 'sys.ui.react.common';
import { Doc, type t } from './common';

type O = Record<string, unknown>;

/**
 * Sync listener.
 */
export function listen<T extends O>(
  textbox: t.TextInputRef,
  state: t.Doc<T> | t.Lens<T>,
  path: t.ObjectPath,
  options: { dispose$?: t.UntilObservable; debug?: string } = {},
) {
  const { splice, diff } = Doc.Text;
  return TextboxSync.listen(textbox, state, path, { ...options, splice, diff });
}
