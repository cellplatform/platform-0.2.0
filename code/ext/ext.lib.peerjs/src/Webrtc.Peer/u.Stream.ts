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
    let _video: t.GetMediaResponse | undefined;
    let _screen: t.GetMediaResponse | undefined;

    const releaseUnused = (kind: t.PeerConnectionMediaKind, media?: t.GetMediaResponse) => {
      if (get.conn.itemsByKind(state.current, kind).length > 0) return media;
      const stream = media?.stream;
      if (stream) Stream.stop(stream);
      return undefined;
    };

    return {
      async video() {
        if (!_video) _video = await Stream.getVideo();
        return _video;
      },
      async screen() {
        if (!_screen) _screen = await Stream.getScreen();
        return _screen;
      },
      purge() {
        _video = releaseUnused('media:video', _video);
        _screen = releaseUnused('media:screen', _screen);
      },
    } as const;
  },
} as const;
