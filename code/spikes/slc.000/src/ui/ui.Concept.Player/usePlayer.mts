import { useEffect, useRef, useState } from 'react';
import { Vimeo, rx, type t } from './common';

type Options = {
  onComplete?: t.ConceptPlayerCompleteHandler;
};

/**
 * TODO
 * - move to [sys.ui.media.Vimeo]
 *
 * Vimeo.usePlayer(...)
 */

export function usePlayer(vimeo: t.VimeoInstance | undefined, options: Options = {}) {
  const busid = useRef(rx.bus.instance(vimeo?.bus));

  const [events, setEvents] = useState<t.VimeoEvents>();
  const [status, setStatus] = useState<t.VimeoStatus>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (vimeo) {
      const events = Vimeo.Events(vimeo, { dispose$ });
      setEvents(events);

      const status$ = events.status.$.pipe(rx.takeUntil(dispose$));
      const playing$ = events.status.playing$.pipe(rx.takeUntil(dispose$));

      // Status
      // (updates while playing).
      events.status.get().then((res) => setStatus(res.status));
      status$.subscribe((e) => setStatus(e));

      // Complete.
      playing$.pipe(rx.filter((e) => e.percent === 1)).subscribe((status) => {
        events?.seek.fire(0);
        options.onComplete?.({ status });
      });
    }
    return dispose;
  }, [busid, vimeo?.id]);

  /**
   * API
   */
  const api: t.VimeoPlayer = {
    ready: Boolean(events),
    events,
    status,
    get playing() {
      return Boolean(status?.playing);
    },
    play() {
      events?.play.fire();
    },
    pause() {
      events?.pause.fire();
    },
    toggle() {
      const playing = api.playing;
      if (playing) api.pause();
      if (!playing) api.play();
    },
    seek(seconds) {
      events?.seek.fire(seconds);
    },
  };
  return api;
}
