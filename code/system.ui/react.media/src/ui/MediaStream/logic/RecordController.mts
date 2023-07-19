import { Time, rx, type t, File } from '../common';
import { FileUtil } from '../util';

type M = 'video/webm';

/**
 * Manages recording a video stream (via the given stream "ref" identifier).
 */
export function MediaStreamRecordController(args: { bus: t.EventBus<any>; stream: MediaStream }) {
  const { stream } = args;
  const dispose$ = new rx.Subject<void>();
  const bus = rx.busAsType<t.MediaEvent>(args.bus);
  const $ = bus.$.pipe(rx.takeUntil(dispose$));
  const ref = stream.id;

  let recorder: ReturnType<typeof Recorder> | undefined;

  const error = (error: string) => {
    bus.fire({
      type: 'MediaStream/error',
      payload: { ref, kind: 'record:error', error },
    });
  };

  /**
   * Recording status.
   */
  rx.payload<t.MediaStreamRecordStatusReqEvent>($, 'MediaStream/record/status:req')
    .pipe(rx.filter((e) => e.ref === ref))
    .subscribe((e) => {
      const { ref, tx } = e;
      const status = recorder ? recorder.toStatus() : undefined;
      bus.fire({
        type: 'MediaStream/record/status:res',
        payload: { ref, tx, status },
      });
    });

  /**
   * Start recording.
   */
  rx.payload<t.MediaStreamRecordStartEvent>($, 'MediaStream/record/start')
    .pipe(rx.filter((e) => e.ref === ref))
    .subscribe((e) => {
      if (!stream) {
        const message = `Cannot start recording as a media stream has not been created yet.`;
        return error(message);
      }

      if (recorder) {
        return error(`A video recorder for the stream is already in progress.`);
      }

      const { mimetype = 'video/webm' } = e;
      recorder = Recorder({ stream, mimetype });

      bus.fire({
        type: 'MediaStream/record/started',
        payload: { ...e },
      });
    });

  /**
   * Pause/resume recording.
   */
  rx.payload<t.MediaStreamRecordInterruptEvent>($, 'MediaStream/record/interrupt')
    .pipe(rx.filter((e) => e.ref === ref))
    .subscribe(async (e) => {
      if (!recorder) {
        return error(`Cannot ${e.action} recording as it has not yet been started.`);
      }

      if (e.action === 'pause') recorder.pause();
      if (e.action === 'resume') recorder.resume();

      bus.fire({
        type: 'MediaStream/record/interrupted',
        payload: { ...e },
      });
    });

  /**
   * Stop recording.
   */
  rx.payload<t.MediaStreamRecordStopEvent>($, 'MediaStream/record/stop')
    .pipe(rx.filter((e) => e.ref === ref))
    .subscribe(async (e) => {
      const { ref } = e;

      if (!recorder) {
        return error(`Cannot stop recording as it has not yet been started.`);
      }

      const blob = await recorder.stop();
      if (e.download) FileUtil.download(e.download.filename, blob);
      if (typeof e.onData === 'function') {
        const { toUint8Array } = File;
        e.onData({
          blob,
          bytes: blob.size,
          mimetype: blob.type,
          toUint8Array,
        });
      }

      bus.fire({
        type: 'MediaStream/record/stopped',
        payload: { ref, file: blob },
      });

      recorder = undefined;
    });

  return {
    dispose$: dispose$.asObservable(),
    dispose: () => {
      dispose$.next();
      recorder?.dispose();
    },
  };
}

/**
 * A wrapper around the [MediaRecorder] API.
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
 */
function Recorder(args: { stream: MediaStream; mimetype: M }) {
  const { stream, mimetype } = args;
  const chunks: Blob[] = [];

  const recorder = new MediaRecorder(stream, { mimeType: mimetype });
  recorder.ondataavailable = (e) => chunks.push(e.data);

  const res = {
    stream,
    mimetype,
    isStopped: false,
    isPaused: false,
    startedAt: Time.now.timestamp,

    get blob() {
      return new Blob(chunks, { type: mimetype });
    },

    toStatus(): t.MediaStreamRecordStatus {
      let state: t.MediaStreamRecordStatus['state'] = 'recording';
      if (res.isPaused) state = 'paused';
      if (res.isStopped) state = 'stopped';
      const { startedAt } = res;
      return { state, startedAt };
    },

    stop() {
      res.isStopped = true;
      res.isPaused = false;
      return new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(res.blob);
        recorder.stop();
      });
    },

    pause() {
      recorder.pause();
      res.isPaused = true;
      return res;
    },

    resume() {
      recorder.resume();
      res.isPaused = false;
      return res;
    },

    dispose() {
      res.stop();
    },
  };

  recorder.start();
  return res;
}
