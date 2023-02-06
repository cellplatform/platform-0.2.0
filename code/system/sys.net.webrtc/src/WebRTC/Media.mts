import { t, rx, slug, MediaStream } from '../common';

type T = {
  ref: string;
  events: t.MediaStreamEvents;
  getStream: t.PeerGetMediaStream;
};
type C = { [key: string]: T };

const cache: C = {};
const _singletonBus = rx.bus();

export const Media = {
  singleton(options: { bus?: t.EventBus<any> } = {}) {
    const bus = options.bus ?? _singletonBus;
    const busid = rx.bus.instance(bus);
    if (cache[busid]) return cache[busid] as T;

    const ref = `media.${slug()}`;
    const events = MediaStream.Events(bus);
    MediaStream.Controller({ bus });

    const done = async () => {
      await events.stop(ref).fire();
    };

    const getStream: t.PeerGetMediaStream = async () => {
      await done();
      await events.start(ref).video();
      const { stream } = await events.status(ref).get();
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
