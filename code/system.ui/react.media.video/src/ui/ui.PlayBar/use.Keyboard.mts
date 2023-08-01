import { useEffect, useState, useRef } from 'react';

import { DEFAULTS, PlayButton, rx, Keyboard, type t, ProgressBar } from './common';

type Args = {
  enabled?: boolean;
  status?: t.VideoStatus;
  onPlayChange?: t.PlayButtonClickHandler;
  onSeek?: t.PlayBarSeekHandler;
};

/**
 * Hook for listening to keyboard events to control a video playback.
 */
export function useKeyboard(args: Args) {
  const { enabled = true, onPlayChange, onSeek } = args;
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
        Space(e) {
          const status = statusRef.current;
          const toggle: t.PlayButtonStatus = status.is.playing ? 'Pause' : 'Play';
          const args = PlayButton.Wrangle.clickArgs(toggle);
          onPlayChange?.(args);
        },

        ['ArrowLeft']: (e) => jump(-5),
        ['ArrowRight']: (e) => jump(5),
        ['ArrowLeft + Shift']: (e) => jump(-20),
        ['ArrowRight + Shift']: (e) => jump(20),
        ['ArrowLeft + Alt']: (e) => jump(-1),
        ['ArrowRight + Alt']: (e) => jump(1),
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
