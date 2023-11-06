import { type t } from './common';

/**
 * Retrieve a video camera stream.
 */
export async function getVideo(): Promise<t.GetMediaResponse> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: { ideal: true },
        noiseSuppression: { ideal: true },
      },
    });
    return { stream };
  } catch (error: any) {
    console.error('Failed to get user-video stream:', error);
    return { error };
  }
}

/**
 * Retrieve a screen-share stream.
 */
export async function getScreen(): Promise<t.GetMediaResponse> {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
    return { stream };
  } catch (error: any) {
    console.error('Failed to get screenshare stream:', error);
    return { error };
  }
}
