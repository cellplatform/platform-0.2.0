import { Video } from '../MediaStream.Video';

import {
  MediaStreamEvents as Events,
  MediaStreamController as Controller,
  MediaStreamRecordController as RecordController,
} from './logic';
import { useVideoStreamState, useOfflineState } from './use';

export const MediaStream = {
  Events,
  Controller,
  RecordController,
  Video,

  useVideoStreamState,
  useOfflineState,
};
