import { type t } from './common';
import { getFactory as getterFactory } from './u.get';
import { getVideo, getScreen } from './u.Stream.get';

export const Stream = {
  getVideo,
  getScreen,

  /**
   * Stop all tracks within the stream.
   */
  stop(stream?: MediaStream) {
    stream?.getTracks().forEach((track) => {
      track.stop();
      track.onended = null;
      track.onmute = null;
      track.onunmute = null;
    });
  },

  /**
   * Setup a callback
   */
  onEnded(stream: MediaStream, cb: () => void) {
    const tracks = stream.getVideoTracks();
    const total = tracks.length;
    let _ended = 0;

    const handleEnded = () => {
      _ended++;
      if (_ended === total) cb();
    };

    tracks.forEach((track) => {
      const fn = track.onended;
      track.onended = function (ev: Event) {
        handleEnded();
        if (typeof fn === 'function') fn.call(track, ev);
      };
    });
  },

  /**
   * Manages creating and releasing handles to streams.
   */
  memoryState(peerjs: t.PeerJs, state: t.PeerModelState) {
    const get = getterFactory(peerjs);
    let _video: MediaStream | undefined;
    let _screen: MediaStream | undefined;

    const releaseIfUnused = (kind: t.PeerConnectionMediaKind, stream?: MediaStream) => {
      if (get.conn.itemsByKind(state.current, kind).length > 0) return stream;
      if (stream) Stream.stop(stream);
      return undefined;
    };

    return {
      async video(): Promise<t.GetMediaResponse> {
        if (_video) return { stream: _video };
        const res = await getVideo();
        _video = res.stream;
        return res;
      },
      async screen(): Promise<t.GetMediaResponse> {
        if (_screen) return { stream: _screen };
        const res = await getScreen();
        _screen = res.stream;
        return res;
      },
      purge() {
        _video = releaseIfUnused('media:video', _video);
        _screen = releaseIfUnused('media:screen', _screen);
      },
    } as const;
  },
} as const;
