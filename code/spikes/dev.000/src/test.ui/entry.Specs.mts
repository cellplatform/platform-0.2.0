import { ModuleSpecs as DevSpecs } from 'sys.ui.react.dev';
import { Specs as CommonSpecs, DevSpecs as ComonDevSpecs } from 'sys.ui.react.common';
import { Specs as MonacoSpecs } from 'sys.ui.react.monaco';
import { Specs as VideoSpecs } from 'sys.ui.react.video';
import { Specs as WebRtcSpecs } from 'sys.net.webrtc';

export const Specs = {
  Root: () => import('../ui/Root/Root.SPEC'),
  ...CommonSpecs,
  ...ComonDevSpecs,
  ...DevSpecs,
  ...MonacoSpecs,
  ...VideoSpecs,
  ...WebRtcSpecs,
};
