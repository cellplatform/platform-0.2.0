import { MediaStreamEvents } from './MediaStream.Events';
import { MediaStreamController } from './MediaStream.Controller';
import { MediaStreamRecordController } from './MediaStream.RecordController';
import { useVideoStreamState, useOfflineState } from './hook';
import { VideoStream, VideoStreamProps } from './VideoStream';

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

export type { VideoStreamProps };
