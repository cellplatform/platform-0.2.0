import { type t, DEFAULTS } from './common';
import { useEffect, useState, useRef } from 'react';

import { type PlayerProps } from '@vime/react';

type Args = {
  video?: t.VideoDef;
};

/**
 * Manages monitoring and reporting on the state of a video.
 */
export function useStateController(args: Args) {
  const [video, setVideo] = useState<t.VideoDef>(DEFAULTS.unknown);
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState(-1);
  const [current, setCurrent] = useState(-1);

  const reset = () => {
    setVideo(args.video ?? DEFAULTS.unknown);
    setReady(false);
    setDuration(-1);
    setCurrent(-1);
  };

  /**
   * Lifecycle.
   */
  useEffect(reset, [args.video?.id, args.video?.kind]);

  /**
   * Handlers
   */
  const onVmReady = (e: CustomEvent<void>) => {
    console.log('onVmReady', e);
    setReady(true);
  };

  const onVmCurrentTimeChange = (e: CustomEvent<number>) => {
    console.log('time change', e);

    // setCurrentTime(event.detail);
  };

  const onVmCurrentSrcChange = (e: CustomEvent<PlayerProps['currentSrc']>) => {
    console.log('onVmCurrentSrcChange', e);
  };

  const onVmDurationChange = (e: CustomEvent<number>) => {
    console.log('duration change', e);
  };

  const handlers = {
    onVmReady,
    onVmCurrentSrcChange,
    onVmCurrentTimeChange,
    onVmDurationChange,
  } as const;

  /**
   * API
   */
  const api = {
    def: video,
    ready,
    handlers,
  } as const;
  return api;
}
