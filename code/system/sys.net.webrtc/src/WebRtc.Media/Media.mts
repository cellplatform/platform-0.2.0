import { MediaStream, rx, type t } from '../common';

type T = {
  ref: { camera: string; screen: string };
  events: t.MediaStreamEvents;
  getStream: t.PeerGetMediaStream;
};
type C = { [key: string]: T };

const cache: C = {};
const _singletonBus = rx.bus();

export const Media = {
  /**
   * Retrieve a singleton of the Media controller
   * (optionally for the given bus, otherwise the
   *  default singleton bus is used).
   */
  singleton(options: { bus?: t.EventBus<any> } = {}) {
    const bus = options.bus ?? _singletonBus;
    const key = rx.bus.instance(bus);
    if (cache[key]) return cache[key] as T;

    const api = Media.create({ bus });
    cache[key] = api;
    return api;
  },

  /**
   * Creat a new instance.
   */
  create(options: { bus?: t.EventBus<any> } = {}) {
    const bus = options.bus ?? _singletonBus;
    const ref = generateRef(bus);
    const events = MediaStream.Events(bus);
    MediaStream.Controller({ bus });

    const done = async () => {
      await Promise.all([
        // Stop any existing streams.
        events.stop(ref.camera).fire(),
        events.stop(ref.screen).fire(),
      ]);
    };

    const getStream: t.PeerGetMediaStream = async (kind) => {
      if (kind === 'camera') {
        await events.stop(ref.camera).fire();
        await events.start(ref.camera).video();
      }
      if (kind === 'screen') {
        await events.stop(ref.screen).fire();
        await events.start(ref.screen).screen();
      }

      const { stream } = await events.status(ref[kind]).get();
      const media = stream?.media;
      return { media, done };
    };

    const api: T = {
      ref,
      events,
      getStream,
    };

    return api;
  },
} as const;

/**
 * Helpers
 */

function generateRef(bus: t.EventBus<any>): T['ref'] {
  const busid = rx.bus.instance(bus);
  const base = `media.${busid}`;
  return {
    camera: `${base}:camera`,
    screen: `${base}:screen`,
  };
}
