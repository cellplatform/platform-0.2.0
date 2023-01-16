import { MediaStreamEvents, MediaStreamController, MediaStreamRecordController } from './logic';
import { useVideoStreamState, useOfflineState } from './use';
import { VideoStream } from './ui.VideoStream';

export type { VideoStreamProps } from './ui.VideoStream';
export * from './types';

export const MediaStream = {
  Events: MediaStreamEvents,

  Controller: MediaStreamController,
  RecordController: MediaStreamRecordController,

  useVideoStreamState,
  useOfflineState,
};

export {
  MediaStreamEvents,
  MediaStreamController,
  MediaStreamRecordController,
  VideoStream,
  useVideoStreamState,
  useOfflineState,
};
