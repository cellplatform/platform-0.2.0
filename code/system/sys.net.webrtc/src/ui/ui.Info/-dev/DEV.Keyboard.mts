import { Keyboard, t, Dev } from './common';

export function DevKeyboard(props: t.WebRtcStateLens<t.TDevSharedProps>) {
  Keyboard.on({
    /**
     * Show/hide right-hand side panel.
     */
    'ALT + Backslash'(e) {
      e.handled();
      props.change((d) => Dev.toggle(d, 'showRight'));
    },
  });
}
