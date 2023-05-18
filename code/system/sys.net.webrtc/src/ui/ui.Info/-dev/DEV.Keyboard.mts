import { Keyboard, t } from './common';

export function DevKeyboard(props: t.WebRtcStateLens<t.TDevProps>) {
  Keyboard.on({
    /**
     * Show/hide right-hand side panel.
     */
    'ALT + Backslash'(e) {
      e.handled();
      props.change((d) => (d.showRight = !Boolean(d.showRight)));
    },
  });
}
