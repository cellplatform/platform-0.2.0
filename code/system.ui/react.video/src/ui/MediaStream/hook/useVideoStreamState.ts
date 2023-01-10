import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { rx, t } from '../../../common';

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
    const dispose$ = new Subject<void>();
    const $ = bus.$.pipe(takeUntil(dispose$));

    const handleChange = (stream?: MediaStream) => {
      setStream(stream);
      if (onChange) onChange(stream);
    };

    rx.payload<t.MediaStreamStartedEvent>($, 'MediaStream/started')
      .pipe(filter((e) => e.ref === ref))
      .subscribe((e) => handleChange(e.stream));

    rx.payload<t.MediaStreamStopEvent>($, 'MediaStream/stop')
      .pipe(filter((e) => e.ref === ref))
      .subscribe((e) => handleChange(undefined));

    return () => dispose$.next();
  }, [bus, ref]); // eslint-disable-line

  return { stream };
}
