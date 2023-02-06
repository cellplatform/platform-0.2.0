import { BusEventsFs } from './BusEvents.Fs.mjs';
import { BusEventsIndexer } from './BusEvents.Indexer.mjs';
import { BusEventsIo } from './BusEvents.Io.mjs';
import { rx, t, Wrangle, Stream } from './common';

type FilesystemId = string;
type Milliseconds = number;

/**
 * Event API.
 */
export function BusEvents(args: {
  id: FilesystemId;
  bus: t.EventBus<any>;
  filter?: (e: t.FsBusEvent) => boolean;
  timeout?: Milliseconds; // Default timeout.
  toUint8Array?: t.FsBusToUint8Array;
  dispose$?: t.Observable<any>;
}): t.FsBusEvents {
  const { id } = args;
  const { dispose, dispose$ } = rx.disposable(args.dispose$);
  const bus = rx.busAsType<t.FsBusEvent>(args.bus);
  const is = BusEvents.is;
  const toUint8Array = args.toUint8Array ?? Stream.toUint8Array;

  const toTimeout = Wrangle.timeout(args.timeout);
  const timeout = toTimeout();

  const $ = bus.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => is.instance(e, id)),
    rx.filter((e) => args.filter?.(e) ?? true),
  );

  const changed$ = rx.payload<t.FsBusChangedEvent>($, 'sys.fs/changed');

  /**
   * Initialize sub-event API's
   */
  const io = BusEventsIo({ id, $, bus, timeout });
  const index = BusEventsIndexer({ id, $, bus, timeout });

  /**
   * Filesystem API.
   */
  const fs: t.FsBusEvents['fs'] = (input) => {
    const options = typeof input === 'string' ? { dir: input } : input;
    const { dir } = options ?? {};
    const timeout = toTimeout(options);
    const io = BusEventsIo({ id, $, bus, timeout });
    const index = BusEventsIndexer({ id, $, bus, timeout });
    return BusEventsFs({ dir, index, io, toUint8Array });
  };

  /**
   * Ready check.
   */
  const ready: t.FsReady = async (options = {}) => {
    const { timeout = 500, retries = 5 } = options;

    const ping = async (retries: number): Promise<t.FsReadyResponse> => {
      const ready = !(await io.info.get({ timeout })).error;
      if (!ready && retries > 1) return await ping(retries - 1); // <== RECURSION 🌳
      if (ready) return { ready: true };
      return {
        ready: false,
        error: {
          code: 'fs:client/timeout',
          message: `Filesystem '${id}' did not respond after ${retries} attempts`,
          path: '',
        },
      };
    };

    return await ping(retries);
  };

  /**
   * API
   */
  return { id, $, changed$, is, dispose, dispose$, ready, io, index, fs };
}

/**
 * Event matching.
 */
const matcher = (startsWith: string) => (input: any) => rx.isEvent(input, { startsWith });
BusEvents.is = {
  base: matcher('sys.fs/'),
  instance: (e: t.Event, id: FilesystemId) => BusEvents.is.base(e) && e.payload?.id === id,
};
