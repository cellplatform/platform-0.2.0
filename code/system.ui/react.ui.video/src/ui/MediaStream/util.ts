import { Time } from '../common';

/**
 * MediaStream helpers.
 */
export const StreamUtil = {
  /**
   * Fires a callback when all tracks witin a stream have "ended".
   */
  onEnded(stream: MediaStream, callback: () => void) {
    const tracks = stream.getTracks().map((track) => track.clone());
    const isEnded = () => tracks.every((track) => track.readyState === 'ended');
    const onTrackEnded = () => {
      if (isEnded()) callback();
    };
    tracks.forEach((track) => (track.onended = onTrackEnded));
  },
};

/**
 * Helpers for downloading files.
 */
export const FileUtil = {
  /**
   * Initiates a file download.
   */
  download(name: string, data: any) {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    Time.delay(100, () => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  },

  /**
   * Read a Blob/File object into a [Uint8Array].
   */
  toUint8Array(input: Blob | File) {
    return new Promise<Uint8Array>((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (result === null) throw new Error('File reader returned null');
          if (typeof result === 'string') return resolve(new TextEncoder().encode(result));
          if (typeof result === 'object') return resolve(new Uint8Array(result));
        };
        reader.readAsArrayBuffer(input);
      } catch (error) {
        reject(error);
      }
    });
  },
};
