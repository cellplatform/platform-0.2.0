import { useEffect, useState } from 'react';
import { distinctUntilChanged, filter, take } from 'rxjs/operators';
import { VimeoEvents, type t, rx } from './common';

/**
 * Monitors a Videmo player providing icon values to display based on various strategies..
 */
export const useIconController = (
  input: t.VimeoInstance,
  options: {
    showPlayPause?: boolean;
    enabled?: boolean;
  } = {},
) => {
  const { enabled = true, showPlayPause = true } = options;
  const busid = rx.bus.instance(input.bus);
  const [current, setCurrent] = useState<t.VimeoIconFlag | undefined>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const events = VimeoEvents(input, { enabled });
    const status$ = events.status.$.pipe();
    const start$ = status$.pipe(filter((e) => e.action === 'start'));
    const loaded$ = status$.pipe(filter((e) => e.action === 'start'));

    let currentVideo: t.VimeoId;
    let isBuffering = false;
    const buffered: t.VimeoId[] = [];
    const isBuffered = () => buffered.includes(currentVideo);

    const getStatus = async () => (await events.status.get()).status;

    loaded$.subscribe((e) => (currentVideo = e.video));
    (async () => {
      const status = await getStatus();
      if (status) currentVideo = status.video;
    })();

    const updatePlayVisibility = async () => {
      if (!showPlayPause) return;
      if (!enabled) {
        setCurrent(undefined);
        return;
      }

      const status = await getStatus();
      const isPlaying = status?.playing ?? false;

      if (!isBuffering) {
        if (!isPlaying) setCurrent('play');
        if (isPlaying) setCurrent(undefined);
      }
    };

    /**
     * Video <ID> changed ("load").
     */
    events.load.res$.subscribe(async (e) => {
      const video = e.status?.video;
      if (video) currentVideo = video;
    });

    /**
     * Play/Pause state changed.
     */
    status$
      .pipe(distinctUntilChanged((prev, next) => prev.playing === next.playing))
      .subscribe(async (e) => {
        await updatePlayVisibility();
      });

    /**
     * Show spinner when buffering new video.
     */
    events.play.req$.pipe(filter((e) => !isBuffered())).subscribe(async (e) => {
      isBuffering = true;
      setCurrent('spinner');
      start$.pipe(take(1)).subscribe(() => {
        setCurrent(undefined);
        buffered.push(currentVideo);
        isBuffering = false;
      });
    });

    updatePlayVisibility();
    return () => events.dispose();
  }, [busid, input.id, enabled, showPlayPause]); // eslint-disable-line

  /**
   * API
   */
  return { enabled, current } as const;
};
