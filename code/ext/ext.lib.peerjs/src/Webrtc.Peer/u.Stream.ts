import { type t } from './common';

export const StreamUtil = {
  stop(stream?: MediaStream) {
    stream?.getTracks().forEach((track) => track.stop());
  },

  async getUserVideo() {
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

  async getUserScreen() {
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
} as const;
