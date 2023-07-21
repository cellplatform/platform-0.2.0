import VimeoPlayer from '@vimeo/player';
import { useEffect, useRef, useState } from 'react';
import { VimeoEvents } from '../Vimeo.Events.mjs';
import { Delete, R, Time, rx, slug, type t } from '../common';

type Times = { duration: number; percent: number; seconds: number };
type Action = t.VimeoStatus['action'];

/**
 * Event-bus controller for a Vimeo player.
 */
export function usePlayerController(args: {
  instance: t.VimeoInstance;
  video: number;
  player?: VimeoPlayer;
}) {
  const seekRef = useRef<number | undefined>();
  const playing = useRef<boolean>(false);
  const loading = useRef<number | undefined>(); // Video-ID.
  const [opacity, setOpacity] = useState<number>(0);

  const { player, video } = args;
  const instance = args.instance.id;

  /**
   * Lifecycle
   */
  useEffect(() => {
    const bus = rx.busAsType<t.VimeoEvent>(args.instance.bus);
    const events = VimeoEvents({ instance: args.instance });

    const getTimes = async (): Promise<Times> => {
      if (!player) return { duration: -1, percent: -1, seconds: -1 };
      const duration = await player.getDuration();
      const seconds = await player.getCurrentTime();
      const percent = duration === 0 ? 0 : seconds / duration;
      return { duration, seconds, percent };
    };

    const getStatus = async () => toStatus('info', await getTimes());

    const toStatus = async (action: Action, times: Times): Promise<t.VimeoStatus> => {
      return Delete.undefined({
        instance,
        action,
        ...times,
        video: (await player?.getVideoId()) ?? video,
        percent: Math.min(times.percent, 1),
        playing: playing.current,
        ended: times.seconds >= times.duration,
      });
    };

    const fireStatus = async (action: Action, times: Times) => {
      if (loading.current && action !== 'loaded') return;
      bus.fire({
        type: 'Vimeo/status',
        payload: await toStatus(action, times),
      });
    };

    const initLoad = async () => {
      loading.current = video;
      setOpacity(0);

      // HACK: Force load the video's first frame by playing then immediately stopping.
      //       This allows seeking behavior to work correctly, whereby changes to
      //       the "seek" position nothing until the video has started playing.

      /**
       * NOTE - This will fail if the user has not interactived with the document.
       *        See:
       *          https://developer.chrome.com/blog/autoplay
       */

      // await events.play.fire();
      // await events.pause.fire();
      // await events.seek.fire(0);
      // await time.wait(10);

      loading.current = undefined;
      setOpacity(1);
    };

    const onLoaded = async () => {
      fireStatus('loaded', await getTimes());
    };

    const onUpdate = (data: Times) => {
      const status: Action = seekRef.current !== undefined ? 'seek' : 'update';

      fireStatus(status, data);
      seekRef.current = undefined;
    };
    const onPlay = (data: Times) => {
      const wasPlaying = playing.current;
      playing.current = true;
      if (!wasPlaying) fireStatus('start', data);
    };
    const onPause = (data: Times) => {
      const wasPlaying = playing.current;
      playing.current = false;
      if (wasPlaying) fireStatus('stop', data);
    };
    const onEnd = (data: Times) => {
      playing.current = false;
      fireStatus('end', data);
    };

    if (player) {
      player.on('loaded', onLoaded);
      player.on('play', onPlay);
      player.on('timeupdate', onUpdate);
      player.on('pause', onPause);
      player.on('ended', onEnd);

      /**
       * Contoller: Status.
       */
      events.status.req$.subscribe(async (e) => {
        const { tx = slug() } = e;
        const status = await getStatus();
        bus.fire({
          type: 'Vimeo/status:res',
          payload: { tx, instance, status },
        });
      });

      /**
       * Controller: Load.
       */
      events.load.req$.subscribe(async (e) => {
        const { tx = slug() } = e;

        const current = await player.getVideoId();
        const isLoaded = current === e.video;

        if (!isLoaded) await player.loadVideo(e.video);
        if (e.muted !== undefined) await player.setMuted(e.muted);

        await initLoad();

        /**
         * TODO 🐷
         * - perform "Play/Stop" (seek fix) HACK here
         *   not on the [onLoaded] handler
         */

        bus.fire({
          type: 'Vimeo/load:res',
          payload: {
            tx,
            instance,
            action: isLoaded ? 'none:already-loaded' : 'loaded',
            status: await getStatus(),
          },
        });
      });

      /**
       * Controller: Play.
       */
      events.play.req$.subscribe(async (e) => {
        const { tx = slug() } = e;
        await player.play();
        await Time.wait(1); // NB: Allow a tick to prevent "pause" (or other actions performed immediately after) from erroring.
        bus.fire({ type: 'Vimeo/play:res', payload: { tx, instance } });
      });

      /**
       * Controller: Pause.
       */
      events.pause.req$.subscribe(async (e) => {
        const { tx = slug() } = e;
        await player.pause();
        bus.fire({ type: 'Vimeo/pause:res', payload: { tx, instance } });
      });

      /**
       * Contoller: Seek.
       */
      events.seek.req$.subscribe(async (e) => {
        const { tx = slug() } = e;
        const secs = R.clamp(0, await player.getDuration(), e.seconds);
        seekRef.current = secs;
        await player.setCurrentTime(secs);
        bus.fire({ type: 'Vimeo/seek:res', payload: { tx, instance } });
      });
    }

    return () => {
      /**
       * Dispose.
       */
      if (player) {
        player.off('loaded', onLoaded);
        player.off('play', onPlay);
        player.off('timeupdate', onUpdate);
        player.off('pause', onPause);
        player.off('ended', onEnd);
      }
      events.dispose();
    };
  }, [args.instance.bus, instance, player]); // eslint-disable-line

  // Finish up.
  return {
    instance: { bus: rx.bus.instance(args.instance.bus), id: instance },
    opacity,
  };
}
