import { t, rx, slug, MediaStream } from '../common';

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
   * (optionally for the given bus, otherwise the default singleton bus is used)
   */
  singleton(options: { bus?: t.EventBus<any> } = {}) {
    const bus = options.bus ?? _singletonBus;
    const busid = rx.bus.instance(bus);
    if (cache[busid]) return cache[busid] as T;

    const ref = generateRef();
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
      console.log('kind', kind);
      await done();

      if (kind === 'camera') await events.start(ref.camera).video();
      if (kind === 'screen') await events.start(ref.screen).screen();

      const { stream } = await events.status(ref[kind]).get();
      const media = stream?.media;
      return { media, done };
    };

    const api: T = {
      ref,
      events,
      getStream,
    };

    cache[busid] = api;
    return api;
  },
};

/**
 * Helpers
 */
function generateRef(): T['ref'] {
  const base = `media.${slug()}`;
  return {
    camera: `${base}:camera`,
    screen: `${base}:screen`,
  };
}
