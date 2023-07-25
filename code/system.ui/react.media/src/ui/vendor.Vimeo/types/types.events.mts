import { type t } from '../common';

type Id = string;
type Seconds = number;
type Milliseconds = number;

/**
 * Event API.
 */
export type VimeoEvents = t.Disposable & {
  readonly $: t.Observable<VimeoEvent>;
  readonly instance: { bus: Id; id: Id };
  readonly is: { base(input: any): boolean };
  readonly enabled: boolean;

  load: {
    req$: t.Observable<VimeoLoadReq>;
    res$: t.Observable<VimeoLoadRes>;
    fire(
      video: t.VimeoId,
      options?: { muted?: boolean; timeout?: Milliseconds },
    ): Promise<VimeoPlayRes>;
  };

  status: {
    $: t.Observable<t.VimeoStatus>;
    req$: t.Observable<VimeoStatusReq>;
    res$: t.Observable<VimeoStatusRes>;
    loaded$: t.Observable<t.VimeoStatus>;
    playing$: t.Observable<t.VimeoStatus>;
    get(options?: { timeout?: Milliseconds }): Promise<VimeoStatusRes>;
  };

  play: {
    req$: t.Observable<VimeoPlayReq>;
    res$: t.Observable<VimeoPlayRes>;
    fire(options?: { timeout?: Milliseconds }): Promise<VimeoPlayRes>;
    toggle(): Promise<{ isPlaying: boolean }>;
  };

  pause: {
    req$: t.Observable<VimeoPauseReq>;
    res$: t.Observable<VimeoPauseRes>;
    fire(options?: { timeout?: Milliseconds }): Promise<VimeoPauseRes>;
  };

  seek: {
    req$: t.Observable<VimeoSeekReq>;
    res$: t.Observable<VimeoSeekRes>;
    fire(seconds: Seconds, options?: { timeout?: Milliseconds }): Promise<VimeoSeekRes>;
    offset(by: Seconds): Promise<{ seconds: number }>;
    start(): Promise<void>;
    end(): Promise<void>;
  };
};

/**
 * Events
 */
export type VimeoEvent =
  | VimeoLoadReqEvent
  | VimeoLoadResEvent
  | VimeoStatusEvent
  | VimeoStatusReqEvent
  | VimeoStatusResEvent
  | VimeoPlayReqEvent
  | VimeoPlayResEvent
  | VimeoPauseReqEvent
  | VimeoPauseResEvent
  | VimeoSeekReqEvent
  | VimeoSeekResEvent;

/**
 * Loads a video into the player.
 */
export type VimeoLoadReqEvent = {
  type: 'Vimeo/load:req';
  payload: VimeoLoadReq;
};
export type VimeoLoadReq = { instance: Id; tx?: Id; video: t.VimeoId; muted?: boolean };

export type VimeoLoadResEvent = {
  type: 'Vimeo/load:res';
  payload: VimeoLoadRes;
};
export type VimeoLoadRes = {
  instance: Id;
  tx: Id;
  action: 'loaded' | 'none:already-loaded';
  status?: t.VimeoStatus;
  error?: string;
};

/**
 * Fires while video plays starts and stops.
 */
export type VimeoStatusEvent = {
  type: 'Vimeo/status';
  payload: t.VimeoStatus;
};

export type VimeoStatusReqEvent = { type: 'Vimeo/status:req'; payload: VimeoStatusReq };
export type VimeoStatusReq = { instance: Id; tx?: Id };

export type VimeoStatusResEvent = { type: 'Vimeo/status:res'; payload: VimeoStatusRes };
export type VimeoStatusRes = {
  instance: Id;
  tx: Id;
  status?: t.VimeoStatus;
  error?: string;
};

/**
 * Requests that the video moves to the given frame.
 */
export type VimeoSeekReqEvent = {
  type: 'Vimeo/seek:req';
  payload: VimeoSeekReq;
};
export type VimeoSeekReq = { instance: Id; tx?: Id; seconds: Seconds };

export type VimeoSeekResEvent = {
  type: 'Vimeo/seek:res';
  payload: VimeoSeekRes;
};
export type VimeoSeekRes = { instance: Id; tx: Id; error?: string };

/**
 * Requests that the video starts playing
 */
export type VimeoPlayReqEvent = {
  type: 'Vimeo/play:req';
  payload: VimeoPlayReq;
};
export type VimeoPlayReq = { instance: Id; tx?: Id };

export type VimeoPlayResEvent = {
  type: 'Vimeo/play:res';
  payload: VimeoPlayRes;
};
export type VimeoPlayRes = { instance: Id; tx: Id; error?: string };

/**
 * Requests that the video pauses.
 */
export type VimeoPauseReqEvent = {
  type: 'Vimeo/pause:req';
  payload: VimeoPauseReq;
};
export type VimeoPauseReq = { instance: Id; tx?: Id };

export type VimeoPauseResEvent = {
  type: 'Vimeo/pause:res';
  payload: VimeoPauseRes;
};
export type VimeoPauseRes = { instance: Id; tx: Id; error?: string };
