import { useEffect } from 'react';
import { DEFAULTS, Keyboard, useFocus, type t } from '../common';

/**
 * Hook to manage paste operations.
 */
export function usePaste(ref: React.RefObject<HTMLDivElement>, props: t.ImageProps) {
  const enabled = props.paste?.enabled ?? DEFAULTS.paste.enabled;
  const tabIndex = !enabled ? -1 : props.paste?.tabIndex ?? DEFAULTS.paste.tabIndex;
  const focus = useFocus(ref);
  const focused = enabled ? focus.containsFocus : false;

  /**
   * Clear focus on Escape key.
   */
  useEffect(() => {
    const keyboard = Keyboard.on('Escape', (e) => {
      if (focused && enabled && ref.current) ref.current.blur();
    });

    return () => keyboard.dispose();
  }, [ref.current, focused, enabled]);

  return {
    tabIndex,
    is: { enabled, focused },
  };
}
