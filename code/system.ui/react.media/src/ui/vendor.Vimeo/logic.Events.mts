import { firstValueFrom, of, timeout } from 'rxjs';
import { catchError, distinctUntilChanged, filter } from 'rxjs/operators';
import { R, rx, slug, type t } from './common';

/**
 * Event API.
 */
function Events(args: {
  instance?: t.VimeoInstance;
  isEnabled?: boolean;
  dispose$?: t.Observable<any>;
}): t.VimeoEvents {
  const { isEnabled = true } = args;
  const busid = rx.bus.instance(args.instance?.bus);
  const instance = args.instance?.id ?? '';
  const isValid = Boolean(busid && args.instance && instance);
  const bus = rx.busAsType<t.VimeoEvent>(args.instance?.bus ?? rx.bus());
  const is = Events.is;

  const { dispose, dispose$ } = rx.disposable();

  const $ = bus.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => isEnabled),
    rx.filter((e) => is.base(e)),
    rx.filter((e) => e.payload.instance === instance),
  );

  const load: t.VimeoEvents['load'] = {
    req$: rx.payload<t.VimeoLoadReqEvent>($, 'Vimeo/load:req'),
    res$: rx.payload<t.VimeoLoadResEvent>($, 'Vimeo/load:res'),
    async fire(video: t.VimeoId, options = {}) {
      const tx = slug();
      const { timeout: msecs = 1000, muted } = options;
      const first = firstValueFrom(
        load.res$.pipe(
          filter((e) => e.tx === tx),
          timeout(msecs),
          catchError(() => of(`Vimeo load timed out after ${msecs} msecs`)),
        ),
      );
      bus.fire({ type: 'Vimeo/load:req', payload: { tx, instance, video, muted } });
      const res = await first;
      return typeof res === 'string' ? { tx, instance, error: res } : res;
    },
  };

  const status$ = rx.payload<t.VimeoStatusEvent>($, 'Vimeo/status');
  const status: t.VimeoEvents['status'] = {
    $: status$,
    req$: rx.payload<t.VimeoStatusReqEvent>($, 'Vimeo/status:req'),
    res$: rx.payload<t.VimeoStatusResEvent>($, 'Vimeo/status:res'),
    loaded$: status$.pipe(filter((e) => e.action === 'loaded')),
    playing$: status$.pipe(distinctUntilChanged((prev, next) => prev.playing === next.playing)),
    async get(options = {}) {
      const tx = slug();
      const { timeout: msecs = 1000 } = options;
      const first = firstValueFrom(
        status.res$.pipe(
          filter((e) => e.tx === tx),
          timeout(msecs),
          catchError(() => of(`Vimeo status timed out after ${msecs} msecs`)),
        ),
      );
      bus.fire({ type: 'Vimeo/status:req', payload: { tx, instance } });
      const res = await first;
      return typeof res === 'string' ? { tx, instance, error: res } : res;
    },
  };

  const play: t.VimeoEvents['play'] = {
    req$: rx.payload<t.VimeoPlayReqEvent>($, 'Vimeo/play:req'),
    res$: rx.payload<t.VimeoPlayResEvent>($, 'Vimeo/play:res'),
    async fire(options = {}) {
      const tx = slug();
      const { timeout: msecs = 1000 } = options;
      const first = firstValueFrom(
        play.res$.pipe(
          filter((e) => e.tx === tx),
          timeout(msecs),
          catchError(() => of(`Vimeo play timed out after ${msecs} msecs`)),
        ),
      );
      bus.fire({ type: 'Vimeo/play:req', payload: { tx, instance } });
      const res = await first;
      return typeof res === 'string' ? { tx, instance, error: res } : res;
    },
    async toggle() {
      const info = (await status.get()).status;
      const isPlaying = info?.playing ?? false;
      if (isPlaying) pause.fire();
      if (!isPlaying) play.fire();
      return { isPlaying };
    },
  };

  const pause: t.VimeoEvents['pause'] = {
    req$: rx.payload<t.VimeoPauseReqEvent>($, 'Vimeo/pause:req'),
    res$: rx.payload<t.VimeoPauseResEvent>($, 'Vimeo/pause:res'),
    async fire(options = {}) {
      const tx = slug();
      const { timeout: msecs = 1000 } = options;
      const first = firstValueFrom(
        pause.res$.pipe(
          filter((e) => e.tx === tx),
          timeout(msecs),
          catchError(() => of(`Vimeo pause timed out after ${msecs} msecs`)),
        ),
      );
      bus.fire({ type: 'Vimeo/pause:req', payload: { tx, instance } });
      const res = await first;
      return typeof res === 'string' ? { tx, instance, error: res } : res;
    },
  };

  const seek: t.VimeoEvents['seek'] = {
    req$: rx.payload<t.VimeoSeekReqEvent>($, 'Vimeo/seek:req'),
    res$: rx.payload<t.VimeoSeekResEvent>($, 'Vimeo/seek:res'),
    async fire(seconds, options = {}) {
      const tx = slug();
      const { timeout: msecs = 1000 } = options;
      const first = firstValueFrom(
        seek.res$.pipe(
          filter((e) => e.tx === tx),
          timeout(msecs),
          catchError(() => of(`Vimeo seek timed out after ${msecs} msecs`)),
        ),
      );
      bus.fire({ type: 'Vimeo/seek:req', payload: { tx, instance, seconds } });
      const res = await first;
      return typeof res === 'string' ? { tx, instance, error: res } : res;
    },
    async offset(by) {
      const info = (await status.get()).status;
      if (!info) return { seconds: 0 };
      const seconds = R.clamp(0, info.duration, info.seconds + by);
      await seek.fire(seconds);
      return { seconds };
    },
    async start() {
      await seek.fire(0);
    },
    async end() {
      const info = (await status.get()).status;
      await seek.fire(info?.duration ?? 0);
    },
  };

  return {
    instance: { bus: rx.bus.instance(bus), id: instance },
    $,
    is,
    dispose,
    dispose$,
    load,
    status,
    play,
    pause,
    seek,
  };
}

/**
 * Event matching.
 */
const matcher = (startsWith: string) => (input: any) => rx.isEvent(input, { startsWith });
Events.is = { base: matcher('Vimeo/') };

export const VimeoEvents = Events as unknown as t.VimeoEventsFactory;
