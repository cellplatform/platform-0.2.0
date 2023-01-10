import { useEffect, useState } from 'react';
import { MediaStreamEvents } from './MediaStream.Events';
import { t } from '../../common';

/**
 * Monitors for the start of a referenced stream
 */
export function useStreamState(args: { bus: t.EventBus<any>; ref?: string }) {
  const { bus, ref } = args;
  const [stream, setStream] = useState<MediaStream | undefined>();

  useEffect(() => {
    const events = MediaStreamEvents(bus);

    if (!ref) setStream(undefined);
    if (ref) {
      const getAndSet = async () => {
        const res = await events.status(ref).get();
        setStream(res.stream?.media);
      };

      events.started(ref).$.subscribe((e) => setStream(e.stream));
      events.stopped(ref).$.subscribe((e) => setStream(undefined));

      if (!stream) getAndSet();
    }

    return () => events.dispose();
  }, [bus, ref]); // eslint-disable-line

  return stream;
}
