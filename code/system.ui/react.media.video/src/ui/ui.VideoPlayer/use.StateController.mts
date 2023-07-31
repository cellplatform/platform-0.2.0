import { useEffect, useRef, useState } from 'react';
import { Wrangle } from './Wrangle.mjs';
import { Time, DEFAULTS, type t } from './common';

import { type PlayerProps } from '@vime/react';

type Seconds = number;
type Args = {
  video?: t.VideoDef;
  playing?: boolean;
  loop?: boolean;
  hasInteracted?: boolean;
  onChange?: t.VideoPlayerChangeHandler;
};

/**
 * Manages monitoring and reporting on the state of a video.
 */
export function useStateController(args: Args) {
  const { playing = DEFAULTS.playing, loop = DEFAULTS.loop } = args;
  const def = args.video ? `${args.video.kind}.${args.video.id}` : 'empty';

  const ref = useRef<HTMLVmPlayerElement>(null);

  const [src, setSrc] = useState('');
  const [video, setVideo] = useState<t.VideoDef>(DEFAULTS.unknown);
  const [ready, setReady] = useState(false);
  const [total, setTotal] = useState<Seconds>(-1);
  const [current, setCurrent] = useState<Seconds>(0);
  const [buffered, setBuffered] = useState<Seconds>(0);
  const [buffering, setBuffering] = useState(false);

  const fireChange = (input?: t.VideoStatus) => {
    const status = input ?? api.status;
    args.onChange?.({ video, status });
  };

  const reset = () => {
    setVideo(args.video ?? DEFAULTS.unknown);
    setTotal(-1);
    setCurrent(0);
  };

  const play = () => ref.current?.play();
  const pause = () => ref.current?.pause();
  const seek = (secs: number) => {
    if (ref.current) ref.current.currentTime = secs;
  };
  const updatePlay = () => {
    if (playing) play();
    else pause();
  };

  /**
   * Lifecycle.
   */
  useEffect(() => {
    //
    // TEMP 🐷
    /**
     * TODO 🐷
     */
    seek(11);
  }, [Boolean(ref.current)]);

  useEffect(reset, [def]);
  useEffect(() => {
    Time.delay(0, updatePlay);
    // updatePlay();
  }, [def, playing, loop, args.hasInteracted]);
  useEffect(() => {
    //
    const status = api.status;
    fireChange(status);
    if (status.is.complete && status.is.playing) {
      seek(0);
      updatePlay();
    }
  }, [total, current, playing, ready]);

  /**
   * Handlers
   */
  const onVmReady = (e: CustomEvent<void>) => {
    setReady(true);
    updatePlay();
  };
  const onVmCurrentTimeChange = (e: CustomEvent<number>) => setCurrent(e.detail);
  const onVmCurrentSrcChange = (e: CustomEvent<PlayerProps['currentSrc']>) => {
    setSrc(e.detail ?? '');
  };
  const onVmDurationChange = (e: CustomEvent<number>) => {
    setTotal(e.detail);
    updatePlay();
  };
  const onVmBufferingChange = (e: CustomEvent<PlayerProps['buffering']>) => setBuffering(e.detail);
  const onVmBufferedChange = (e: CustomEvent<number>) => setBuffered(e.detail);
  // const onVmPlay = (e: CustomEvent<void>) => {};
  // const onVmPause = (e: CustomEvent<void>) => {};

  const handlers = {
    onVmReady,
    onVmCurrentSrcChange,
    onVmCurrentTimeChange,
    onVmDurationChange,
    // onVmPlay,
    // onVmPause,
    onVmBufferedChange,
    onVmBufferingChange,
  } as const;

  /**
   * API
   */
  const api = {
    ref,
    handlers,
    src,
    video,
    get ready() {
      return ready && total > -1;
    },
    get status(): t.VideoStatus {
      if (!api.ready || total <= 0) return DEFAULTS.emptyStatus;
      return Wrangle.toStatus({ total, current, buffered, playing, loop, buffering });
    },
  } as const;
  return api;
}
