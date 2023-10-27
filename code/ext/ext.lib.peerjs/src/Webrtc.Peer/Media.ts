import { type t } from './common';

export const MediaUtil = {
  async getStream() {
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

  stopStream(stream?: MediaStream) {
    stream?.getTracks().forEach((track) => track.stop());
  },
} as const;
