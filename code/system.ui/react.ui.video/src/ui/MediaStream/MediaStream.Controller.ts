import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { R, rx, t, slug } from '../../common';
import { StreamUtil } from './util';

type Refs = { [ref: string]: Ref };
type Ref = {
  kind: t.MediaStreamKind;
  ref: string;
  media: MediaStream;
  constraints: MediaStreamConstraints;
};

/**
 * Manages an event bus dealing with a MediaStream.
 */
export function MediaStreamController(args: { bus: t.EventBus<any> }) {
  const dispose$ = new Subject<void>();
  const bus = args.bus as t.EventBus<t.MediaEvent>;
  const $ = bus.$.pipe(takeUntil(dispose$));
  const refs: Refs = {};

  const error = (ref: string, error: string) => {
    bus.fire({
      type: 'MediaStream/error',
      payload: { ref, kind: 'stream:error', error },
    });
  };

  const toStatus = (ref: string): t.MediaStreamStatus | undefined => {
    const item = refs[ref];
    if (!item) return undefined;

    const { media, constraints, kind } = item;
    const tracks = toTracks(media);
    const isEnded = tracks.every((track) => track.state === 'ended');

    return { ref, kind, isEnded, media, constraints, tracks };
  };

  /**
   * STATUS
   */
  rx.payload<t.MediaStreamStatusReqEvent>($, 'MediaStream/status:req')
    .pipe()
    .subscribe((e) => {
      const { ref } = e;
      let stream = toStatus(ref);

      if (stream?.isEnded) {
        // Ensure the stream has not ended, and if so, perform a proper STOP
        // operation on it before returning the new status.
        bus.fire({ type: 'MediaStream/stop', payload: { ref } });
        stream = toStatus(ref);
      }

      bus.fire({
        type: 'MediaStream/status:res',
        payload: { ref, stream },
      });
    });

  rx.payload<t.MediaStreamsStatusReqEvent>($, 'MediaStreams/status:req')
    .pipe()
    .subscribe((e) => {
      const streams = Object.keys(refs)
        .map((key) => toStatus(key) as t.MediaStreamStatus)
        .filter(Boolean)
        .filter((item) => (e.kind === undefined ? true : item?.kind === e.kind));

      bus.fire({
        type: 'MediaStreams/status:res',
        payload: { streams },
      });
    });

  /**
   * START:VIDEO
   * Connect to local-device media (camera/audio).
   */
  rx.payload<t.MediaStreamStartEvent>($, 'MediaStream/start')
    .pipe(filter((e) => e.kind === 'video'))
    .subscribe(async (e) => {
      const { ref } = e;
      const tx = e.tx || slug();

      if (refs[ref] && refs[ref].kind !== 'video') {
        const kind = refs[ref].kind;
        const err = `The stream '${ref}' is already in use as a '${kind}' stream.`;
        return error(ref, err);
      }

      type M = MediaStreamConstraints;

      // HACK: ts-compiler throwing problems with [MediaTrackConstraintSet]
      //       type.  Reconstructed here (drop this later when [lib.dom] types calm down).
      type A = {
        echoCancellation?: ConstrainBoolean;
        noiseSuppression?: ConstrainBoolean;
        autoGainControl?: ConstrainBoolean;
      };

      if (!refs[ref]) {
        const audio: A = {
          /**
           * 🐷
           * NOTE: experiment, turning off audio algorithmic options
           *       to see if this supresses issues with recording audio
           *       in the first 2-5 seconds.
           */

          echoCancellation: { ideal: true },
          noiseSuppression: { ideal: true } as any,
          // autoGainControl: { ideal: true },
        };

        const base: M = {
          video: true,
          audio,
        };
        const constraints = R.mergeDeepRight<M, M>(base, (e.constraints || {}) as M) as M;
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        refs[ref] = { kind: 'video', ref, media: stream, constraints };
      }

      const { media: stream } = refs[ref];

      bus.fire({
        type: 'MediaStream/started',
        payload: { ref, tx, stream },
      });
    });

  /**
   * START:SCREEN
   * Start a screen capture of the local screen.
   */
  rx.payload<t.MediaStreamStartEvent>($, 'MediaStream/start')
    .pipe(filter((e) => e.kind === 'screen'))
    .subscribe(async (e) => {
      const { ref } = e;
      const tx = e.tx || slug();

      if (refs[ref] && refs[ref].kind !== 'screen') {
        const kind = refs[ref].kind;
        const err = `The stream '${ref}' is already in use as a '${kind}' stream.`;
        return error(ref, err);
      }

      if (!refs[ref]) {
        const constraints: any = {
          video: true,
          audio: false,
        };
        const stream = await (navigator.mediaDevices as any).getDisplayMedia(constraints);
        refs[ref] = { kind: 'screen', ref, media: stream, constraints };
      }

      const { media: stream } = refs[ref];

      // Monitor for when the track ends which will happen when the stream
      // is closed externally by the host OS, for example when the
      // "stop screen sharing" button is clicked.
      StreamUtil.onEnded(stream, () => {
        bus.fire({ type: 'MediaStream/stop', payload: { ref } });
      });

      bus.fire({
        type: 'MediaStream/started',
        payload: { ref, tx, stream },
      });
    });

  /**
   * STOP a media stream.
   */
  rx.payload<t.MediaStreamStopEvent>($, 'MediaStream/stop')
    .pipe()
    .subscribe((e) => {
      const { ref } = e;
      const stream = refs[ref]?.media;
      delete refs[ref];

      (stream?.getTracks() || []).forEach((track) => track.stop());
      const tracks = toTracks(stream);

      bus.fire({
        type: 'MediaStream/stopped',
        payload: { ref, tracks },
      });
    });

  return {
    dispose$: dispose$.asObservable(),
    dispose() {
      dispose$.next();
      Object.keys(refs).forEach((key) => delete refs[key]);
    },
  };
}

/**
 * [Helpers]
 */

function toTracks(stream?: MediaStream) {
  return (stream?.getTracks() || []).map(toTrack);
}

function toTrack(input: MediaStreamTrack): t.MediaStreamTrack {
  const { id, enabled: isEnabled, label, readyState: state } = input;
  const kind = input.kind as t.MediaStreamTrack['kind'];
  return { kind, id, isEnabled, label, state };
}
