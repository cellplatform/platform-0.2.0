export const Stream = {
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
   * Retrieve a video camera stream.
   */
  async getVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: { ideal: true },
          noiseSuppression: { ideal: true },
        },
      });
      return stream;
    } catch (error) {
      console.error('Failed to get user video stream:', error);
      throw error;
    }
  },

  /**
   * Retrieve a screen share stream.
   */
  async getScreen() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      return stream;
    } catch (error) {
      console.error('Failed to get user screenshare:', error);
      throw error;
    }
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
} as const;
