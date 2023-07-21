import { useEffect, useState } from 'react';
import { rx, type t } from '../common';

/**
 * Manages state from an event-but for the <VideoStream>.
 */
export function useVideoStreamState(args: {
  ref: string;
  bus: t.EventBus<any>;
  onChange?: (stream: MediaStream | undefined) => void;
}) {
  const { ref, onChange } = args;
  const bus = args.bus as t.EventBus<t.MediaEvent>;
  const [stream, setStream] = useState<MediaStream | undefined>();

  useEffect(() => {
    const dispose$ = new rx.Subject<void>();
    const $ = bus.$.pipe(rx.takeUntil(dispose$));

    const handleChange = (stream?: MediaStream) => {
      setStream(stream);
      if (onChange) onChange(stream);
    };

    rx.payload<t.MediaStreamStartedEvent>($, 'MediaStream/started')
      .pipe(rx.filter((e) => e.ref === ref))
      .subscribe((e) => handleChange(e.stream));

    rx.payload<t.MediaStreamStopEvent>($, 'MediaStream/stop')
      .pipe(rx.filter((e) => e.ref === ref))
      .subscribe((e) => handleChange(undefined));

    return () => dispose$.next();
  }, [bus, ref]); // eslint-disable-line

  return { stream };
}
