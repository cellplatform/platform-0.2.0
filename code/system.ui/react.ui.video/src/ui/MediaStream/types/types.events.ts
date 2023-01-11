import { t } from './common';

export * from './types.events.record';
export * from './types.events.stream';
export * from './types.events.streams';

/**
 * EVENTS
 */
export type MediaEvent = t.MediaStreamEvent | t.MediaStreamsEvent | t.MediaStreamRecordEvent;

/**
 * Event API
 */
export type MediaStreamEvents = t.Disposable & {
  start(ref: string): {
    ref: string;
    start$: t.Observable<t.MediaStreamStart>;
    video$: t.Observable<t.MediaStreamStart>;
    screen$: t.Observable<t.MediaStreamStart>;
    video(): Promise<t.MediaStreamStarted>;
    screen(): Promise<t.MediaStreamStarted>;
  };
  started(ref: string): {
    ref: string;
    $: t.Observable<t.MediaStreamStarted>;
  };

  stop(ref: string): {
    ref: string;
    $: t.Observable<t.MediaStreamStop>;
    fire(): Promise<t.MediaStreamStopped>;
  };
  stopped(ref: string): {
    ref: string;
    $: t.Observable<t.MediaStreamStopped>;
  };

  status(ref: string): {
    ref: string;
    req$: t.Observable<t.MediaStreamStatusReq>;
    res$: t.Observable<t.MediaStreamStatusRes>;
    get(): Promise<t.MediaStreamStatusRes>;
  };

  record(input: string | MediaStream): {
    ref: string;
    status: {
      req$: t.Observable<t.MediaStreamStatusReq>;
      res$: t.Observable<t.MediaStreamStatusRes>;
      get(): Promise<t.MediaStreamStatusRes>;
    };

    start$: t.Observable<t.MediaStreamRecordStart>;
    started$: t.Observable<t.MediaStreamRecordStart>;
    start(): Promise<t.MediaStreamRecordStart>;

    stop$: t.Observable<t.MediaStreamRecordStop>;
    stopped$: t.Observable<t.MediaStreamRecordStopped>;
    stop(args?: {
      download?: t.MediaStreamRecordStop['download'];
      onData?: t.MediaStreamRecordStop['onData'];
    }): Promise<t.MediaStreamRecordStopped>;

    interrupt$: t.Observable<t.MediaStreamRecordInterrupt>;
    interrupted$: t.Observable<t.MediaStreamRecordInterrupt>;
    interrupt(action: t.MediaStreamRecordInterruptAction): Promise<t.MediaStreamRecordInterrupt>;

    pause(): Promise<t.MediaStreamRecordInterrupt>;
    resume(): Promise<t.MediaStreamRecordInterrupt>;
  };

  all: {
    status(): {
      req$: t.Observable<t.MediaStreamsStatusReq>;
      res$: t.Observable<t.MediaStreamsStatusRes>;
      get(kind?: t.MediaStreamKind): Promise<t.MediaStreamsStatusRes>;
    };
  };
};
