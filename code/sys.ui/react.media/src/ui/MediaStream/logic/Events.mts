import { rx, slug, type t } from '../common';

type E = t.MediaStreamEvent | t.MediaStreamsEvent | t.MediaStreamRecordEvent;

/**
 * Helpers for working with <VideoStream> events.
 */
export function MediaStreamEvents(eventbus: t.EventBus<any>): t.MediaStreamEvents {
  const { dispose, dispose$ } = rx.disposable();
  const bus = rx.busAsType<E>(eventbus);
  const event$ = bus.$.pipe(rx.takeUntil(dispose$));

  /**
   * START
   */
  const start = (ref: string) => {
    const start$ = rx
      .payload<t.MediaStreamStartEvent>(event$, 'MediaStream/start')
      .pipe(rx.filter((e) => e.ref === ref));

    const video$ = start$.pipe(rx.filter((e) => e.kind === 'video'));
    const screen$ = start$.pipe(rx.filter((e) => e.kind === 'screen'));

    const fire = (kind: t.MediaStreamStart['kind']) => {
      const tx = slug();
      const res = rx.firstValueFrom(started(ref).$.pipe(rx.filter((e) => e.tx === tx)));
      bus.fire({ type: 'MediaStream/start', payload: { kind, tx, ref } });
      return res;
    };

    return {
      ref,
      start$,
      video$,
      screen$,
      video: () => fire('video'),
      screen: () => fire('screen'),
    };
  };

  const started = (ref: string) => {
    const $ = rx
      .payload<t.MediaStreamStartedEvent>(event$, 'MediaStream/started')
      .pipe(rx.filter((e) => e.ref === ref));
    return { ref, $ };
  };

  /**
   * STOP
   */
  const stop = (ref: string) => {
    const $ = rx
      .payload<t.MediaStreamStopEvent>(event$, 'MediaStream/stop')
      .pipe(rx.filter((e) => e.ref === ref));

    const fire = () => {
      const res = rx.firstValueFrom(stopped(ref).$);
      bus.fire({ type: 'MediaStream/stop', payload: { ref } });
      return res;
    };

    return { ref, $, fire };
  };

  const stopped = (ref: string) => {
    const $ = rx
      .payload<t.MediaStreamStoppedEvent>(event$, 'MediaStream/stopped')
      .pipe(rx.filter((e) => e.ref === ref));
    return { ref, $ };
  };

  /**
   * STATUS
   */
  const status = (ref: string) => {
    const req$ = rx
      .payload<t.MediaStreamStatusReqEvent>(event$, 'MediaStream/status:req')
      .pipe(rx.filter((e) => e.ref === ref));

    const res$ = rx
      .payload<t.MediaStreamStatusResEvent>(event$, 'MediaStream/status:res')
      .pipe(rx.filter((e) => e.ref === ref));

    const get = () => {
      const res = rx.firstValueFrom(res$);
      bus.fire({ type: 'MediaStream/status:req', payload: { ref } });
      return res;
    };

    return { ref, get, req$, res$ };
  };

  const all = {
    status() {
      const req$ = rx
        .payload<t.MediaStreamsStatusReqEvent>(event$, 'MediaStreams/status:req')
        .pipe();
      const res$ = rx
        .payload<t.MediaStreamsStatusResEvent>(event$, 'MediaStreams/status:res')
        .pipe();

      const get = (kind?: t.MediaStreamKind) => {
        const res = rx.firstValueFrom(res$);
        bus.fire({ type: 'MediaStreams/status:req', payload: { kind } });
        return res;
      };

      return { get, req$, res$ };
    },
  };

  /**
   * Record
   */
  const record = (input: string | MediaStream) => {
    const ref = typeof input === 'string' ? input : input.id;
    const start$ = rx
      .payload<t.MediaStreamRecordStartEvent>(event$, 'MediaStream/record/start')
      .pipe(rx.filter((e) => e.ref === ref));
    const started$ = rx
      .payload<t.MediaStreamRecordStartedEvent>(event$, 'MediaStream/record/started')
      .pipe(rx.filter((e) => e.ref === ref));

    const interrupt$ = rx
      .payload<t.MediaStreamRecordInterruptEvent>(event$, 'MediaStream/record/interrupt')
      .pipe(rx.filter((e) => e.ref === ref));
    const interrupted$ = rx
      .payload<t.MediaStreamRecordInterruptedEvent>(event$, 'MediaStream/record/interrupted')
      .pipe(rx.filter((e) => e.ref === ref));

    const stop$ = rx
      .payload<t.MediaStreamRecordStopEvent>(event$, 'MediaStream/record/stop')
      .pipe(rx.filter((e) => e.ref === ref));
    const stopped$ = rx
      .payload<t.MediaStreamRecordStoppedEvent>(event$, 'MediaStream/record/stopped')
      .pipe(rx.filter((e) => e.ref === ref));

    const start = () => {
      const res = rx.firstValueFrom(started$);
      bus.fire({ type: 'MediaStream/record/start', payload: { ref } });
      return res;
    };

    const stop = (
      args: {
        download?: t.MediaStreamRecordStop['download'];
        onData?: t.MediaStreamRecordStop['onData'];
      } = {},
    ) => {
      const { download, onData } = args;
      const res = rx.firstValueFrom(stopped$);
      bus.fire({
        type: 'MediaStream/record/stop',
        payload: { ref, download, onData },
      });
      return res;
    };

    const pause = () => interrupt('pause');
    const resume = () => interrupt('resume');
    const interrupt = (action: t.MediaStreamRecordInterruptAction) => {
      const res = rx.firstValueFrom(interrupted$.pipe(rx.filter((e) => e.action === action)));
      bus.fire({ type: 'MediaStream/record/interrupt', payload: { ref, action } });
      return res;
    };

    const status = {
      req$: rx
        .payload<t.MediaStreamRecordStatusReqEvent>(event$, 'MediaStream/record/status:req')
        .pipe(rx.filter((e) => e.ref === ref)),
      res$: rx
        .payload<t.MediaStreamRecordStatusResEvent>(event$, 'MediaStream/record/status:res')
        .pipe(rx.filter((e) => e.ref === ref)),

      async get() {
        const tx = slug();
        const res = rx.firstValueFrom(status.res$.pipe(rx.filter((e) => e.tx === tx)));
        bus.fire({ type: 'MediaStream/record/status:req', payload: { ref, tx } });
        return res;
      },
    };

    return {
      ref,
      status,

      start,
      start$,
      started$,

      stop,
      stop$,
      stopped$,

      interrupt$,
      interrupted$,
      interrupt,

      pause,
      resume,
    };
  };

  return {
    dispose,
    dispose$,
    start,
    started,
    stop,
    stopped,
    status,
    record,
    all,
  };
}
