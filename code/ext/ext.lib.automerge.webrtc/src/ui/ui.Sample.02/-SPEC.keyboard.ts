import { Keyboard, type t } from './common';

/**
 * Monitor keycommands and update the dev-harness shared state.
 */
export function monitorKeyboard(lens: t.Lens<t.HarnessShared>) {
  Keyboard.until(lens.dispose$).on({
    'CMD + Backslash'(e) {
      lens.change((d) => (d.debugPanel = !d.debugPanel));
    },
  });
}
