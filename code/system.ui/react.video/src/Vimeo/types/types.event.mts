import { Disposable, Observable, t } from './common.mjs';

type Id = string;
type Seconds = number;
type Milliseconds = number;

/**
 * Event API.
 */
export type VimeoEventsFactory = {
  (args: {
    instance: t.VimeoInstance;
    isEnabled?: boolean;
    dispose$?: Observable<any>;
  }): VimeoEvents;
  is: VimeoEvents['is'];
};

export type VimeoEvents = Disposable & {
  $: Observable<VimeoEvent>;

  instance: { bus: Id; id: Id };
  is: { base(input: any): boolean };

  load: {
    req$: Observable<VimeoLoadReq>;
    res$: Observable<VimeoLoadRes>;
    fire(
      video: t.VimeoId,
      options?: { muted?: boolean; timeout?: Milliseconds },
    ): Promise<VimeoPlayRes>;
  };

  status: {
    $: Observable<t.VimeoStatus>;
    req$: Observable<VimeoStatusReq>;
    res$: Observable<VimeoStatusRes>;
    get(options?: { timeout?: Milliseconds }): Promise<VimeoStatusRes>;
  };

  play: {
    req$: Observable<VimeoPlayReq>;
    res$: Observable<VimeoPlayRes>;
    fire(options?: { timeout?: Milliseconds }): Promise<VimeoPlayRes>;
  };

  pause: {
    req$: Observable<VimeoPauseReq>;
    res$: Observable<VimeoPauseRes>;
    fire(options?: { timeout?: Milliseconds }): Promise<VimeoPauseRes>;
  };

  seek: {
    req$: Observable<VimeoSeekReq>;
    res$: Observable<VimeoSeekRes>;
    fire(seconds: Seconds, options?: { timeout?: Milliseconds }): Promise<VimeoSeekRes>;
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
