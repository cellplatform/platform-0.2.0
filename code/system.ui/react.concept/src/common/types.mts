/**
 * @external
 */
export type { Observable } from 'rxjs';

/**
 * @system
 */
export type {
  Disposable,
  EdgePos,
  EdgePosition,
  EdgePositionInput,
  EventBus,
  Lifecycle,
  Milliseconds,
  Percent,
  PixelOrPercent,
  Pixels,
  Seconds,
  Size,
  Axis,
} from 'sys.types/src/types.mjs';

export type { SpecImport, TestSuiteRunResponse } from 'sys.test.spec/src/types.mjs';
export type { ImageSizeStrategy, ImageSrc } from 'sys.ui.react.media.image/src/types.mjs';
export type {
  VideoPlayerStatusHandler,
  VideoSrc,
  VideoSrcInput,
  VideoStatus,
} from 'sys.ui.react.media.video/src/types.mjs';

/**
 * @local
 */
export type * from '../types.mjs';
