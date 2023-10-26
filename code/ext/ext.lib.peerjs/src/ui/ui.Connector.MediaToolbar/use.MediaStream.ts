import { useEffect, useState, useRef } from 'react';

import { type t } from './common';
import { Media } from './Media';

let _singleton: MediaStream | undefined;

export function useMediaStream() {
  const [getting, setGetting] = useState(false);
  const [stream, setStream] = useState<MediaStream | undefined>();

  /**
   * API
   */
  return {
    getting,
    stream,

    async start() {
      if (!_singleton) {
        setGetting(true);
        _singleton = await Media.getStream();
        setGetting(false);
      }
      setStream(_singleton);
    },

    async stop() {
      if (!stream) return;
      Media.stopStream(stream);
      setStream(undefined);
      _singleton;
    },
  } as const;
}
