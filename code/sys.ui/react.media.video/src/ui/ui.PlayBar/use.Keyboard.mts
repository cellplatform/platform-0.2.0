import { useEffect, useRef } from 'react';
import { DEFAULTS, Keyboard, PlayButton, rx, type t } from './common';

type Args = {
  enabled?: boolean;
  status?: t.VideoStatus;
  onPlayAction?: t.PlayButtonClickHandler;
  onSeek?: t.PlayBarSeekHandler;
  onMute?: t.PlayBarMuteHandler;
};

/**
 * Hook for listening to keyboard events to control a video playback.
 */
export function useKeyboard(args: Args) {
  const { enabled = true, onPlayAction, onSeek, onMute } = args;
  const statusRef = useRef<t.VideoStatus>(DEFAULTS.status);

  /**
   * Controller
   */
  useEffect(() => {
    statusRef.current = args.status ?? DEFAULTS.status;
  }, [args.status]);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (enabled) {
      const jump = (by: t.Seconds) => {
        const status = statusRef.current;
        const next = status.secs.current + by;
        const seconds = Math.max(0, Math.min(next, status.secs.total));
        onSeek?.({ status, seconds });
      };

      Keyboard.until(dispose$).on({
        ['Space'](e) {
          e.handled();
          const status = statusRef.current;
          const toggle: t.PlayButtonStatus = status.is.playing ? 'Pause' : 'Play';
          const args = PlayButton.Wrangle.clickArgs(toggle);
          onPlayAction?.(args);
        },

        ['KeyM'](e) {
          const status = statusRef.current;
          const muted = !status.is.muted;
          onMute?.({ muted });
        },

        ['ArrowLeft']: (e) => jump(-5),
        ['ArrowRight']: (e) => jump(5),
        ['ArrowLeft + ALT']: (e) => jump(-1),
        ['ArrowRight + ALT']: (e) => jump(1),
        ['ArrowLeft + SHIFT']: (e) => jump(-20),
        ['ArrowRight + SHIFT']: (e) => jump(20),
        ['ArrowLeft + ALT + SHIFT']: (e) => jump(-90),
        ['ArrowRight + ALT + SHIFT']: (e) => jump(90),
      });
    }

    return dispose;
  }, [enabled]);

  /**
   * API
   */
  return {
    enabled,
    status: statusRef.current,
  } as const;
}
