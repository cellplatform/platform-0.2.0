import { Time } from './common';

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
};
